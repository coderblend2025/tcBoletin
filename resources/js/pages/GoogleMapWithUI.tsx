import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface ExchangeRate {
  buy: number;
  sell: number;
}

interface GoogleMapWithUIProps {
  bcvInfo?: string;
  binanceInfo?: string;
}

export default function GoogleMapWithUI({ bcvInfo: propBcvInfo, binanceInfo: propBinanceInfo }: GoogleMapWithUIProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [locations, setLocations] = useState<any[]>([]);
  const [bestRate, setBestRate] = useState<any | null>(null);
  const [bcvInfo, setBcvInfo] = useState<string>(propBcvInfo || '');
  const [binanceInfo, setBinanceInfo] = useState<string>(propBinanceInfo || '');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Array de información para el carrusel
  const exchangeInfo = [
    { icon: '🏛️', text: bcvInfo },
    { icon: '📈', text: binanceInfo }
  ];

  // Efecto para cambiar slides automáticamente
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % exchangeInfo.length);
    }, 4000); // Cambia cada 4 segundos

    return () => clearInterval(interval);
  }, [exchangeInfo.length]);

  const fetchExchangeRates = () => {
    // Solo cargar datos si no se pasaron como props
    if (!propBcvInfo || !propBinanceInfo) {
      const bcvData: ExchangeRate = { buy: 6.86, sell: 6.96 };
      const binanceData: ExchangeRate = { buy: 14.02, sell: 14.02 };
      const currentDate = new Date().toLocaleDateString('es-BO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });

      const today = new Date().toLocaleDateString('es-BO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      setBcvInfo(`Banco Central de Bolivia: Compra Bs ${bcvData.buy} - Venta Bs ${bcvData.sell}`);
      setBinanceInfo(`Binance Bs/USDT: Compra Bs ${binanceData.buy} - Venta Bs ${binanceData.sell} (Actualizado a horas 08:00 a.m. - ${currentDate})`);
    }
  };

  // Actualizar estados cuando cambien las props
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
          description: `${item.ubication_name}<br/>Venta: ${item.latest_price?.price_sale ?? 'N/D'} Bs - Compra: ${item.latest_price?.price_buy ?? 'N/D'} Bs`,
          position: {
            lat: parseFloat(item.lan),
            lng: parseFloat(item.log),
          },
        }));
        setLocations(formatted);
        return formatted;
      }
    } catch (error) {
      console.error('Error al cargar ubicaciones:', error);
    }
    return [];
  };

  const fetchBestUsdSale = async () => {
  try {
    const res = await fetch('/money-changers/best-usd-sale');
    const result = await res.json();
    if (result.success && result.data) {
      // Agregar información de fecha y tipo de cambio
      const updatedData = {
        ...result.data,
        updated_at: result.data.updated_at || new Date().toISOString(),
        exchange_type: 'USD/BOB' // Tipo de cambio
      };
      setBestRate(updatedData);
    }
  } catch (error) {
    console.error('Error al cargar el mejor tipo de cambio:', error);
  }
};


  const initMap = (center: google.maps.LatLngLiteral, locationsData: any[]) => {
    const googleMap = new window.google.maps.Map(mapRef.current!, {
      center,
      zoom: 13,
      styles: [{ featureType: "all", elementType: "all", stylers: [{ saturation: -50 }] }],
      disableDefaultUI: false,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    setMap(googleMap);
    setIsLoading(false);

    // Ocultar elementos de Google
    const hideGoogleElements = () => {
      const style = document.createElement('style');
      style.textContent = `
        .gm-style .gm-style-cc {
          display: none !important;
        }
        .gm-style a[href*="maps.google.com"] {
          display: none !important;
        }
        .gm-style-mtc {
          display: none !important;
        }
        .gm-bundled-control {
          display: none !important;
        }
        .gmnoprint {
          display: none !important;
        }
        .gm-style .gm-style-iw-c {
          padding: 0 !important;
        }
      `;
      document.head.appendChild(style);
    };

    // Aplicar estilos después de que el mapa se cargue
    setTimeout(hideGoogleElements, 100);

    locationsData.forEach(location => {
      const marker = new window.google.maps.Marker({
        position: location.position,
        map: googleMap,
        title: location.code,
        icon: {
          url: '/pictures/location.png',
          scaledSize: new window.google.maps.Size(40, 40),
        },
        label: {
          text: location.code,
          color: '#1E3A8A',
          fontWeight: 'bold',
          fontSize: '12px',
        },
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
    // Solo cargar tipos de cambio si no se pasaron como props
    if (!propBcvInfo || !propBinanceInfo) {
      fetchExchangeRates();
    }
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
    (pos) => {
      startApp({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      });
    },
    () => {
      startApp({ lat: -17.393836, lng: -66.156872 }); // Fallback
    }
  );

  return () => {
    if (script && document.head.contains(script)) {
      document.head.removeChild(script);
    }
  };
}, []);



  return (
  <div className="relative w-full h-screen min-h-[500px] bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Loading spinner */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex justify-center items-center bg-white/80 backdrop-blur-md">
          <div className="text-center">
            <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-blue-700 font-semibold text-lg">Cargando mapa...</p>
          </div>
        </div>
      )}

      {/* Mapa principal */}
  <div ref={mapRef} className="w-full h-full rounded-2xl shadow-2xl border border-blue-100" style={{ minHeight: '300px' }} />

      {/* Barra de búsqueda centrada */}
  <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-full max-w-xl px-2 md:top-8 md:px-4">
        <div className="flex bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-blue-200 overflow-hidden ring-2 ring-blue-100">
          <Input
            ref={searchInputRef}
            placeholder="Buscar ubicación..."
            className="flex-1 px-5 py-4 text-base border-none focus:ring-0 focus:outline-none placeholder-blue-400 font-semibold bg-transparent"
          />
          <Button variant="ghost" className="px-5 hover:bg-blue-50 transition-colors border-l border-blue-100">
            <Search className="w-5 h-5 text-blue-700" />
          </Button>
        </div>
      </div>

      {/* Panel izquierdo - Mejor cambio */}
      <Card className="fixed md:absolute top-2 left-2 md:top-24 md:left-4 p-2 md:p-4 z-20 bg-white/95 backdrop-blur-lg shadow-xl border border-blue-200 rounded-xl w-[90vw] max-w-xs md:w-80 md:max-w-xs max-h-[60vh] md:max-h-screen overflow-y-auto ring-2 ring-blue-100 animate-fade-in">
        <div className="flex items-center gap-3 mb-3 pb-2 border-b border-blue-100">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center shadow">
            <span className="text-white text-xl font-bold">💲</span>
          </div>
          <div>
            <h4 className="text-base font-extrabold text-blue-900">Mejor Tipo de Cambio</h4>
            <p className="text-xs text-blue-600">Actualizado en tiempo real</p>
          </div>
        </div>
        {bestRate ? (
          <div className="space-y-2">
            <div className="flex items-center justify-center">
              <span className="text-[11px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold border border-blue-200 shadow">
                {bestRate.exchange_type || 'USD/BOB'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <div className="bg-white rounded-md p-1.5 text-center border border-green-200 shadow">
                <p className="text-[10px] text-green-700 font-bold mb-0.5">Venta</p>
                <p className="font-extrabold text-green-700 text-base leading-none">{bestRate.price_sale}</p>
                <p className="text-[10px] text-gray-500">Bs</p>
              </div>
              <div className="bg-white rounded-md p-1.5 text-center border border-red-200 shadow">
                <p className="text-[10px] text-red-700 font-bold mb-0.5">Compra</p>
                <p className="font-extrabold text-red-700 text-base leading-none">{bestRate.price_buy}</p>
                <p className="text-[10px] text-gray-500">Bs</p>
              </div>
            </div>
            <div className="border-t border-blue-100 pt-1">
              <p className="text-[10px] text-blue-700 text-center">
                Actualizado: {bestRate.updated_at ? 
                  new Date(bestRate.updated_at).toLocaleDateString('es-BO', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : 
                  'Fecha no disponible'
                }
              </p>
            </div>
            <div className="max-h-64 overflow-y-auto">
              <BestRatesList map={map} />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-10">
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-200 rounded-full mx-auto mb-3 animate-pulse"></div>
              <p className="text-sm text-blue-700 font-semibold">Cargando información...</p>
            </div>
          </div>
        )}
      </Card>

      <Card className="fixed md:absolute top-2 right-2 md:top-24 md:right-4 p-2 md:p-3 z-20 max-h-[60vh] md:max-h-full w-[90vw] max-w-xs md:w-80 lg:w-96 bg-white/95 backdrop-blur-lg shadow-xl border border-blue-200 rounded-xl overflow-y-auto ring-2 ring-blue-100 animate-fade-in">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-blue-100">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center shadow">
            <span className="text-white text-lg font-bold">📍</span>
          </div>
          <h4 className="font-extrabold text-blue-900 text-base">Puntos de Cambio</h4>
        </div>
        <div className="overflow-y-auto max-h-[60vh] pr-1">
          {locations.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-20 h-20 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                <span className="text-blue-400 text-3xl">🏢</span>
              </div>
              <p className="text-base text-blue-700 font-bold">No hay puntos de cambio registrados</p>
            </div>
          ) : (
            <div className="space-y-2">
              {locations.map((loc, i) => (
                <div 
                  key={i} 
                  className="bg-white/90 rounded-lg p-2 border border-blue-100 hover:border-blue-400 transition-all duration-200 cursor-pointer hover:shadow animate-fade-in"
                  onClick={() => {
                    if (map) {
                      map.setCenter(loc.position);
                      map.setZoom(16);
                    }
                  }}
                >
                  <div className="flex items-start gap-2">
                    <div className="w-7 h-7 bg-blue-200 rounded-lg flex items-center justify-center flex-shrink-0 border border-blue-300 shadow">
                      <span className="text-blue-900 text-base font-extrabold">{i + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-extrabold text-blue-900 text-sm mb-1">{loc.code}</h5>
                      <div 
                        className="text-xs text-blue-700 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: loc.description }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

// Componente para mostrar la lista de mejores tipos de cambio

function BestRatesList({ map }: { map: google.maps.Map | null }) {
  interface Rate {
    price_sale: number;
    price_buy: number;
    location: string;
    ubication: string;
    lat: number;
    lng: number;
  }

  const [rates, setRates] = useState<Rate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/money-changers/all-best-usd-sales')
      .then(res => res.json())
      .then(result => {
        if (result.success && Array.isArray(result.data)) {
          setRates(result.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6">
        <div className="text-center">
          <div className="w-8 h-8 bg-blue-200 rounded-full mx-auto mb-2 animate-pulse"></div>
          <p className="text-sm text-blue-700 font-semibold">
            Cargando mejores tipos de cambio...
          </p>
        </div>
      </div>
    );
  }

  if (rates.length === 0) {
    return (
      <p className="text-base text-blue-700 font-bold text-center">
        No hay tipos de cambio registrados
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {rates.map((rate, i) => {
        console.log('Rate:', rate);
        return (
          <div
            key={i}
            onClick={() => {
              if (map) {
                const position = { lat: rate.lat, lng: rate.lng };
                map.setCenter(position);
                map.setZoom(16);
                new google.maps.Marker({
                  position,
                  map,
                  title: rate.location,
                  icon: {
                    url: '/pictures/location.png',
                    scaledSize: new google.maps.Size(32, 32),
                  },
                });
              }
            }}
            className="cursor-pointer hover:shadow-lg transition bg-white rounded-lg p-2 border border-blue-100 shadow flex items-center gap-3"
          >
            <div className="w-8 h-8 bg-blue-200 rounded-lg flex items-center justify-center border border-blue-300 shadow mr-2">
              <span className="text-blue-900 text-base font-extrabold">{i + 1}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="font-extrabold text-blue-900 text-sm mb-0.5 truncate">{rate.location}</h5>
              <p className="text-xs text-blue-700 truncate">{rate.ubication}</p>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div className="bg-green-50 rounded-lg p-1 text-center border border-green-200">
                  <p className="text-[10px] text-green-700 font-bold mb-0.5">Venta</p>
                  <p className="font-extrabold text-green-700 text-sm leading-none">{rate.price_sale}</p>
                  <p className="text-[10px] text-gray-500">Bs</p>
                </div>
                <div className="bg-red-50 rounded-lg p-1 text-center border border-red-200">
                  <p className="text-[10px] text-red-700 font-bold mb-0.5">Compra</p>
                  <p className="font-extrabold text-red-700 text-sm leading-none">{rate.price_buy}</p>
                  <p className="text-[10px] text-gray-500">Bs</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
