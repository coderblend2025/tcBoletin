import MainLayout from '@/layouts/main-layout';
import { SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const PERIODICOS = [
    {
        id: 'la-razon',
        name: 'La Razón',
        logo: 'https://pbs.twimg.com/media/DmacacEX4AYTDtc.jpg',
    },
    {
        id: 'el-deber',
        name: 'El Deber',
        logo: 'https://anp-bolivia.com/wp-content/uploads/2021/08/El-Deber.Logo_.jpg',
    },
    {
        id: 'los-tiempos',
        name: 'Los Tiempos',
        logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTN_ALSrhKm3UeV5yviOlkk7iKcCqPQUcNdyHO-XVWgG22qTRiDhthbGdcGqXxE6ePqO4c&usqp=CAU',
    },
    {
        id: 'el-diario',
        name: 'El Diario',
        logo: 'https://media.sipiapa.org/adjuntos/185/imagenes/001/784/0001784299.jpg',
    },
];

const News = () => {
    const { auth } = usePage<SharedData>().props;

    const [bcvInfo, setBcvInfo] = useState('');
    const [binanceInfo, setBinanceInfo] = useState('');
    const [current, setCurrent] = useState(0);

    interface Article {
        link: string;
        title: string;
        snippet: string;
    }

    const [articles, setArticles] = useState<Article[]>([]);

    useEffect(() => {
          const bcvData = { compra: 6.86, venta: 6.96 };
            const binanceData = {compra: 13.16, venta: 11.97};
            const today = new Date().toLocaleDateString('es-BO', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
            setBcvInfo(`Banco Central de Bolivia: Venta Bs ${bcvData.compra} - Compra Bs ${bcvData.venta} (${today})`);
            setBinanceInfo(`Binance Bs/USDT: Compra Bs ${binanceData.compra} - Venta Bs ${binanceData.venta} (Actualizado a horas 08:00 a.m. - ${today})`);

        const fetchNews = async () => {
            // Configura aquí tu API Key y tu Custom Search Engine ID
            const apiKey = 'TU_API_KEY_REAL'; // <-- Cambia por tu API Key válida
            const cx = 'TU_CSE_ID_REAL'; // <-- Cambia por tu CSE ID válido
            const query = 'tipo de cambio dólar Bolivia';

            try {
                const response = await fetch(`https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}`);
                const data = await response.json();
                if (data.error) {
                    console.error('Google API error:', data.error.message);
                    setArticles([]);
                } else if (!data.items || data.items.length === 0) {
                    setArticles([]);
                } else {
                    setArticles(data.items);
                }
            } catch (error) {
                console.error('Error al obtener los datos:', error);
                setArticles([]);
            }
        };

        fetchNews();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % PERIODICOS.length);
        }, 7000);
        return () => clearInterval(timer);
    }, []);

    const prevSlide = () => {
        setCurrent((prev) => (prev === 0 ? PERIODICOS.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setCurrent((prev) => (prev + 1) % PERIODICOS.length);
    };

    return (
        <MainLayout title="TC Boletín - Noticias del Dólar" auth={auth} bcvInfo={bcvInfo} binanceInfo={binanceInfo}>
            <Head title="Noticias - Tipo de Cambio" />
            <div className="container mx-auto max-w-5xl px-4 py-6">
                <h1 className="mb-4 text-center text-3xl font-bold tracking-tight text-gray-900">Noticias por Periódico</h1>

                <div className="relative w-full overflow-hidden rounded-lg bg-gray-900 shadow-lg">
                    <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${current * 100}%)` }}>
                        {PERIODICOS.map((p) => (
                            <div key={p.id} className="relative h-96 min-w-full flex-shrink-0 md:h-[28rem]">
                                <img src={p.logo} alt={p.name} className="h-full w-full object-cover brightness-75 filter" loading="lazy" />

                                <div className="absolute right-0 bottom-0 left-0 h-48 bg-gradient-to-t from-black/90 to-transparent"></div>

                                <div className="absolute right-6 bottom-4 left-6 flex h-48 flex-col justify-end text-white">
                                    <h2 className="text-3xl font-extrabold drop-shadow-lg">{p.name}</h2>
                                    <div
                                        className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent mt-2 max-h-32 overflow-y-auto pr-2"
                                        style={{ scrollbarGutter: 'stable' }}
                                    >
                                        {articles.length > 0 ? (
                                            articles.map((item, index) => (
                                                <a
                                                    key={index}
                                                    href={item.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="mb-2 block text-sm transition-colors duration-200 hover:underline"
                                                >
                                                    <p className="font-semibold">{item.title}</p>
                                                    <p className="line-clamp-2 text-xs text-gray-300">{item.snippet}</p>
                                                </a>
                                            ))
                                        ) : (
                                            <p className="text-gray-400">No hay noticias disponibles o la API no respondió.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={prevSlide}
                        className="bg-[#001276] bg-opacity-50 hover:bg-opacity-80 absolute top-1/2 left-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-lg transition"
                        aria-label="Anterior"
                    >
                        <svg className="h-6 w-6" fill="none" stroke="#FFFFFF" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <button
                        onClick={nextSlide}
                        className="bg-[#001276] bg-opacity-50 hover:bg-opacity-80 absolute top-1/2 right-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-lg transition"
                        aria-label="Siguiente"
                    >
                        <svg className="h-6 w-6" fill="none" stroke="#FFFFFF" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </MainLayout>
    );
};

export default News;