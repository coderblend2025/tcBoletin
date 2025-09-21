import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface ExchangeRate { buy: number; sell: number; }
interface GoogleMapWithUIProps { bcvInfo?: string; binanceInfo?: string; }

// Paleta de marca
const PC = {
  azulOscuro: '#00223A',
  azul: '#0370B1',
  verde: '#049C3A',
  azulSec: '#01446B',
};

interface Rate {
  price_sale: string | number | null;
  price_buy: string | number | null;
  location: string;
  ubication: string;
  lat: number | string | null;
  lng: number | string | null;
  updated_at?: string; // opcional, llega del backend
}

/** Helper global: convierte string/number a number o null */
const toNum = (v: unknown) => {
  if (v === null || v === undefined) return null;
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  if (typeof v === 'string') {
    const n = Number(v.replace(',', '.'));
    return Number.isFinite(n) ? n : null;
  }
  return null;
};

/** Helper global: centra mapa y deja marcador con rebote temporal */
const focusWithBounce = (
  map: google.maps.Map | null,
  position: { lat: number; lng: number },
  title: string = 'Ubicación'
) => {
  if (!map) return;
  map.panTo(position);
  const currentZoom = map.getZoom() || 13;
  if (currentZoom < 16) map.setZoom(16);
  const marker = new google.maps.Marker({
    position,
    map,
    title,
    animation: google.maps.Animation.BOUNCE,
    icon: { url: '/pictures/location.png', scaledSize: new google.maps.Size(36, 36) },
  });
  setTimeout(() => marker.setMap(null), 2200);
};

export default function GoogleMapWithUI({ bcvInfo: propBcvInfo, binanceInfo: propBinanceInfo }: GoogleMapWithUIProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [locations, setLocations] = useState<any[]>([]);
  const [bestRates, setBestRates] = useState<Rate[]>([]);

  const [bcvInfo, setBcvInfo] = useState<string>(propBcvInfo || '');
  const [binanceInfo, setBinanceInfo] = useState<string>(propBinanceInfo || '');
  const [currentTab, setCurrentTab] = useState<'best' | 'points'>('best');

  // Loaders por sección
  const [bestRate, setBestRate] = useState<any | null>(null);
  const [bestLoading, setBestLoading] = useState<boolean>(true);
  const [pointsLoading, setPointsLoading] = useState<boolean>(false);
  const [tableLoading, setTableLoading] = useState<boolean>(false);

  /** Textos BCV/Binance cuando no llegan por props */
  const fetchExchangeStaticTexts = useCallback(() => {
    if (!propBcvInfo || !propBinanceInfo) {
      const bcvData: ExchangeRate = { buy: 6.96, sell: 6.86 };
      const binanceData: ExchangeRate = { buy: 13.16, sell: 11.97 };
      const currentDate = new Date().toLocaleDateString('es-BO', { day: '2-digit', month: '2-digit', year: 'numeric' });

      setBcvInfo(`Banco Central de Bolivia: Compra Bs ${bcvData.buy} • Venta Bs ${bcvData.sell}`);
      setBinanceInfo(`Binance Bs/USDT: Compra Bs ${binanceData.buy} • Venta Bs ${binanceData.sell} (08:00 • ${currentDate})`);
    }
  }, [propBcvInfo, propBinanceInfo]);

  /** Mejor cambio (single) para el panel izquierdo */
  const fetchBestUsdSaleSingle = useCallback(async () => {
    try {
      setBestLoading(true);
      const res = await fetch('/money-changers/best-usd-sale', {
        headers: { Accept: 'application/json' },
      });
      const txt = await res.text();
      let result: any;
      try { result = JSON.parse(txt); } catch { result = null; }

      const raw = result?.data || {};
      const price_sale = toNum(raw.price_sale);
      const price_buy  = toNum(raw.price_buy);

      if (price_sale !== null && price_buy !== null) {
        setBestRate({
          ...raw,
          price_sale,
          price_buy,
          updated_at: raw.updated_at || new Date().toISOString(),
          exchange_type: 'USD/BOB',
        });
      } else {
        setBestRate(null);
        console.warn('best-usd-sale payload no válido:', raw ?? txt);
      }
    } catch (e) {
      console.error('Error mejor cambio:', e);
      setBestRate(null);
    } finally {
      setBestLoading(false);
    }
  }, []);

  /** Lista de ubicaciones (puntos) */
  const fetchLocations = useCallback(async () => {
    try {
      const res = await fetch('/money-changers', { headers: { Accept: 'application/json' } });
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        const formatted = result.data.map((item: any) => ({
          id: item.id,
          title: item.name,
          code: item.code,
          description: `${item.ubication_name}<br/>Venta: ${item.latest_price?.price_sale ?? 'N/D'} Bs • Compra: ${item.latest_price?.price_buy ?? 'N/D'} Bs`,
          position: { lat: Number(item.lan), lng: Number(item.log) },
          venta: toNum(item.latest_price?.price_sale),
          compra: toNum(item.latest_price?.price_buy),
          actualizado: item.latest_price?.updated_at ?? null
        }));
        setLocations(formatted);
        return formatted;
      }
    } catch (e) {
      console.error('Error ubicaciones:', e);
    }
    setLocations([]);
    return [];
  }, []);

  /** Lista de mejores cambios (tabla y panel de puntos combinados) */
  const fetchBestUsdSalesList = useCallback(async () => {
    try {
      const res = await fetch('/money-changers/all-best-usd-sales', { headers: { Accept: 'application/json' } });
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        const normalized = (result.data as Rate[]).map((r) => ({
          ...r,
          price_sale: toNum(r.price_sale),
          price_buy:  toNum(r.price_buy),
          lat: toNum(r.lat),
          lng: toNum(r.lng),
        })) as Rate[];
        setBestRates(normalized);
      } else {
        setBestRates([]);
      }
    } catch (e) {
      console.error('Error mejores cambios:', e);
      setBestRates([]);
    }
  }, []);

  // Reflejar props iniciales si llegan
  useEffect(() => {
    if (propBcvInfo) setBcvInfo(propBcvInfo);
    if (propBinanceInfo) setBinanceInfo(propBinanceInfo);
  }, [propBcvInfo, propBinanceInfo]);

  // Inicialización del mapa + datos iniciales
  useEffect(() => {
    let script: HTMLScriptElement | null = null;

    const initMap = (center: google.maps.LatLngLiteral, locationsData: any[]) => {
      const googleMap = new window.google.maps.Map(mapRef.current!, {
        center, zoom: 13,
        styles: [{ featureType: 'all', elementType: 'all', stylers: [{ saturation: -50 }] }],
        disableDefaultUI: false, mapTypeControl: false, streetViewControl: false, fullscreenControl: false,
      });
      setMap(googleMap);
      setIsLoading(false);

      locationsData.forEach(location => {
        new window.google.maps.Marker({
          position: location.position,
          map: googleMap,
          title: location.code,
          icon: { url: '/pictures/location.png', scaledSize: new window.google.maps.Size(36, 36) },
          label: { text: location.code, color: PC.azulSec, fontWeight: 'bold', fontSize: '12px' },
        });
      });

      if (searchInputRef.current) {
        const searchBox = new window.google.maps.places.SearchBox(searchInputRef.current);
        searchBox.addListener('places_changed', () => {
          const places = searchBox.getPlaces();
          if (places && places.length > 0 && places[0].geometry?.location) {
            googleMap.setCenter(places[0].geometry.location);
            googleMap.setZoom(15);
          }
        });
      }
    };

    const startApp = async (userPosition: google.maps.LatLngLiteral) => {
      const locationsData = await fetchLocations();

      // cargamos a la vez: panel + lista para tabla
      await Promise.all([
        fetchBestUsdSaleSingle(),
        fetchBestUsdSalesList(),
      ]);

      fetchExchangeStaticTexts();

      if (window.google?.maps) {
        initMap(userPosition, locationsData);
      } else {
        script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDYuMfW-2HoL1ZvqW4RoCANUKPuHfux3TY&libraries=places`;
        script.async = true;
        script.onload = () => initMap(userPosition, locationsData);
        document.head.appendChild(script);
      }
    };

    navigator.geolocation.getCurrentPosition(
      pos => startApp({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      ()  => startApp({ lat: -17.393836, lng: -66.156872 })
    );

    return () => { if (script && document.head.contains(script)) document.head.removeChild(script); };
  }, [fetchBestUsdSaleSingle, fetchBestUsdSalesList, fetchLocations, fetchExchangeStaticTexts]);

  // ---- HANDLERS DE REFRESH POR SECCIÓN ----
  const refreshBestSection = useCallback(async () => {
    await fetchBestUsdSaleSingle();
  }, [fetchBestUsdSaleSingle]);

  const refreshPointsSection = useCallback(async () => {
    try {
      setPointsLoading(true);
      // Para el panel de puntos combinados, conviene refrescar locations y la lista de rates
      await Promise.all([fetchLocations(), fetchBestUsdSalesList()]);
    } finally {
      setPointsLoading(false);
    }
  }, [fetchLocations, fetchBestUsdSalesList]);

  const refreshTableSection = useCallback(async () => {
    try {
      setTableLoading(true);
      // La tabla usa locations + bestRates
      await Promise.all([fetchLocations(), fetchBestUsdSalesList()]);
    } finally {
      setTableLoading(false);
    }
  }, [fetchLocations, fetchBestUsdSalesList]);

  // --------- Memo combinado para Panel de Puntos ---------
  const combinedPointsData = useMemo(() => {
    return locations.map((loc: any) => {
      const rateInfo = bestRates.find((rate: any) => rate.location === loc.code);

      let dateObj: Date | null = null;
      if (loc.actualizado) {
        const parsed = new Date(loc.actualizado);
        if (!isNaN(parsed.getTime())) dateObj = parsed;
      }
      if (!dateObj && rateInfo?.updated_at) {
        const fixed = rateInfo.updated_at.replace(' ', 'T');
        const parsed = new Date(fixed);
        if (!isNaN(parsed.getTime())) dateObj = parsed;
      }

      return {
        code: loc.code,
        location: loc.title,
        sale: rateInfo?.price_sale ?? 'N/D',
        buy: rateInfo?.price_buy ?? 'N/D',
        date: dateObj
          ? dateObj.toLocaleDateString('es-BO', { day: '2-digit', month: '2-digit', year: 'numeric' })
          : 'N/D',
        time: dateObj
          ? dateObj.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit', hour12: true })
          : 'N/D',
        position: loc.position,
        venta: rateInfo?.price_sale ?? loc.venta,
        compra: rateInfo?.price_buy ?? loc.compra,
        actualizado: dateObj ? dateObj.toISOString() : null,
      };
    });
  }, [locations, bestRates]);

  return (
    <div className="relative w-full h-[100dvh] min-h-[540px] bg-white">
      {/* Loading general (mapa) */}
      {isLoading && (
        <div className="absolute inset-0 z-30 flex justify-center items-center bg-white/90 backdrop-blur-sm">
          <div className="text-center">
            <div className="animate-spin rounded-full h-14 w-14 border-b-4 mx-auto mb-4" style={{ borderColor: PC.azul }} />
            <p className="font-semibold text-lg" style={{ color: PC.azulSec }}>Cargando mapa…</p>
          </div>
        </div>
      )}

      {/* Mapa */}
      <div
        ref={mapRef}
        className="w-full h-full md:rounded-2xl md:border shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
        style={{ minHeight: '320px', borderColor: `${PC.azul}33` }}
      />

      {/* Barra de búsqueda */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 w-full px-3 sm:px-4 max-w-[1050px] md:top-2">
        <div
          className="flex rounded-xl shadow-xl backdrop-blur-lg overflow-hidden ring-1"
          style={{ background: 'rgba(255,255,255,0.96)', borderColor: `${PC.azul}33`, boxShadow: '0 8px 24px rgba(0,0,0,.06)' }}
        >
          <Input
            ref={searchInputRef}
            placeholder="Buscar ubicación…"
            className="flex-1 px-4 py-3 text-sm sm:text-base border-none focus:ring-0 focus:outline-none placeholder-gray-400 font-medium bg-transparent"
          />
          <Button
            variant="ghost"
            className="px-4 sm:px-5 border-l hover:bg-gray-50"
            style={{ borderColor: `${PC.azul}22` }}
          >
            <Search className="w-5 h-5" style={{ color: PC.azul }} />
          </Button>
        </div>
      </div>

      {/* Paneles desktop */}
      <div className="hidden md:block">
        <Card
          className="absolute top-24 left-4 p-4 z-10 w-80 lg:w-96 max-h-[70vh] overflow-y-auto rounded-xl ring-1"
          style={{ background: 'rgba(255,255,255,0.98)', borderColor: `${PC.azul}22`, boxShadow: '0 10px 32px rgba(0,0,0,.08)', color: PC.azulOscuro }}
        >
          <BestRatePanel
            bestRate={bestRate}
            bestLoading={bestLoading}
            map={map}
            onRefresh={refreshBestSection}
          />
        </Card>

        <Card
          className="absolute top-24 right-4 p-3 z-10 w-80 lg:w-96 max-h-[70vh] overflow-y-auto rounded-xl ring-1"
          style={{ background: 'rgba(255,255,255,0.98)', borderColor: `${PC.azul}22`, boxShadow: '0 10px 32px rgba(0,0,0,.08)', color: PC.azulOscuro }}
        >
          <PointsPanel
            locations={combinedPointsData}
            map={map}
            compact={false}
            loading={pointsLoading}
            onRefresh={refreshPointsSection}
          />
        </Card>
      </div>

      {/* Móvil: tabs inferiores */}
      <div className="md:hidden">
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <div
            className="mx-3 mb-3 rounded-2xl shadow-2xl ring-1"
            style={{ background: 'rgba(255,255,255,0.98)', borderColor: `${PC.azul}33` }}
          >
            <div className="grid grid-cols-2 gap-1 p-1">
              <button
                onClick={() => setCurrentTab('best')}
                className="py-2 rounded-xl text-sm font-bold border"
                style={{
                  background: currentTab === 'best' ? PC.azul : '#fff',
                  color: currentTab === 'best' ? '#fff' : PC.azulSec,
                  borderColor: `${PC.azul}33`,
                }}
              >
                💲 Mejor cambio
              </button>
              <button
                onClick={() => setCurrentTab('points')}
                className="py-2 rounded-xl text-sm font-bold border"
                style={{
                  background: currentTab === 'points' ? PC.azul : '#fff',
                  color: currentTab === 'points' ? '#fff' : PC.azulSec,
                  borderColor: `${PC.azul}33`,
                }}
              >
                📍 Puntos
              </button>
            </div>

            <div className="px-3 pb-3 max-h-[42vh] overflow-y-auto">
              {currentTab === 'best' ? (
                <BestRatePanel
                  bestRate={bestRate}
                  bestLoading={bestLoading}
                  map={map}
                  compact
                  onRefresh={refreshBestSection}
                />
              ) : (
                <PointsPanel
                  locations={combinedPointsData}
                  map={map}
                  compact
                  loading={pointsLoading}
                  onRefresh={refreshPointsSection}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabla unificada */}
      <div className="max-h-[48vh] overflow-auto">
        <ExchangePointsTable
          locations={locations}
          bestRates={bestRates}
          map={map}
          loading={tableLoading}
          onRefresh={refreshTableSection}
        />
      </div>
    </div>
  );
}

/* --------- Subcomponentes --------- */

// Panel de Mejor Tipo de Cambio
function BestRatePanel({
  bestRate,
  bestLoading,
  map,
  compact = false,
  onRefresh,
}: {
  bestRate: any;
  bestLoading: boolean;
  map: google.maps.Map | null;
  compact?: boolean;
  onRefresh: () => void;
}) {
  const saleNum = toNum(bestRate?.price_sale);
  const buyNum  = toNum(bestRate?.price_buy);
  const hasValidData = saleNum !== null && buyNum !== null;

  const latNum = toNum(bestRate?.lat);
  const lngNum = toNum(bestRate?.lng);

  const goToBestLocation = () => {
    if (map && latNum !== null && lngNum !== null) {
      focusWithBounce(map, { lat: latNum, lng: lngNum }, bestRate?.location || 'Mejor tipo de cambio');
    } else {
      console.warn('No hay lat/lng válidos para bestRate:', bestRate);
    }
  };

  const fmt = (n: number | null) =>
    n === null ? '—' : new Intl.NumberFormat('es-BO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(n);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 mb-2 pb-2 border-b" style={{ borderColor: `${PC.azul}1A` }}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow" style={{ background: PC.azul, border: `2px solid ${PC.azulSec}` }}>
            <img src="/pictures/trabajaconnosotros.png" alt="Punto de cambio" className="w-9 h-9 object-contain drop-shadow" />
          </div>
          <div className="flex flex-col justify-center">
            <h4 className="text-base sm:text-lg font-extrabold leading-tight tracking-tight" style={{ color: PC.azulSec }}>
              Mejor Tipo de Cambio
            </h4>
            <span
              className="inline-flex items-center gap-1 text-[12px] sm:text-xs rounded px-2 py-0.5 font-semibold mt-1"
              style={{ color: PC.azul, background: `${PC.azul}14` }}
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 16 16" className="inline-block mr-1">
                <circle cx="8" cy="8" r="7" stroke={PC.azul} strokeWidth="2"/><circle cx="8" cy="8" r="3" fill={PC.azul}/>
              </svg>
              Actualizado en tiempo real
            </span>
          </div>
        </div>

        <button
          onClick={onRefresh}
          className="text-xs font-bold px-3 py-1.5 rounded-lg border hover:bg-gray-50"
          style={{ color: PC.azulSec, borderColor: `${PC.azul}33` }}
          title="Actualizar sección"
        >
          ↻ Actualizar
        </button>
      </div>

      {bestLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="w-10 h-10 rounded-full mx-auto mb-3 animate-pulse" style={{ background: `${PC.azul}22` }} />
            <p className="text-sm font-semibold" style={{ color: PC.azulSec }}>Cargando información…</p>
          </div>
        </div>
      ) : hasValidData ? (
        <div className="space-y-2">
          <div className="flex items-center justify-center">
            <span className="text-[11px] px-1.5 py-0.5 rounded font-bold border"
                  style={{ color: PC.azul, background: `${PC.azul}14`, borderColor: `${PC.azul}33` }}>
              {bestRate?.exchange_type || 'USD/BOB'}
            </span>
          </div>

          <div className={`grid grid-cols-2 gap-2 ${compact ? 'text-[13px]' : ''}`}>
            <div className="rounded-md p-2 text-center border shadow-sm" style={{ background: '#fff', borderColor: `${PC.verde}33` }}>
              <p className="text-[11px] font-bold mb-0.5" style={{ color: PC.verde }}>Venta</p>
              <p className="font-extrabold text-lg leading-none" style={{ color: PC.verde }}>{fmt(saleNum)}</p>
              <p className="text-[11px] text-gray-500">Bs</p>
            </div>
            <div className="rounded-md p-2 text-center border shadow-sm" style={{ background: '#fff', borderColor: `${PC.azulSec}33` }}>
              <p className="text-[11px] font-bold mb-0.5" style={{ color: PC.azulSec }}>Compra</p>
              <p className="font-extrabold text-lg leading-none" style={{ color: PC.azulSec }}>{fmt(buyNum)}</p>
              <p className="text-[11px] text-gray-500">Bs</p>
            </div>
          </div>

          <p
            className="text-[11px] text-center pt-1 border-t cursor-pointer select-none hover:underline decoration-dotted"
            style={{ color: PC.azul, borderColor: `${PC.azul}1A` }}
            onClick={goToBestLocation}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') goToBestLocation(); }}
            role="button"
            tabIndex={0}
            title={latNum !== null && lngNum !== null ? 'Ver ubicación en el mapa' : 'Sin ubicación disponible'}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="inline-block mr-1 align-[-2px]">
              <path d="M12 22s7-5.686 7-12a7 7 0 10-14 0c0 6.314 7 12 7 12z" stroke={PC.azul} strokeWidth="2" fill="none"/>
              <circle cx="12" cy="10" r="3" stroke={PC.azul} strokeWidth="2" fill="none"/>
            </svg>
            Actualizado: {bestRate?.updated_at
              ? new Date(bestRate.updated_at).toLocaleDateString('es-BO', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' })
              : 'Fecha no disponible'}
          </p>
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-sm font-semibold" style={{ color: PC.azulSec }}>
            No se pudo obtener el mejor tipo de cambio.
          </p>
        </div>
      )}
    </div>
  );
}

function PointsPanel({
  locations,
  map,
  compact = false,
  loading = false,
  onRefresh,
}: {
  locations: any[];
  map: google.maps.Map | null;
  compact?: boolean;
  loading?: boolean;
  onRefresh: () => void;
}) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('es-ES'),
      time: date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  const fmt2 = (n: number | null) => (n === null ? '—' : n.toFixed(2));

  return (
    <div>
      <div
        className="flex items-center justify-between gap-2 mb-2 pb-2 border-b"
        style={{ borderColor: `${PC.azul}1A` }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow border"
            style={{ background: PC.azul, borderColor: PC.azulSec }}
          >
            <img
              src="/pictures/location.png"
              alt="Punto de cambio"
              className="w-7 h-7 object-contain drop-shadow"
            />
          </div>
          <h4
            className="font-extrabold text-sm sm:text-base"
            style={{ color: PC.azulSec }}
          >
            Puntos de Referencia Cambiaria
          </h4>
        </div>

        <button
          onClick={onRefresh}
          className="text-xs font-bold px-3 py-1.5 rounded-lg border hover:bg-gray-50"
          style={{ color: PC.azulSec, borderColor: `${PC.azul}33` }}
          title="Actualizar sección"
        >
          {loading ? 'Actualizando…' : '↻ Actualizar'}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-6">
          <div className="w-8 h-8 rounded-full mx-auto mb-2 animate-pulse" style={{ background: `${PC.azul}22` }} />
          <p className="text-sm font-semibold" style={{ color: PC.azulSec }}>Cargando puntos…</p>
        </div>
      ) : locations.length === 0 ? (
        <div className="text-center py-8">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-3 border shadow"
            style={{ background: `${PC.azul}14`, borderColor: `${PC.azul}33` }}
          >
            <img
              src="/pictures/location.png"
              alt="Sin puntos de cambio"
              className="w-14 h-14 object-contain drop-shadow"
            />
          </div>
          <p className="text-sm sm:text-base font-bold" style={{ color: PC.azulSec }}>
            No hay puntos de cambio registrados
          </p>
        </div>
      ) : (
        <div
          className={`space-y-2 ${compact ? 'max-h-[220px] overflow-y-auto -mr-1 pr-1' : ''}`}
          style={compact ? ({ WebkitOverflowScrolling: 'touch' } as any) : undefined}
        >
          {locations.map((loc, i) => {
            const formattedDate = loc.actualizado ? formatDate(loc.actualizado) : null;

            return (
              <button
                type="button"
                key={i}
                className="w-full text-left rounded-lg p-3 transition-all duration-200 hover:shadow border"
                style={{ background: '#fff', borderColor: `${PC.azul}22` }}
                onClick={() => {
                  focusWithBounce(map, loc.position, loc.code);
                }}
              >
                <div className="flex items-start gap-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border shadow"
                    style={{ background: `${PC.azul}22`, borderColor: `${PC.azul}33` }}
                  >
                    <span
                      className="text-sm font-extrabold"
                      style={{ color: PC.azulSec }}
                    >
                      {i + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5
                      className="font-extrabold text-[14px] mb-1 truncate"
                      style={{ color: PC.azulSec }}
                    >
                      {loc.code}
                    </h5>

                    <div className="text-[12px] font-semibold mb-1" style={{ color: PC.azul }}>
                      Venta: Bs{fmt2(loc.venta)} – Compra: Bs{fmt2(loc.compra)}
                    </div>

                    {formattedDate && (
                      <div className="text-[11px] opacity-75" style={{ color: PC.azul }}>
                        Actualizado: {formattedDate.date} – {formattedDate.time}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function BestRatesList({ map }: { map: google.maps.Map | null }) {
  const [rates, setRates] = useState<Rate[]>([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('es-ES'),
      time: date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  const fmt2 = (n: number | string | null) => {
    const num = toNum(n);
    return num === null ? '—' : num.toFixed(2);
  };

  useEffect(() => {
    fetch('/money-changers/all-best-usd-sales', { headers: { Accept: 'application/json' } })
      .then(res => res.json())
      .then(result => {
        if (result.success && Array.isArray(result.data)) {
          const normalized = (result.data as Rate[]).map((r) => ({
            ...r,
            price_sale: toNum(r.price_sale),
            price_buy:  toNum(r.price_buy),
            lat: toNum(r.lat),
            lng: toNum(r.lng),
          })) as Rate[];
          setRates(normalized);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6">
        <div className="text-center">
          <div className="w-8 h-8 rounded-full mx-auto mb-2 animate-pulse" style={{ background: `${PC.azul}22` }} />
          <p className="text-sm font-semibold" style={{ color: PC.azulSec }}>Cargando mejores tipos de cambio…</p>
        </div>
      </div>
    );
  }

  if (rates.length === 0) {
    return <p className="text-sm font-bold text-center" style={{ color: PC.azulSec }}>No hay tipos de cambio registrados</p>;
  }

  return (
    <div className="space-y-3">
      {rates.map((rate, i) => {
        const formattedDate = rate.updated_at ? formatDate(rate.updated_at) : null;

        return (
          <button
            type="button"
            key={i}
            onClick={() => {
              const position = { lat: Number(rate.lat), lng: Number(rate.lng) };
              focusWithBounce(map, position, rate.location);
            }}
            className="w-full text-left cursor-pointer transition rounded-lg p-3 border shadow-sm flex items-center gap-3 hover:shadow-md"
            style={{ background: '#fff', borderColor: `${PC.azul}22` }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center border shadow mr-1"
                 style={{ background: `${PC.azul}22`, borderColor: `${PC.azul}33` }}>
              <span className="text-base font-extrabold" style={{ color: PC.azulSec }}>{i + 1}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="font-extrabold text-[13px] sm:text-sm mb-1 truncate" style={{ color: PC.azulSec }}>
                {rate.location}
              </h5>
              <p className="text-[12px] sm:text-xs truncate mb-1" style={{ color: PC.azul }}>{rate.ubication}</p>

              <div className="grid grid-cols-2 gap-2 mb-1">
                <div className="rounded-lg p-2 text-center border"
                     style={{ background: `${PC.verde}14`, borderColor: `${PC.verde}33` }}>
                  <p className="text-[10px] font-bold mb-0.5" style={{ color: PC.verde }}>Venta</p>
                  <p className="font-extrabold text-sm leading-none" style={{ color: PC.verde }}>{fmt2(rate.price_sale)}</p>
                  <p className="text-[10px] text-gray-500">Bs</p>
                </div>
                <div className="rounded-lg p-2 text-center border"
                     style={{ background: `${PC.azulSec}14`, borderColor: `${PC.azulSec}33` }}>
                  <p className="text-[10px] font-bold mb-0.5" style={{ color: PC.azulSec }}>Compra</p>
                  <p className="font-extrabold text-sm leading-none" style={{ color: PC.azulSec }}>{fmt2(rate.price_buy)}</p>
                  <p className="text-[10px] text-gray-500">Bs</p>
                </div>
              </div>

              {formattedDate && (
                <div className="text:[11px] opacity-75 text-center" style={{ color: PC.azul }}>
                  Actualizado: {formattedDate.date} – {formattedDate.time}
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* --------- Tabla unificada de puntos de cambio --------- */
function ExchangePointsTable({
  locations,
  bestRates,
  map,
  loading = false,
  onRefresh
}: {
  locations: any[];
  bestRates: Rate[];
  map: google.maps.Map | null;
  loading?: boolean;
  onRefresh: () => void;
}) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [data, setData] = useState<any[]>([]);

  // Combinar datos de locations y bestRates
  useEffect(() => {
    const combinedData = locations.map(loc => {
      const rateInfo = bestRates.find(rate => rate.location === loc.code);

      let dateObj: Date | null = null;

      if (loc.actualizado) {
        const parsed = new Date(loc.actualizado);
        if (!isNaN(parsed.getTime())) {
          dateObj = parsed;
        }
      }

      if (!dateObj && rateInfo?.updated_at) {
        const fixed = rateInfo.updated_at.replace(' ', 'T');
        const parsed = new Date(fixed);
        if (!isNaN(parsed.getTime())) {
          dateObj = parsed;
        }
      }

      if (!dateObj) {
        return {
          code: loc.code,
          location: loc.title,
          sale: rateInfo?.price_sale ?? 'N/D',
          buy: rateInfo?.price_buy ?? 'N/D',
          date: 'N/D',
          time: 'N/D',
          position: loc.position,
          rawDate: null,
          rawTime: null
        };
      }

      return {
        code: loc.code,
        location: loc.title,
        sale: rateInfo?.price_sale ?? 'N/D',
        buy: rateInfo?.price_buy ?? 'N/D',
        date: dateObj.toLocaleDateString('es-BO', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }),
        time: dateObj.toLocaleTimeString('es-BO', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }),
        position: loc.position,
        rawDate: dateObj,
        rawTime: dateObj.getTime()
      };
    });

    setData(combinedData);
  }, [locations, bestRates]);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      let valueA = a[sortConfig.key];
      let valueB = b[sortConfig.key];

      if (sortConfig.key === 'rawDate' || sortConfig.key === 'rawTime') {
        if ((valueA === null || valueA === 'N/D') && (valueB === null || valueB === 'N/D')) return 0;
        if (valueA === null || valueA === 'N/D') return sortConfig.direction === 'asc' ? 1 : -1;
        if (valueB === null || valueB === 'N/D') return sortConfig.direction === 'asc' ? -1 : 1;
        if (valueA < valueB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valueA > valueB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      }

      if (sortConfig.key === 'sale' || sortConfig.key === 'buy') {
        if (valueA === null || valueA === 'N/D' || valueA === 0) valueA = sortConfig.direction === 'asc' ? Infinity : -Infinity;
        if (valueB === null || valueB === 'N/D' || valueB === 0) valueB = sortConfig.direction === 'asc' ? Infinity : -Infinity;

        valueA = typeof valueA === 'string' ? parseFloat(valueA) : valueA;
        valueB = typeof valueB === 'string' ? parseFloat(valueB) : valueB;

        if (valueA < valueB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valueA > valueB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      }

      if (valueA === null || valueA === 'N/D') valueA = sortConfig.direction === 'asc' ? Infinity : -Infinity;
      if (valueB === null || valueB === 'N/D') valueB = sortConfig.direction === 'asc' ? Infinity : -Infinity;

      if (valueA < valueB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const handleRowClick = (position: { lat: number; lng: number }) => {
    focusWithBounce(map, position, 'Punto de cambio');
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-3 border shadow"
             style={{ background: `${PC.azul}14`, borderColor: `${PC.azul}33` }}>
          <img src="/pictures/location.png" alt="Sin datos" className="w-14 h-14 object-contain drop-shadow" />
        </div>
        <p className="text-sm sm:text-base font-bold" style={{ color: PC.azulSec }}>
          No hay datos de puntos de cambio disponibles
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-0 pb-2 border-b" style={{ borderColor: `${PC.azul}1A` }}>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow border"
               style={{ background: PC.azul, borderColor: PC.azulSec }}>
            <img src="/pictures/location.png" alt="Puntos de cambio" className="w-7 h-7 object-contain drop-shadow" />
          </div>
          <h4 className="font-extrabold text-sm sm:text-base" style={{ color: PC.azulSec }}>
            Puntos de Referencia Cambiaria
          </h4>
        </div>

        <button
          onClick={onRefresh}
          className="text-xs font-bold px-3 py-1.5 rounded-lg border hover:bg-gray-50"
          style={{ color: PC.azulSec, borderColor: `${PC.azul}33` }}
          title="Actualizar sección"
        >
          {loading ? 'Actualizando…' : '↻ Actualizar'}
        </button>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-[720px] w-full">
          <table className="w-full text-sm table-fixed">
            <thead
              className="sticky top-0 z-10"
              style={{ background: 'rgba(255,255,255,0.96)', backdropFilter: 'saturate(180%) blur(6px)' }}
            >
              <tr style={{ background: `${PC.azul}0A` }}>
                <th className="p-2 text-left w-[26%]">
                  <button
                    onClick={() => handleSort('code')}
                    className="flex items-center justify-between w-full font-bold hover:opacity-80 transition-opacity"
                    style={{ color: PC.azulSec }}
                  >
                    <span>Punto</span>
                    <span className="text-xs">
                      {sortConfig?.key === 'code' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}
                    </span>
                  </button>
                </th>

                <th className="p-2 text-right w-[16%]">
                  <button
                    onClick={() => handleSort('sale')}
                    className="flex items-center justify-end gap-1 w-full font-bold hover:opacity-80 transition-opacity"
                    style={{ color: PC.verde }}
                  >
                    <span>Venta</span>
                    <span className="text-xs">
                      {sortConfig?.key === 'sale' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}
                    </span>
                  </button>
                </th>

                <th className="p-2 text-right w-[16%]">
                  <button
                    onClick={() => handleSort('buy')}
                    className="flex items-center justify-end gap-1 w-full font-bold hover:opacity-80 transition-opacity"
                    style={{ color: PC.azulSec }}
                  >
                    <span>Compra</span>
                    <span className="text-xs">
                      {sortConfig?.key === 'buy' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}
                    </span>
                  </button>
                </th>

                <th className="p-2 text-right w-[20%]">
                  <button
                    onClick={() => handleSort('rawDate')}
                    className="flex items-center justify-end gap-1 w-full font-bold hover:opacity-80 transition-opacity"
                    style={{ color: PC.azul }}
                  >
                    <span>Fecha</span>
                    <span className="text-xs">
                      {sortConfig?.key === 'rawDate' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}
                    </span>
                  </button>
                </th>

                <th className="p-2 text-right w-[22%]">
                  <button
                    onClick={() => handleSort('rawTime')}
                    className="flex items-center justify-end gap-1 w-full font-bold hover:opacity-80 transition-opacity"
                    style={{ color: PC.azul }}
                  >
                    <span>Hora</span>
                    <span className="text-xs">
                      {sortConfig?.key === 'rawTime' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}
                    </span>
                  </button>
                </th>
              </tr>
            </thead>

            <tbody>
              {sortedData.map((item, index) => (
                <tr
                  key={index}
                  className="border-b cursor-pointer hover:bg-blue-50/60 transition-colors group"
                  style={{ borderColor: `${PC.azul}1A` }}
                  onClick={() => handleRowClick(item.position)}
                >
                  <td className="p-2 font-medium truncate group-hover:translate-x-1 transition-transform" style={{ color: PC.azulSec }}>
                    {item.code}
                  </td>
                  <td className="p-2 text-right font-bold group-hover:scale-105 transition-transform" style={{ color: PC.verde }}>
                    {item.sale}
                  </td>
                  <td className="p-2 text-right font-bold group-hover:scale-105 transition-transform" style={{ color: PC.azulSec }}>
                    {item.buy}
                  </td>
                  <td className="p-2 text-right text-xs whitespace-nowrap" style={{ color: PC.azul }}>
                    {item.date}
                  </td>
                  <td className="p-2 text-right text-xs whitespace-nowrap" style={{ color: PC.azul }}>
                    {item.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {loading && (
            <div className="py-3 text-center text-xs" style={{ color: PC.azulSec }}>
              Actualizando datos…
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
