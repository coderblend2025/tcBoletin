<?php
declare(strict_types=1);

namespace App\Http\Controllers;

use App\Services\DolarBoliviaHoyScraper;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

final class DolarRateController extends Controller
{
    public function __invoke(DolarBoliviaHoyScraper $scraper): JsonResponse
    {
        $data = Cache::remember('dolarboliviahoy.rate', now()->addMinutes(10), function () use ($scraper) {
            return $scraper->fetch();
        });

        return response()->json([
            'success' => true,
            'data' => [
                'source'     => $data['source'],
                'buy'        => $data['buy'],
                'sell'       => $data['sell'],
                'fetched_at' => $data['fetched_at'],
            ],
        ]);
    }
}
