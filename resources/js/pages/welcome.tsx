import MainLayout from '@/layouts/main-layout';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { WelcomeModal } from "@/components/modals/welcomeModal";
import { motion } from 'framer-motion';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const [bcvInfo, setBcvInfo] = useState('');
    const [binanceInfo, setBinanceInfo] = useState('');
    
    const colorPrimario = '#001276'; // Azul Oscuro
    const colorFondoClaro = '#E8EBF3'; // Una tonalidad muy clara del azul oscuro
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    useEffect(() => {
        const hasVisited = localStorage.getItem('hasVisited');
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
            const binanceData = { compra: 10.50, venta: 11.87 };
            setBcvInfo(`Banco Central de Bolivia: Compra ${bcvData.compra} - Venta ${bcvData.venta}`);
            setBinanceInfo(`Binance Bs/USDT: Compra ${binanceData.compra} - Venta ${binanceData.venta} (Actualizado a horas 08:00 a.m. - 30/11/2024)`);
        };

        fetchExchangeRates();
    }, []);

    return (
        <> <MainLayout title="TC Boletín" auth={auth} bcvInfo={bcvInfo} binanceInfo={binanceInfo}>     
              <motion.aside 
                  className="lg:w-1/4 p-6 rounded-md text-white" 
                  style={{ backgroundColor: colorPrimario }}
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
              >
                  <h2 className="text-xl font-semibold mb-3">¡ÚNETE A LA COMUNIDAD!</h2>
                  <p className="text-sm mb-4">Recibe acceso exclusivo y contenido ilimitado de nuestros consultores expertos.</p>
              </motion.aside>

              <motion.section 
                  className="lg:w-1/2 flex flex-col gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
              >
                  <motion.article 
                      className="border p-5 rounded-md shadow-md" 
                      style={{ backgroundColor:'white', color: colorPrimario }}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                  >
                      <h3 className="text-lg font-semibold mb-3">Entendiendo el Panorama: Especulación vs. Información</h3>
                      <p className="text-sm">• La clave reside en la intención y la acción detrás de cada concepto. Aquí te lo explicamos detalladamente:</p>
                  </motion.article>
                  <motion.article 
                      className="border p-5 rounded-md shadow-md" 
                      style={{ backgroundColor: 'white', color: colorPrimario }}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                  >
                      <h3 className="text-lg font-semibold mb-3">Desglosando las Variables Económicas Clave</h3>
                      <p className="text-sm">• Descubre cómo las principales variables económicas impactan tu día a día y tus decisiones.</p>
                      <a href="/economicVariables" className="text-blue-500 hover:underline">Variables Economicas</a>
                  </motion.article>
                  <motion.article 
                      className="border p-5 rounded-md shadow-md" 
                      style={{ backgroundColor:'white', color: colorPrimario }}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                  >
                      <h3 className="text-lg font-semibold mb-3">Mantente Informado: Noticias Económicas Relevantes</h3>
                      <p className="text-sm">• Accede a las noticias económicas más importantes de los principales medios y publicaciones.</p>
                      <a href="/news" className="text-blue-500 hover:underline">Ver Noticias</a>
                  </motion.article>
              </motion.section>

              <motion.aside 
                  className="lg:w-1/4 p-6 rounded-md text-white" 
                  style={{ backgroundColor: colorPrimario }}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
              >
                  <h2 className="text-xl font-semibold mb-3">¡SÉ PARTE!</h2>
                  <p className="text-sm mb-4">Te brindamos información de mercado actualizada y con total transparencia.</p>
              </motion.aside>

              <motion.div 
                  className="hidden h-14.5 lg:block"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
              >
                  <WelcomeModal 
                      isOpen={isModalOpen} 
                      onClose={() => setIsModalOpen(false)} 
                  />
              </motion.div>    
          </MainLayout>                        
      </>
  );
}