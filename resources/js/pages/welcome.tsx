import MainLayout from '@/layouts/main-layout';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { WelcomeModal } from '@/components/modals/welcomeModal';
import { motion } from 'framer-motion';
import { FaUsers, FaInfoCircle, FaChartBar, FaNewspaper, FaArrowRight } from 'react-icons/fa';
import ExchangeRateChart from '@/components/charts/exchangeRateChart';
import { Card } from '@/components/ui/card';

type Bank = { name: string; compra: string; venta: string; retiro: string; pagoVirtual: string };

export default function Welcome() {
  const { auth } = usePage<SharedData>().props;
  const [bcvInfo, setBcvInfo] = useState('');
  const [binanceInfo, setBinanceInfo] = useState('');
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const colorPrimario = '#001276';
  const colorTextoPrincipal = '#374151';

  const banks: Bank[] = [
    { name: 'Banco BCP', compra: '6.85', venta: '6.95', retiro: '100', pagoVirtual: '100' },
    { name: 'Banco Bisa', compra: '6.84', venta: '6.94', retiro: '100', pagoVirtual: '100' },
    { name: 'Banco BNB', compra: '6.83', venta: '6.93', retiro: '100', pagoVirtual: '100' },
    { name: 'Banco Economico', compra: '6.82', venta: '6.92', retiro: '100', pagoVirtual: '100' },
    { name: 'Banco FIE', compra: '6.81', venta: '6.91', retiro: '100', pagoVirtual: '100' },
    { name: 'Banco Ganadero', compra: '6.80', venta: '6.90', retiro: '100', pagoVirtual: '100' },
    { name: 'Banco Mercantil Santa Cruz', compra: '6.79', venta: '6.89', retiro: '100', pagoVirtual: '100' },
    { name: 'Banco Sol', compra: '6.78', venta: '6.88', retiro: '100', pagoVirtual: '100' },
    { name: 'Banco Union', compra: '6.77', venta: '6.87', retiro: '100', pagoVirtual: '100' },
    { name: 'Banco Fortaleza', compra: '6.76', venta: '6.86', retiro: '100', pagoVirtual: '100' },
    { name: 'Banco Ecofuturo', compra: '6.75', venta: '6.85', retiro: '100', pagoVirtual: '100' },
  ];

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');
    const visitCount = localStorage.getItem('visitCount');
    const newVisitCount = visitCount ? parseInt(visitCount) + 1 : 1;
    localStorage.setItem('visitCount', newVisitCount.toString());
    if (!hasVisited) {
      setIsModalOpen(true);
      localStorage.setItem('hasVisited', 'true');
    } else {
      setIsModalOpen(false);
    }
  }, []);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      const bcvData = { compra: 6.86, venta: 6.96 };
      const binanceData = {  compra: 13.16, venta: 11.97 };
      const today = new Date().toLocaleDateString('es-BO', { day: '2-digit', month: '2-digit', year: 'numeric' });
      setBcvInfo(`Banco Central de Bolivia: Venta Bs ${bcvData.venta} - Compra Bs  ${bcvData.compra} (${today})`);
      setBinanceInfo(`Binance P2P Bs/USDT: Compra Bs ${binanceData.compra} - Venta Bs ${binanceData.venta} (Actualizado ${today} horas 08:00 a.m.)`);
    };
    fetchExchangeRates();
  }, []);

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <MainLayout title="TC Boletín" auth={auth} bcvInfo={bcvInfo} binanceInfo={binanceInfo}>
        <div className="flex flex-col items-center justify-center">
          {/* Sección Principal */}
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row justify-center gap-6 md:gap-8 mb-8 md:mb-12">
            {/* Aside izquierdo */}
            <motion.aside
              className="rounded-2xl p-6 sm:p-8 text-white flex flex-col items-center justify-center shadow-2xl lg:w-1/4 relative overflow-hidden"
              style={{ backgroundColor: colorPrimario }}
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-white/10 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16" />
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto relative">
                  <img
                    src="/pictures/cumunidadexclusiva.png"
                    alt="Comunidad Exclusiva"
                    className="w-16 h-16 sm:w-24 sm:h-24 object-contain relative z-10"
                    onError={(e) => {
                      console.log('Error loading image:', e);
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                    style={{ display: 'block', opacity: 1, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))', transform: 'scale(1.1)' }}
                  />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Comunidad Exclusiva</h2>
                <div className="w-12 sm:w-16 h-0.5 bg-white/50 mx-auto mb-3 sm:mb-4" />
                <p className="text-xs sm:text-sm text-blue-100 mb-5 sm:mb-6 leading-relaxed">
                  Accede a nuestra red de consultores y aprovecha de contenido exclusivo.
                </p>
                <Link
                  href="/register"
                  className="inline-flex items-center bg-white text-blue-900 font-bold py-2.5 sm:py-3 px-5 sm:px-6 rounded-xl hover:bg-blue-50 transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  Únete Gratis <FaArrowRight className="ml-2" />
                </Link>
              </div>
            </motion.aside>

            {/* Sección central (artículos) */}
            <motion.section
              className="flex flex-col gap-4 sm:gap-6 lg:w-1/2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {[
                {
                  img: '/pictures/variablesnuevas.png',
                  title: 'Especulación vs. Información',
                  desc: 'Radica principalmente en el propósito y la acción involucrada en cada uno de estos conceptos',
                  href: '/infoSpeculation',
                  cta: 'Leer más',
                  delay: 0,
                },
                {
                  img: '/pictures/flecha.png',
                  title: 'Variables Económicas',
                  desc: 'Aprende acerca de las principales variables económicas que impactan en tu día a día.',
                  href: '/economicVariables',
                  cta: 'Explorar',
                  delay: 0.1,
                },
                {
                  img: '/pictures/news.png',
                  title: 'Principales Noticias Económicas',
                  desc: 'Noticias económicas de los principales periódicos y publicaciones destacadas.',
                  href: '/news',
                  cta: 'Ver Noticias',
                  delay: 0.2,
                },
              ].map((card, i) => (
                <motion.article
                  key={card.title}
                  className="rounded-2xl bg-white p-5 sm:p-6 shadow-lg hover:shadow-2xl transition-all duration-300 flex items-start gap-3 sm:gap-4 border border-gray-100 hover:border-blue-200"
                  style={{ color: colorTextoPrincipal }}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: card.delay }}
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <img src={card.img} alt={card.title} className="w-7 h-7 sm:w-8 sm:h-8 object-contain" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3" style={{ color: colorPrimario }}>
                      {card.title}
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-3 sm:mb-4">{card.desc}</p>
                    <Link href={card.href} className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold group text-sm sm:text-base">
                      {card.cta}
                      <FaArrowRight className="ml-2 text-xs sm:text-sm group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </motion.section>

            {/* Aside derecho */}
            <motion.aside
              className="rounded-2xl p-6 sm:p-8 text-white lg:w-1/4 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden"
              style={{ backgroundColor: colorPrimario }}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="absolute top-0 left-0 w-24 sm:w-32 h-24 sm:h-32 bg-white/10 rounded-full -ml-12 sm:-ml-16 -mt-12 sm:-mt-16" />
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto relative">
                  <img
                    src="/pictures/protege.png"
                    alt="Sé Parte del Cambio"
                    className="w-16 h-16 sm:w-24 sm:h-24 object-contain relative z-10"
                    onError={(e) => {
                      console.log('Error loading image:', e);
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                    style={{ display: 'block', opacity: 1, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))', transform: 'scale(1.1)' }}
                  />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">¡SÉ PARTE DEL CAMBIO!</h2>
                <div className="w-12 sm:w-16 h-0.5 bg-white/50 mx-auto mb-3 sm:mb-4" />
                <p className="text-xs sm:text-sm text-blue-100 mb-5 sm:mb-6 leading-relaxed">Te ofrecemos información actualizada del mercado con transparencia.</p>
                <Link
                  href={route('register')}
                  className="inline-flex items-center bg-white text-blue-900 font-bold py-2.5 sm:py-3 px-5 sm:px-6 rounded-xl hover:bg-blue-50 transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  Explorar Ahora <FaArrowRight className="ml-2" />
                </Link>
              </div>
            </motion.aside>

            {/* Modal bienvenida (se mantiene oculto en mobile si lo deseas) */}
            <motion.div className="hidden lg:block" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }}>
              <WelcomeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            </motion.div>
          </div>

          {/* Sección de Bancos */}
          <motion.div
            className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center mb-8 md:mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-xl w-full border border-gray-100">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {banks.map((bank, idx) => (
                  <motion.button
                    key={bank.name}
                    className="bg-gradient-to-r from-blue-900 to-blue-800 text-white font-semibold py-3 sm:py-4 px-3 sm:px-6 rounded-xl hover:from-blue-800 hover:to-blue-700 flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer shadow-lg hover:shadow-xl border border-blue-700 text-xs sm:text-sm text-center break-words"
                    onClick={() => {
                      setSelectedBank(bank);
                      setIsBankModalOpen(true);
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaChartBar className="mr-2 opacity-80" />
                    <span className="font-medium">{bank.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Modal Banco */}
            {isBankModalOpen && selectedBank && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-[92vw] sm:max-w-md mx-auto relative border border-blue-100"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ type: 'spring', duration: 0.3 }}
                >
                  <button
                    className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
                    onClick={() => setIsBankModalOpen(false)}
                    aria-label="Cerrar"
                  >
                    ×
                  </button>

                  <div className="text-center mb-5 sm:mb-6">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <FaChartBar className="text-xl sm:text-2xl text-blue-600" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-blue-900">{selectedBank.name}</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-6">
                    <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <span className="text-[11px] sm:text-xs text-blue-600 font-semibold uppercase tracking-wide">Compra</span>
                      <h4 className="text-xl sm:text-2xl font-bold text-blue-900 mt-1">Bs {selectedBank.compra}</h4>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                      <span className="text-[11px] sm:text-xs text-emerald-600 font-semibold uppercase tracking-wide">Venta</span>
                      <h4 className="text-xl sm:text-2xl font-bold text-emerald-900 mt-1">Bs {selectedBank.venta}</h4>
                    </div>
                  </div>

                  <div className="space-y-2.5 sm:space-y-3 mb-5 sm:mb-6">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg text-sm">
                      <span className="text-gray-600">Límite retiro/día</span>
                      <span className="font-semibold text-gray-900">Bs {selectedBank.retiro}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg text-sm">
                      <span className="text-gray-600">Pago virtual/día</span>
                      <span className="font-semibold text-gray-900">Bs {selectedBank.pagoVirtual}</span>
                    </div>
                  </div>

                  <Link
                    href="#"
                    className="w-full inline-flex items-center justify-center bg-gradient-to-r from-blue-900 to-blue-800 text-white font-bold py-3 px-6 rounded-xl hover:from-blue-800 hover:to-blue-700 transition-all duration-200 hover:scale-105"
                  >
                    Ir al Banco <FaArrowRight className="ml-2" />
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </motion.div>

          {/* Sección del Gráfico */}
          <motion.div
            className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-xl w-full border border-gray-100">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-5 sm:mb-6 text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FaChartBar className="text-blue-600 text-lg sm:text-xl" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-blue-900">Gráfica del Tipo de Cambio Bs/USDT</h3>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-gray-50 rounded-xl p-4 sm:p-6 border border-blue-100">
                <ExchangeRateChart />
              </div>
            </div>
          </motion.div>
        </div>
      </MainLayout>
    </div>
  );
}
