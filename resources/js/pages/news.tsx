import React, { useEffect, useState } from 'react';
import MainLayout from '@/layouts/main-layout';
import { SharedData } from '@/types';
import { usePage, Head } from '@inertiajs/react';

const News = () => {
  const { auth } = usePage<SharedData>().props;

  const [bcvInfo, setBcvInfo] = useState('');
  const [binanceInfo, setBinanceInfo] = useState('');

  interface Article {
    link: string;
    title: string;
    snippet: string;
  }

  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    // Simulación de tasas (puedes reemplazar por API real)
    const bcvData = { compra: 6.86, venta: 6.96 };
    const binanceData = { compra: 10.50, venta: 11.87 };

    setBcvInfo(`Banco Central de Bolivia: Compra Bs ${bcvData.compra} - Venta Bs ${bcvData.venta}`);
    setBinanceInfo(`Binance Bs/USDT: Compra Bs ${binanceData.compra} - Venta Bs ${binanceData.venta} (Actualizado a horas 08:00 a.m. - 30/11/2024)`);

    const fetchNews = async () => {
      const apiKey = 'AIzaSyARBxxivrztajUyZBGD3Q0pY9ILy2oF3gA';
      const cx = 'abc123456789:xyz987654321'; // Reemplázalo con tu valor real
      const query = 'tipo de cambio dólar Bolivia';

      try {
        const response = await fetch(
          `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}`
        );
        const data = await response.json();
        setArticles(data.items || []);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchNews();
  }, []);

  return (
    <MainLayout title="TC Boletín - Noticias del Dólar" auth={auth} bcvInfo={bcvInfo} binanceInfo={binanceInfo}>
      <Head title="Noticias - Tipo de Cambio" />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Noticias sobre el Tipo de Cambio del Dólar en Bolivia</h1>
        <ul className="space-y-6">
          {articles.map((item, index) => (
            <li key={index} className="bg-white shadow-md rounded-lg p-4">
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 font-semibold hover:underline"
              >
                {item.title}
              </a>
              <p className="text-gray-700 mt-2">{item.snippet}</p>
            </li>
          ))}
        </ul>
      </div>
    </MainLayout>
  );
};

export default News;