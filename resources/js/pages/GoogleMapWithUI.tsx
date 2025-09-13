import { useEffect, useRef, useState, useMemo } from 'react';
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
  const [bestRates, setBestRates] = useState<any[]>([]);
  const [bcvInfo, setBcvInfo] = useState<string>(propBcvInfo || '');
  const [binanceInfo, setBinanceInfo] = useState<string>(propBinanceInfo || '');
  const [currentTab, setCurrentTab] = useState<'best' | 'points'>('best');

  useEffect(() => {
    const id = setInterval(() => {}, 4000);
    return () => clearInterval(id);
  }, []);

  const fetchExchangeRates = () => {
    if (!propBcvInfo || !propBinanceInfo) {
      const bcvData: ExchangeRate = { buy: 6.96, sell: 6.86 };
      const binanceData: ExchangeRate = { buy: 13.16, sell: 11.97 };
      const currentDate = new Date().toLocaleDateString('es-BO',{ day:'2-digit',month:'2-digit',year:'numeric' });
      setBcvInfo(`Banco Central de Bolivia: Compra Bs ${bcvData.buy} • Venta Bs ${bcvData.sell}`);
      setBinanceInfo(`Binance Bs/USDT: Compra Bs ${binanceData.buy} • Venta Bs ${binanceData.sell} (08:00 • ${currentDate})`);
    }
  };

  // Añade esta función en el componente principal GoogleMapWithUI
  const animateMapToLocation = (position: { lat: number; lng: number }) => {
    if (map) {
      map.panTo(position);
      
      // Efecto de zoom suave
      const currentZoom = map.getZoom() || 13;
      if (currentZoom < 16) {
        map.setZoom(16);
      }
      
      // Añadir marcador temporal con animación
      const marker = new google.maps.Marker({
        position,
        map,
        animation: google.maps.Animation.BOUNCE,
        icon: { 
          url: '/pictures/location.png', 
          scaledSize: new google.maps.Size(40, 40) 
        }
      });
      
      // Remover el marcador después de 2 segundos
      setTimeout(() => {
        marker.setMap(null);
      }, 2000);
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
        const res = await fetch('/money-changers/all-best-usd-sales');
        const result = await res.json();
        if (result.success && Array.isArray(result.data)) {
          setBestRates(result.data);
        }
      } catch (e) { console.error('Error mejores cambios:', e); }
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

        {/* info tipos de cambio */}
        <div className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
          <p
            className="text-[12px] sm:text-sm rounded-lg px-3 py-2 truncate border"
            style={{ color: PC.azulSec, background: 'rgba(255,255,255,0.96)', borderColor: `${PC.azul}22` }}
          >
            <span className="mr-1">🏛️</span> {bcvInfo || '—'}
          </p>
          <p
            className="text-[12px] sm:text-sm rounded-lg px-3 py-2 truncate border"
            style={{ color: PC.azulSec, background: 'rgba(255,255,255,0.96)', borderColor: `${PC.azul}22` }}
          >
            <span className="mr-1">📈</span>{binanceInfo || '—'}
          </p>
        </div>
      </div>

      {/* Panel desktop unificado */}
      <div className="hidden md:block">
        <Card
          className="absolute top-24 left-4 p-4 z-10 w-96 lg:w-[550px] max-h-[80vh] overflow-y-auto rounded-xl ring-1"
          style={{ background: 'rgba(255,255,255,0.98)', borderColor: `${PC.azul}22`, boxShadow: '0 10px 32px rgba(0,0,0,.08)' }}
        >
          <ExchangePointsTable 
            locations={locations} 
            bestRates={bestRates} 
            map={map}
            onLocationSelect={animateMapToLocation}
          />
        </Card>
      </div>

      {/* Móvil: barra inferior con tabs */}
      <div className="px-3 pb-3 max-h-[42vh] overflow-y-auto">
        <ExchangePointsTable locations={locations} bestRates={bestRates} map={map} />
      </div>
    </div>
  );
}

/* --------- Tabla unificada de puntos de cambio --------- */
function ExchangePointsTable({ locations, bestRates, map, onLocationSelect }: { 
  locations: any[]; 
  bestRates: any[]; 
  map: google.maps.Map | null;
  onLocationSelect?: (position: { lat: number; lng: number }) => void;
}) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [data, setData] = useState<any[]>([]);

  // Combinar datos de locations y bestRates
  useEffect(() => {
    const combinedData = locations.map(loc => {
      const rateInfo = bestRates.find(rate => rate.location === loc.code);

      let dateObj: Date | null = null;

      if (rateInfo?.updated_at) {
        // convierte "2025-09-12 15:45:00" -> "2025-09-12T15:45:00"
        const fixed = rateInfo.updated_at.replace(' ', 'T');
        const parsed = new Date(fixed);
        if (!isNaN(parsed.getTime())) {
          dateObj = parsed;
        }
      }

      // Si no hay rateInfo o la fecha es inválida → usamos la fecha actual
      if (!dateObj) {
        dateObj = new Date();
      }

      return {
        code: loc.code,
        location: loc.title,
        sale: rateInfo?.price_sale || 'N/D',
        buy: rateInfo?.price_buy || 'N/D',
        date: dateObj.toLocaleDateString('es-BO', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }),
        time: dateObj.toLocaleTimeString('es-BO', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }),
        position: loc.position,
        rawDate: dateObj,
        rawTime: dateObj.getTime()
      };
    });

    setData(combinedData);
  }, [locations, bestRates]);

  // Función para ordenar
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Aplicar ordenamiento
  const sortedData = useMemo(() => {
    if (!sortConfig) return data;
    
    return [...data].sort((a, b) => {
      let valueA = a[sortConfig.key];
      let valueB = b[sortConfig.key];
      
      // Manejar valores nulos/por defecto
      if (valueA === null || valueA === 'N/D' || valueA === 0) {
        valueA = sortConfig.direction === 'asc' ? Infinity : -Infinity;
      }
      if (valueB === null || valueB === 'N/D' || valueB === 0) {
        valueB = sortConfig.direction === 'asc' ? Infinity : -Infinity;
      }
      
      if (sortConfig.key === 'sale' || sortConfig.key === 'buy') {
        valueA = typeof valueA === 'string' ? parseFloat(valueA) : valueA;
        valueB = typeof valueB === 'string' ? parseFloat(valueB) : valueB;
      }
      
      if (valueA < valueB) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const handleRowClick = (position: { lat: number; lng: number }) => {
    if (onLocationSelect) {
      onLocationSelect(position);
    } else if (map) {
      map.setCenter(position);
      map.setZoom(16);
    }
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
      <div className="flex items-center gap-2 mb-4 pb-2 border-b" style={{ borderColor: `${PC.azul}1A` }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow border" 
             style={{ background: PC.azul, borderColor: PC.azulSec }}>
          <img src="/pictures/location.png" alt="Puntos de cambio" className="w-7 h-7 object-contain drop-shadow" />
        </div>
        <h4 className="font-extrabold text-sm sm:text-base" style={{ color: PC.azulSec }}>
          Puntos de Referencia Cambiaria
        </h4>
      </div>

      <div className="overflow-x-visible">
        <div className="inline-block min-w-full">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: `${PC.azul}0A` }}>
                {/* Columna Punto */}
                <th className="p-2 text-left">
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
                
                {/* Columna Venta */}
                <th className="p-2 text-right">
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
                
                {/* Columna Compra */}
                <th className="p-2 text-right">
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
                
                {/* Columna Fecha */}
                <th className="p-2 text-right">
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
                
                {/* Columna Hora */}
                <th className="p-2 text-right">
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
                  className="border-b cursor-pointer hover:bg-blue-50 transition-colors group"
                  style={{ borderColor: `${PC.azul}1A` }}
                  onClick={() => handleRowClick(item.position)}
                >
                  <td className="p-2 font-medium group-hover:translate-x-1 transition-transform" style={{ color: PC.azulSec }}>
                    {item.code}
                  </td>
                  <td className="p-2 text-right font-bold group-hover:scale-105 transition-transform" style={{ color: PC.verde }}>
                    {item.sale}
                  </td>
                  <td className="p-2 text-right font-bold group-hover:scale-105 transition-transform" style={{ color: PC.azulSec }}>
                    {item.buy}
                  </td>
                  <td className="p-2 text-right text-xs" style={{ color: PC.azul }}>
                    {item.date}
                  </td>
                  <td className="p-2 text-right text-xs" style={{ color: PC.azul }}>
                    {item.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}