import React, { useEffect, useState } from 'react';
import MainLayout from '@/layouts/main-layout';
import { SharedData } from '@/types';
import { usePage, Head } from '@inertiajs/react';

interface Article {
  link: string;
  title: string;
  snippet: string;
}

interface ExchangeRate {
  buy: number;
  sell: number;
}

const EconomicVariables = () => {
  const { auth } = usePage<SharedData>().props;
  const [bcvInfo, setBcvInfo] = useState<string>('');
  const [binanceInfo, setBinanceInfo] = useState<string>('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExchangeRates = () => {
      // Datos simulados - en producción deberían venir de una API
      const bcvData: ExchangeRate = { buy: 6.86, sell: 6.96 };
      const binanceData: ExchangeRate = { buy: 10.50, sell: 11.87 };
      const currentDate = new Date().toLocaleDateString('es-BO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });

      setBcvInfo(`Banco Central de Bolivia: Compra Bs ${bcvData.buy} - Venta Bs ${bcvData.sell}`);
      setBinanceInfo(`Binance Bs/USDT: Compra Bs ${binanceData.buy} - Venta Bs ${binanceData.sell} (Actualizado a horas 08:00 a.m. - ${currentDate})`);
    };

    const fetchNews = async () => {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '';
      const cx = process.env.NEXT_PUBLIC_GOOGLE_CX || '';
      const query = 'tipo de cambio dólar Bolivia';

      if (!apiKey || !cx) {
        setError('Configuración de API incompleta');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}`
        );

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        setArticles(data.items?.slice(0, 10) || []);
      } catch (err) {
        console.error('Error al obtener noticias:', err);
        setError('No se pudieron cargar las noticias. Intente más tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExchangeRates();
    fetchNews();
  }, []);

  return (
    <MainLayout 
      title="TC Boletín - Noticias del Dólar" 
      auth={auth} 
      bcvInfo={bcvInfo} 
      binanceInfo={binanceInfo}
    >
      <Head title="Noticias - Tipo de Cambio" />
      <div className="container mx-auto px-4 py-1">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Variables Económicas
        </h1>
  
        {/* Subtítulo */}
        <h2 className="text-xl font-semibold text-center mb-8 text-gray-700">
          Información clave para entender el mercado
        </h2>
  
        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Tasa de Cambio</h3>
            <p className="text-gray-700">
              Conoce las tasas de cambio oficiales y las tasas de cambio del mercado paralelo.
            </p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Variables Institucionales</h3>
            <p className="text-gray-700">
              Transparencia en estadísticas económicas, restricciones a la compra/venta de divisas, 
              Indicador de desconfianza monetaria................... etc
            </p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Expectativas</h3>
            <p className="text-gray-700"> - Rumores dominantes. </p>
            <p className="text-gray-700"> - Movimientos predecibles. </p>
            <p className="text-gray-700"> - Acumulación preventiva de divisas. </p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Cargando información...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        ) : articles.length === 0 ? (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
            No se encontraron artículos recientes.
          </div>
        ) : (
          <ul className="space-y-6">
            {articles.map((item, index) => (
              <li key={`article-${index}`} className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-semibold hover:underline block mb-2"
                >
                  {item.title}
                </a>
                <p className="text-gray-700">{item.snippet}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </MainLayout>
  );
}
export default EconomicVariables;