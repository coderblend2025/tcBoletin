import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
          const binanceData: ExchangeRate = { buy: 14.02, sell: 14.02 };
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
      <div className="w-full min-h-[80vh] grid grid-cols-1 md:grid-cols-2 bg-white">
        {/* Sección 1: Tipo de Cambio */}
        <div className="flex items-center justify-center w-full h-[40vh] md:h-[80vh] bg-white">
          <img
            src="/pictures/tipodecambio.png"
            alt="Tipo de cambio"
            className="w-full h-full object-contain"
          />
        </div>
        {/* Sección 2: Cómo afecta el tipo de cambio */}
        <div className="flex items-center justify-center w-full h-[40vh] md:h-[80vh] bg-white">
          <img
            src="/pictures/comoafectaeltipodecambio.png"
            alt="Cómo afecta el tipo de cambio"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </MainLayout>
  );
}
export default EconomicVariables;