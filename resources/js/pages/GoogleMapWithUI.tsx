import { useEffect, useRef, useState } from 'react';
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

export default function GoogleMapWithUI({ bcvInfo: propBcvInfo, binanceInfo: propBinanceInfo }: GoogleMapWithUIProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [locations, setLocations] = useState<any[]>([]);
  const [bestRate, setBestRate] = useState<any | null>(null);
  const [bcvInfo, setBcvInfo] = useState<string>(propBcvInfo || '');
  const [binanceInfo, setBinanceInfo] = useState<string>(propBinanceInfo || '');
  const [currentTab, setCurrentTab] = useState<'best' | 'points'>('best');

  useEffect(() => {
    const id = setInterval(() => {}, 4000);
    return () => clearInterval(id);
  }, []);

  const fetchExchangeRates = () => {
    if (!propBcvInfo || !propBinanceInfo) {
      const bcvData: ExchangeRate = { buy: 6.86, sell: 6.96 };
      const binanceData: ExchangeRate = { buy: 14.02, sell: 14.02 };
      const currentDate = new Date().toLocaleDateString('es-BO',{ day:'2-digit',month:'2-digit',year:'numeric' });
      setBcvInfo(`Banco Central de Bolivia: Compra Bs ${bcvData.buy} • Venta Bs ${bcvData.sell}`);
      setBinanceInfo(`Binance Bs/USDT: Compra Bs ${binanceData.buy} • Venta Bs ${binanceData.sell} (08:00 • ${currentDate})`);
    }
  };

  useEffect(() => {
    if (propBcvInfo) setBcvInfo(propBcvInfo);
    if (propBinanceInfo) setBinanceInfo(propBinanceInfo);
  }, [propBcvInfo, propBinanceInfo]);

  useEffect(() => {
    let script: HTMLScriptElement | null = null;

    const fetchLocations = async () => {
      try {
        const res = await fetch('money-changers');
        const result = await res.json();
        if (result.success && Array.isArray(result.data)) {
          const formatted = result.data.map((item: any) => ({
            id: item.id,
            title: item.name,
            code: item.code,
            description: `${item.ubication_name}<br/>Venta: ${item.latest_price?.price_sale ?? 'N/D'} Bs • Compra: ${item.latest_price?.price_buy ?? 'N/D'} Bs`,
            position: { lat: parseFloat(item.lan), lng: parseFloat(item.log) },
          }));
          setLocations(formatted);
          return formatted;
        }
      } catch (e) { console.error('Error ubicaciones:', e); }
      return [];
    };

    const fetchBestUsdSale = async () => {
      try {
        const res = await fetch('/money-changers/best-usd-sale');
        const result = await res.json();
        if (result.success && result.data) {
          setBestRate({
            ...result.data,
            updated_at: result.data.updated_at || new Date().toISOString(),
            exchange_type: 'USD/BOB',
          });
        }
      } catch (e) { console.error('Error mejor cambio:', e); }
    };

    const initMap = (center: google.maps.LatLngLiteral, locationsData: any[]) => {
      const googleMap = new window.google.maps.Map(mapRef.current!, {
        center, zoom: 13,
        styles: [{ featureType: "all", elementType: "all", stylers: [{ saturation: -50 }] }],
        disableDefaultUI: false, mapTypeControl: false, streetViewControl: false, fullscreenControl: false,
      });
      setMap(googleMap);
      setIsLoading(false);

      locationsData.forEach(location => {
        new window.google.maps.Marker({
          position: location.position, map: googleMap, title: location.code,
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
      await fetchBestUsdSale();
      if (!propBcvInfo || !propBinanceInfo) fetchExchangeRates();

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
  }, []);

  return (
    <div className="relative w-full h-[100dvh] min-h-[540px] bg-white">
      {/* Loading */}
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
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 w-full px-3 sm:px-4 max-w-[720px] md:top-6">
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

        {/* info tipos de cambio */}
        <div className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
          <p
            className="text-[12px] sm:text-sm rounded-lg px-3 py-2 truncate border"
            style={{ color: PC.azulSec, background: 'rgba(255,255,255,0.96)', borderColor: `${PC.azul}22` }}
          >
            <span className="mr-1">🏛️</span>{bcvInfo || '—'}
          </p>
          <p
            className="text-[12px] sm:text-sm rounded-lg px-3 py-2 truncate border"
            style={{ color: PC.azulSec, background: 'rgba(255,255,255,0.96)', borderColor: `${PC.azul}22` }}
          >
            <span className="mr-1">📈</span>{binanceInfo || '—'}
          </p>
        </div>
      </div>

      {/* Paneles desktop */}
      <div className="hidden md:block">
        <Card
          className="absolute top-24 left-4 p-4 z-10 w-80 lg:w-96 max-h-[70vh] overflow-y-auto rounded-xl ring-1"
          style={{ background: 'rgba(255,255,255,0.98)', borderColor: `${PC.azul}22`, boxShadow: '0 10px 32px rgba(0,0,0,.08)', color: PC.azulOscuro }}
        >
          <BestRatePanel bestRate={bestRate} map={map} />
        </Card>

        <Card
          className="absolute top-24 right-4 p-3 z-10 w-80 lg:w-96 max-h-[70vh] overflow-y-auto rounded-xl ring-1"
          style={{ background: 'rgba(255,255,255,0.98)', borderColor: `${PC.azul}22`, boxShadow: '0 10px 32px rgba(0,0,0,.08)', color: PC.azulOscuro }}
        >
          <PointsPanel locations={locations} map={map} />
        </Card>
      </div>

      {/* Móvil: barra inferior con tabs */}
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
              {currentTab === 'best'
                ? <BestRatePanel bestRate={bestRate} map={map} compact />
                : <PointsPanel locations={locations} map={map} compact />
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------- Subcomponentes --------- */

function BestRatePanel({ bestRate, map, compact = false }: { bestRate: any; map: google.maps.Map | null; compact?: boolean; }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 mb-2 pb-2 border-b" style={{ borderColor: `${PC.azul}1A` }}>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shadow"
          style={{ background: PC.azul, border: `2px solid ${PC.azulSec}` }}
        >
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

      {bestRate ? (
        <div className="space-y-2">
          <div className="flex items-center justify-center">
            <span
              className="text-[11px] px-1.5 py-0.5 rounded font-bold border"
              style={{ color: PC.azul, background: `${PC.azul}14`, borderColor: `${PC.azul}33` }}
            >
              {bestRate.exchange_type || 'USD/BOB'}
            </span>
          </div>

          <div className={`grid grid-cols-2 gap-2 ${compact ? 'text-[13px]' : ''}`}>
            <div className="rounded-md p-2 text-center border shadow-sm" style={{ background: '#fff', borderColor: `${PC.verde}33` }}>
              <p className="text-[11px] font-bold mb-0.5" style={{ color: PC.verde }}>Venta</p>
              <p className="font-extrabold text-lg leading-none" style={{ color: PC.verde }}>{bestRate.price_sale}</p>
              <p className="text-[11px] text-gray-500">Bs</p>
            </div>
            <div className="rounded-md p-2 text-center border shadow-sm" style={{ background: '#fff', borderColor: `${PC.azulSec}33` }}>
              <p className="text-[11px] font-bold mb-0.5" style={{ color: PC.azulSec }}>Compra</p>
              <p className="font-extrabold text-lg leading-none" style={{ color: PC.azulSec }}>{bestRate.price_buy}</p>
              <p className="text-[11px] text-gray-500">Bs</p>
            </div>
          </div>

          <p className="text-[11px] text-center pt-1 border-t" style={{ color: PC.azul, borderColor: `${PC.azul}1A` }}>
            Actualizado: {bestRate.updated_at
              ? new Date(bestRate.updated_at).toLocaleDateString('es-BO', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' })
              : 'Fecha no disponible'}
          </p>

          <div className="max-h-[28vh] md:max-h-64 overflow-y-auto">
            <BestRatesList map={map} />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="w-10 h-10 rounded-full mx-auto mb-3 animate-pulse" style={{ background: `${PC.azul}22` }} />
            <p className="text-sm font-semibold" style={{ color: PC.azulSec }}>Cargando información…</p>
          </div>
        </div>
      )}
    </div>
  );
}

function PointsPanel({ locations, map, compact = false }: { locations: any[]; map: google.maps.Map | null; compact?: boolean; }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2 pb-2 border-b" style={{ borderColor: `${PC.azul}1A` }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow border" style={{ background: PC.azul, borderColor: PC.azulSec }}>
          <img src="/pictures/location.png" alt="Punto de cambio" className="w-7 h-7 object-contain drop-shadow" />
        </div>
        <h4 className="font-extrabold text-sm sm:text-base" style={{ color: PC.azulSec }}>Puntos de Cambio</h4>
      </div>

      {locations.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-3 border shadow" style={{ background: `${PC.azul}14`, borderColor: `${PC.azul}33` }}>
            <img src="/pictures/location.png" alt="Sin puntos de cambio" className="w-14 h-14 object-contain drop-shadow" />
          </div>
          <p className="text-sm sm:text-base font-bold" style={{ color: PC.azulSec }}>No hay puntos de cambio registrados</p>
        </div>
      ) : (
        <div className="space-y-2">
          {locations.map((loc, i) => (
            <button
              type="button"
              key={i}
              className="w-full text-left rounded-lg p-2 transition-all duration-200 hover:shadow border"
              style={{ background: '#fff', borderColor: `${PC.azul}22` }}
              onClick={() => { if (map) { map.setCenter(loc.position); map.setZoom(16); } }}
            >
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border shadow"
                     style={{ background: `${PC.azul}22`, borderColor: `${PC.azul}33` }}>
                  <span className="text-base font-extrabold" style={{ color: PC.azulSec }}>{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-extrabold text-[13px] sm:text-sm mb-0.5 truncate" style={{ color: PC.azulSec }}>
                    {loc.code}
                  </h5>
                  <div
                    className="text-[12px] sm:text-xs leading-relaxed line-clamp-2"
                    style={{ color: PC.azul }}
                    dangerouslySetInnerHTML={{ __html: loc.description }}
                  />
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* --------- Lista de mejores tipos de cambio --------- */
function BestRatesList({ map }: { map: google.maps.Map | null }) {
  interface Rate { price_sale: number; price_buy: number; location: string; ubication: string; lat: number; lng: number; }
  const [rates, setRates] = useState<Rate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/money-changers/all-best-usd-sales')
      .then(res => res.json())
      .then(result => {
        if (result.success && Array.isArray(result.data)) setRates(result.data);
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
      {rates.map((rate, i) => (
        <button
          type="button"
          key={i}
          onClick={() => {
            if (map) {
              const position = { lat: rate.lat, lng: rate.lng };
              map.setCenter(position);
              map.setZoom(16);
              new google.maps.Marker({
                position, map, title: rate.location,
                icon: { url: '/pictures/location.png', scaledSize: new google.maps.Size(30, 30) },
              });
            }
          }}
          className="w-full text-left cursor-pointer transition rounded-lg p-2 border shadow-sm flex items-center gap-3 hover:shadow-md"
          style={{ background: '#fff', borderColor: `${PC.azul}22` }}
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center border shadow mr-1"
               style={{ background: `${PC.azul}22`, borderColor: `${PC.azul}33` }}>
            <span className="text-base font-extrabold" style={{ color: PC.azulSec }}>{i + 1}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h5 className="font-extrabold text-[13px] sm:text-sm mb-0.5 truncate" style={{ color: PC.azulSec }}>
              {rate.location}
            </h5>
            <p className="text-[12px] sm:text-xs truncate" style={{ color: PC.azul }}>{rate.ubication}</p>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <div className="rounded-lg p-2 text-center border"
                   style={{ background: `${PC.verde}14`, borderColor: `${PC.verde}33` }}>
                <p className="text-[10px] font-bold mb-0.5" style={{ color: PC.verde }}>Venta</p>
                <p className="font-extrabold text-sm leading-none" style={{ color: PC.verde }}>{rate.price_sale}</p>
                <p className="text-[10px] text-gray-500">Bs</p>
              </div>
              <div className="rounded-lg p-2 text-center border"
                   style={{ background: `${PC.azulSec}14`, borderColor: `${PC.azulSec}33` }}>
                <p className="text-[10px] font-bold mb-0.5" style={{ color: PC.azulSec }}>Compra</p>
                <p className="font-extrabold text-sm leading-none" style={{ color: PC.azulSec }}>{rate.price_buy}</p>
                <p className="text-[10px] text-gray-500">Bs</p>
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
