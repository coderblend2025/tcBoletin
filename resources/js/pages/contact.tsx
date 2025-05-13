import MainLayout from '@/layouts/main-layout';
import { type SharedData } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Contact() {
    const { auth } = usePage<SharedData>().props;
  
    const [bcvInfo, setBcvInfo] = useState('');
    const [binanceInfo, setBinanceInfo] = useState('');

    const colorPrimario = '#001276'; 
    const colorFondoClaro = '#E8EBF3';

    const colorTexto = '#1b1b18';

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const submit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        post(route('contact.send'), {
            onSuccess: () => reset(),
        });
    };


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
        <MainLayout title="Contacto" auth={auth} bcvInfo={bcvInfo} binanceInfo={binanceInfo}>
        <Head title="Contacto" />
    
        <motion.section 
            className="container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div 
                className="bg-white rounded-2xl shadow-md p-8"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-extrabold text-blue-900 mb-4 text-center">Contáctanos</h1>
                <p className="text-gray-700 text-center mb-10">
                    ¿Tienes preguntas, comentarios o sugerencias? ¡Estamos aquí para ayudarte! Completa el formulario o utiliza nuestra información de contacto.
                </p>
    
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <motion.div 
                        className="rounded-xl p-6" 
                        style={{ backgroundColor: '#EBFFF2' }}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-2xl font-bold text-blue-900 mb-4">Nuestra Información</h2>
                        <ul className="text-gray-700 space-y-4">
                            <li>
                                <strong className="text-blue-900">Dirección:</strong><br />
                                Av. Blanco Galindo Km 8.5 Una cuadra al norte, Cochabamba, Bolivia
                            </li>
                            <li>
                                <strong className="text-blue-900">Correo Electrónico:</strong><br />
                                info@tuempresa.com
                            </li>
                            <li>
                                <strong className="text-blue-900">Teléfono:</strong><br />
                                +591 XXXXXXXXX
                            </li>
                        </ul>
                    </motion.div>
    
                    <motion.form 
                        onSubmit={submit} 
                        className="bg-blue-900 text-white rounded-xl p-6 shadow-lg"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-xl font-semibold mb-6 text-center">Envíanos un Mensaje</h2>
    
                        {[
                            { label: 'Nombre', id: 'name', type: 'text', value: data.name, error: errors.name },
                            { label: 'Correo Electrónico', id: 'email', type: 'email', value: data.email, error: errors.email },
                            { label: 'Asunto', id: 'subject', type: 'text', value: data.subject, error: errors.subject },
                        ].map(({ label, id, type, value, error }) => (
                            <div key={id} className="mb-4">
                                <label htmlFor={id} className="block text-sm font-bold mb-2">{label}</label>
                                <input
                                    id={id}
                                    type={type}
                                    value={value}
                                    onChange={(e) => setData("email", e.target.value)}
                                    className={`w-full p-3 rounded text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 ${error ? 'border-red-500 border' : ''}`}
                                    placeholder={`Tu ${label.toLowerCase()}`}
                                />
                                {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
                            </div>
                        ))}
    
                        <div className="mb-6">
                            <label htmlFor="message" className="block text-sm font-bold mb-2">Mensaje</label>
                            <textarea
                                id="message"
                                value={data.message}
                                onChange={(e) => setData('message', e.target.value)}
                                className={`w-full p-3 rounded text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 ${errors.message ? 'border-red-500 border' : ''}`}
                                placeholder="Escribe tu mensaje aquí..."
                                rows={4}
                            />
                            {errors.message && <p className="text-red-400 text-sm mt-1">{errors.message}</p>}
                        </div>
    
                        <div className="text-center">
                            <button
                                type="submit"
                                disabled={processing}
                                className={`bg-white text-blue-900 font-bold py-3 px-6 rounded hover:bg-blue-100 transition-all duration-200 ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {processing ? 'Enviando...' : 'Enviar Mensaje'}
                            </button>
                        </div>
                    </motion.form>
                </div>
            </motion.div>
        </motion.section>
    </MainLayout>
    
    );


}