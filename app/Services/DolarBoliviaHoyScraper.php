<?php
declare(strict_types=1);

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Str;
use Symfony\Component\DomCrawler\Crawler;

final class DolarBoliviaHoyScraper
{
    private string $url = 'https://dolarboliviahoy.com/';

    public function fetch(): array
    {
        [$buy, $sell] = $this->scrapeSite();

        // Si la web devuelve 0s o no hay datos, cae a DolarApi (prefiero binance; si falla, oficial)
        if ($this->invalid($buy) || $this->invalid($sell)) {
            [$buy, $sell, $source] = $this->fallbackFromDolarApi();
            return [
                'source'     => $source,
                'buy'        => $buy,
                'sell'       => $sell,
                'fetched_at' => Date::now()->toIso8601String(),
            ];
        }

        return [
            'source'     => 'dolarboliviahoy.com',
            'buy'        => $buy,
            'sell'       => $sell,
            'fetched_at' => Date::now()->toIso8601String(),
        ];
    }

    /** HTTP client con verify configurable por env */
    private function http()
    {
        $envVerify = config('services.scraper_verify_ssl'); // null -> decide por entorno
        $verify = is_null($envVerify) ? !app()->isLocal() : filter_var($envVerify, FILTER_VALIDATE_BOOL);

        return Http::withOptions(['verify' => $verify])
            ->withHeaders([
                'User-Agent' => 'Mozilla/5.0 (compatible; Laravel12Scraper/1.0)',
                'Accept'     => 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            ])->retry(3, 250)->timeout(20);
    }

    /** Intenta extraer desde la web (puede venir 0.00) */
    private function scrapeSite(): array
    {
        $response = $this->http()->get($this->url);
        if (!$response->ok()) {
            return [null, null];
        }
        $html = $response->body();
        $crawler = new Crawler($html);

        [$buy, $sell] = $this->tryCssSelectors($crawler);

        if ($this->invalid($buy) && $this->invalid($sell)) {
            $texts = $this->extractVisibleTexts($crawler);
            [$buy, $sell] = $this->guessBuySellByText($texts);
            if ($this->invalid($buy) && $this->invalid($sell)) {
                [$buy, $sell] = $this->fallbackHeuristic($texts);
            }
        }
        return [$buy, $sell];
    }

    /** Fallback a DolarApi: primero binance, luego oficial */
    private function fallbackFromDolarApi(): array
    {
        // 1) Binance
        [$buy, $sell] = $this->fetchDolarApi('binance');
        if (!$this->invalid($buy) && !$this->invalid($sell)) {
            return [$buy, $sell, 'bo.dolarapi.com/binance'];
        }
        // 2) Oficial
        [$buy, $sell] = $this->fetchDolarApi('oficial');
        if (!$this->invalid($buy) && !$this->invalid($sell)) {
            return [$buy, $sell, 'bo.dolarapi.com/oficial'];
        }
        // 3) Nada
        return [null, null, 'fallback-failed'];
    }

    /** Llama a https://bo.dolarapi.com/v1/dolares/{tipo} (binance|oficial) */
    private function fetchDolarApi(string $tipo): array
    {
        $endpoint = $tipo === 'binance'
            ? 'https://bo.dolarapi.com/v1/dolares/binance'
            : 'https://bo.dolarapi.com/v1/dolares/oficial';

        try {
            $r = $this->http()
                ->acceptJson()
                ->get($endpoint)
                ->throw()
                ->json();
            // La API devuelve claves 'compra' y 'venta'
            $buy  = isset($r['compra']) ? (float)$r['compra'] : null;
            $sell = isset($r['venta'])  ? (float)$r['venta']  : null;

            // Filtra valores ridículos
            if ($this->invalid($buy) || $this->invalid($sell)) {
                return [null, null];
            }
            return [$buy, $sell];
        } catch (\Throwable $e) {
            return [null, null];
        }
    }

    /** Considera inválido: null, <= 0, demasiado grande */
    private function invalid($n): bool
    {
        return $n === null || !is_numeric($n) || $n <= 0 || $n > 1000;
    }

    /** Ajusta selectores si identificas clases/IDs estables en la página */
    private function tryCssSelectors(Crawler $crawler): array
    {
        $buy = null; $sell = null;

        // Si descubres clases/IDs (ej. .buy/.sell), descomenta y ajusta:
        // $buyNode  = $crawler->filter('#compra, .compra, .buy:contains("Compra")');
        // $sellNode = $crawler->filter('#venta, .venta, .sell:contains("Venta")');
        // if ($buyNode->count())  { $buy  = $this->normNumberFromString($buyNode->first()->text('')); }
        // if ($sellNode->count()) { $sell = $this->normNumberFromString($sellNode->first()->text('')); }

        return [$buy, $sell];
    }

    private function extractVisibleTexts(Crawler $crawler): array
    {
        $nodes = $crawler->filter('h1,h2,h3,h4,h5,h6,p,li,div,span,td,th,strong,b,small');
        $out = [];
        foreach ($nodes as $node) {
            $t = trim(preg_replace('/\s+/u', ' ', $node->textContent ?? ''));
            if ($t !== '' && mb_strlen($t) >= 2) $out[] = $t;
        }
        return array_slice(array_values(array_unique($out)), 0, 1200);
    }

    private function guessBuySellByText(array $texts): array
    {
        $buy = null; $sell = null;
        foreach ($texts as $t) {
            $low = Str::lower($t);

            if ($buy === null && Str::contains($low, 'compra')) {
                if (preg_match('/compra[^0-9]*([0-9]+[.,][0-9]+)/u', $low, $m) ||
                    preg_match('/([0-9]+[.,][0-9]+)[^0-9]*compra/u', $low, $m)) {
                    $buy = $this->normNumber($m[1]);
                }
            }
            if ($sell === null && Str::contains($low, 'venta')) {
                if (preg_match('/venta[^0-9]*([0-9]+[.,][0-9]+)/u', $low, $m) ||
                    preg_match('/([0-9]+[.,][0-9]+)[^0-9]*venta/u', $low, $m)) {
                        $sell = $this->normNumber($m[1]);
                }
            }
            if ($buy !== null && $sell !== null) break;
        }
        return [$buy, $sell];
    }

    private function fallbackHeuristic(array $texts): array
    {
        $nums = [];
        foreach ($texts as $t) {
            if (preg_match_all('/\b([0-9]+[.,][0-9]+)\b/u', $t, $mm)) {
                foreach ($mm[1] as $n) {
                    $val = $this->normNumber($n);
                    if ($val > 0 && $val < 1000) $nums[] = $val;
                }
            }
        }
        sort($nums);
        for ($i = 0; $i < count($nums) - 1; $i++) {
            $a = $nums[$i]; $b = $nums[$i+1];
            if (abs($a - $b) > 0 && abs($a - $b) <= 0.6) {
                return [min($a,$b), max($a,$b)];
            }
        }
        return [null, null];
    }

    private function normNumberFromString(string $s): ?float
    {
        if (preg_match('/([0-9]+[.,][0-9]+)/u', $s, $m)) {
            return $this->normNumber($m[1]);
        }
        return null;
    }

    private function normNumber(string $s): float
    {
        $s = str_replace([' ', ','], ['', '.'], trim($s));
        return (float) $s;
    }
}
