import MainLayout from '@/layouts/main-layout';
import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { FiBookOpen, FiRefreshCw, FiShield } from 'react-icons/fi';

export default function Work() {
    const { auth } = usePage<SharedData>().props;

    const [bcvInfo, setBcvInfo] = useState('');
    const [binanceInfo, setBinanceInfo] = useState('');

    const colorPrimario = '#001276'; // Azul Oscuro
    const colorFondoClaro = '#E8EBF3';

    useEffect(() => {
        const fetchExchangeRates = async () => {
            const bcvData = { compra: 6.86, venta: 6.96 };
            const binanceData = { compra: 10.5, venta: 11.87 };
            setBcvInfo(`Banco Central de Bolivia: Compra ${bcvData.compra} - Venta ${bcvData.venta}`);
            setBinanceInfo(
                `Binance Bs/USDT: Compra ${binanceData.compra} - Venta ${binanceData.venta} (Actualizado a horas 08:00 a.m. - 30/11/2024)`,
            );
        };

        fetchExchangeRates();
    }, []);

    return (
        <MainLayout title="TC Boletín" auth={auth} bcvInfo={bcvInfo} binanceInfo={binanceInfo}>
            <Head title="Trabaja con nosotros" />

            <section className="container">
                <div className="rounded-2xl bg-white p-8 shadow-md">
                    <h1 className="mb-6 text-center text-3xl font-extrabold text-blue-900">Únete a Nuestro Equipo</h1>
                    <p className="mb-4 text-center text-gray-700">
                        En <strong>TC Boletín</strong> buscamos personas apasionadas por la economía, las finanzas y el análisis de datos. Si te
                        entusiasma el mundo del mercado cambiario y quieres formar parte de un proyecto innovador, ¡te estamos buscando!
                    </p>
                    <p className="mb-8 text-center text-gray-700">
                        Envíanos tu <strong>currículum vitae</strong> junto con una <strong>carta de presentación</strong> explicando tu motivación y
                        experiencia. Valoramos el compromiso, la curiosidad intelectual y la capacidad de adaptarse a un entorno dinámico.
                    </p>

                    <div className="mb-10 rounded-xl bg-blue-50 p-6">
                        <h2 className="mb-4 text-center text-2xl font-bold text-blue-900">¿Qué Ofrecemos?</h2>
                        <ul className="list-inside list-disc space-y-4 text-gray-700">
                            <li>
                                Acceso a información del mercado en tiempo real sobre el dólar y otros indicadores financieros relevantes en Bolivia.
                            </li>
                            <li>Plataforma digital con herramientas de análisis, predicciones y visualización de datos.</li>
                            <li>Oportunidades de crecimiento profesional dentro de un equipo multidisciplinario.</li>
                            <li>Un entorno colaborativo, ágil y orientado a resultados.</li>
                        </ul>
                    </div>

                    <div className="rounded-xl p-6" style={{ backgroundColor: '#EBFFF2' }}>
                        <h2 className="mb-4 text-center text-xl font-semibold">Planes de Membresía</h2>
                        <p className="mb-6 text-center">
                            Tendrás acceso a datos precisos y actualizados con distintos niveles de acceso según el plan que elijas.
                        </p>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="rounded-lg bg-white p-4 text-blue-900 shadow">
                                <h3 className="mb-2 text-center text-xl font-bold">Gratis</h3>
                                <ul className="space-y-2 text-sm">
                                    <li>✔ Acceso limitado</li>
                                    <li>✔ Noticias diarias</li>
                                    <li>✖ Datos en tiempo real</li>
                                </ul>
                            </div>
                            <div className="rounded-lg bg-white p-4 text-blue-900 shadow">
                                <h3 className="mb-2 text-center text-xl font-bold">Semanal</h3>
                                <ul className="space-y-2 text-sm">
                                    <li>✔ Actualización diaria</li>
                                    <li>✔ Indicadores personalizados</li>
                                    <li>✔ Soporte básico</li>
                                </ul>
                            </div>
                            <div className="rounded-lg bg-white p-4 text-blue-900 shadow">
                                <h3 className="mb-2 text-center text-xl font-bold">Mensual</h3>
                                <ul className="space-y-2 text-sm">
                                    <li>✔ Datos en tiempo real</li>
                                    <li>✔ Análisis detallado</li>
                                    <li>✔ Consultoría breve</li>
                                </ul>
                            </div>
                            <div className="rounded-lg bg-white p-4 text-blue-900 shadow">
                                <h3 className="mb-2 text-center text-xl font-bold">Anual</h3>
                                <ul className="space-y-2 text-sm">
                                    <li>✔ Acceso total a todos los servicios</li>
                                    <li>✔ Reportes personalizados</li>
                                    <li>✔ Atención preferencial</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <h1 className="mb-6 text-3xl font-extrabold text-blue-900">Diferencia entre Especulación e Información</h1>

                    <h2 className="mb-2 text-xl font-bold text-blue-800">Especulación</h2>
                    <ul className="mb-4 list-inside list-disc text-gray-700">
                        <li>
                            <strong>Propósito:</strong> Obtener ganancias a partir de las fluctuaciones de precios, anticipando movimientos futuros a
                            corto o mediano plazo.
                        </li>
                        <li>
                            <strong>Acción:</strong> Compra o venta activa de activos asumiendo riesgos con posibilidad de pérdidas.
                        </li>
                        <li>
                            <strong>Ejemplo:</strong> Comprar acciones esperando que su valor aumente rápidamente y venderlas a un precio mayor.
                        </li>
                    </ul>

                    <h2 className="mb-2 text-xl font-bold text-blue-800">Información</h2>
                    <ul className="mb-4 list-inside list-disc text-gray-700">
                        <li>
                            <strong>Propósito:</strong> Proveer datos o análisis objetivos para que otros tomen decisiones informadas basadas en
                            hechos reales.
                        </li>
                        <li>
                            <strong>Acción:</strong> No implica transacciones ni decisiones basadas en expectativas de cambio de precios.
                        </li>
                        <li>
                            <strong>Ejemplo:</strong> Publicar un informe sobre tasas de cambio sin sugerir comprar o vender.
                        </li>
                    </ul>

                    <h2 className="mb-2 text-xl font-bold text-blue-800">Resumen de las diferencias</h2>
                    <ul className="mb-4 list-inside list-disc text-gray-700">
                        <li>
                            <strong>Especulación:</strong> Acción orientada a obtener ganancias anticipando cambios de precios. Conlleva alto riesgo.
                        </li>
                        <li>
                            <strong>Información:</strong> Provisión de datos con fines educativos o informativos. No busca influir en decisiones
                            financieras directamente.
                        </li>
                    </ul>

                    <div className="mt-6 rounded-md border-l-4 border-blue-700 p-4" style={{ backgroundColor: '#F0F8FF' }}>
                        <p className="text-gray-700">
                            <strong>En el contexto de esta página web:</strong> Nos enfocamos exclusivamente en brindar <strong>información</strong>.
                            Queremos ofrecer datos confiables y verificables sobre variables económicas, promoviendo decisiones informadas sin
                            fomentar la especulación. Así contribuimos a la transparencia y la responsabilidad en un entorno económico complejo.
                        </p>
                    </div>

                    <h2 className="mb-6 text-center text-2xl font-extrabold text-blue-900">¿Por qué confiar en nuestra información?</h2>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        <div className="text-center">
                            <div className="mb-3 flex justify-center text-4xl text-blue-700">
                                <FiRefreshCw />
                            </div>
                            <h3 className="text-lg font-semibold text-blue-800">Actualización Diaria</h3>
                            <p className="mt-2 text-gray-700">
                                Nuestros datos se actualizan cada mañana con las últimas tasas oficiales y de mercado.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="mb-3 flex justify-center text-4xl text-blue-700">
                                <FiShield />
                            </div>
                            <h3 className="text-lg font-semibold text-blue-800">Fuentes Confiables</h3>
                            <p className="mt-2 text-gray-700">
                                Usamos fuentes oficiales como el Banco Central y plataformas reconocidas como Binance.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="mb-3 flex justify-center text-4xl text-blue-700">
                                <FiBookOpen />
                            </div>
                            <h3 className="text-lg font-semibold text-blue-800">Compromiso Educativo</h3>
                            <p className="mt-2 text-gray-700">
                                Promovemos el entendimiento financiero para evitar manipulaciones o malinterpretaciones.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
