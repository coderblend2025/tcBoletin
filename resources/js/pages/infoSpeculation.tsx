import MainLayout from '@/layouts/main-layout';
import { SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  FaCoins,
  FaSearch,
  FaChartLine,
  FaUserTie,
  FaExchangeAlt,
  FaArrowUp,
  FaTimesCircle,
  FaBookOpen,
  FaInfoCircle,
} from 'react-icons/fa';// Asegúrate de usar `react-icons/fa6` para estos


const Work = () => {
    const { auth } = usePage<SharedData>().props;

    const [bcvInfo, setBcvInfo] = useState<string>('');
    const [binanceInfo, setBinanceInfo] = useState<string>('');

    useEffect(() => {
        const fetchExchangeRates = () => {
            const bcvData = { compra: 6.86, venta: 6.96 };
            const binanceData = {  compra: 13.16, venta: 11.97 };
            const fecha = new Date().toLocaleDateString('es-BO', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });

            setBcvInfo(`Banco Central de Bolivia: Compra Bs ${bcvData.compra} - Venta Bs ${bcvData.venta}`);
            setBinanceInfo(
                `Binance Bs/USDT: Compra Bs ${binanceData.compra} - Venta Bs ${binanceData.venta} (Actualizado a horas 08:00 a.m. - ${fecha})`,
            );
        };

        fetchExchangeRates();
    }, []);

    return (
    <MainLayout title="Diferencia entre Especulación e Información" auth={auth} bcvInfo={bcvInfo} binanceInfo={binanceInfo}>
      <Head title="Diferencia entre Especulación e Información" />

      <motion.div className="container mx-auto px-4 py-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <motion.div
          className="rounded-3xl md:p-0 p-0 bg-transparent shadow-none"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >

          <section className="mb-10 w-full h-[350px] md:h-[500px] lg:h-[650px] flex items-center justify-center bg-white rounded-3xl overflow-hidden">
            <img
              src="/pictures/diferenciaentreespeculacion.png"
              alt="Diferencia entre especulación e información"
              className="w-full h-full object-contain rounded-3xl"
              style={{ background: 'white' }}
            />
          </section>
        </motion.div>
      </motion.div>
    </MainLayout>
    );
};

export default Work;
