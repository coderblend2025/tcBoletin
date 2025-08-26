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
        
        // Crear el contenido del email
        const emailSubject = encodeURIComponent(data.subject || 'Contacto desde TC Boletín');
        const emailBody = encodeURIComponent(
            `Nombre: ${data.name}\n` +
            `Email: ${data.email}\n` +
            `Asunto: ${data.subject}\n\n` +
            `Mensaje:\n${data.message}`
        );
        
        // Abrir cliente de email
        window.location.href = `mailto:tcboletin@gmail.com?subject=${emailSubject}&body=${emailBody}`;
        
        // Resetear el formulario
        reset();
    };


   useEffect(() => {
        const fetchExchangeRates = async () => {
              const bcvData = { compra: 6.86, venta: 6.96 };
            const binanceData = { compra: 14.02, venta: 14.02 };
            const today = new Date().toLocaleDateString('es-BO', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
            setBcvInfo(`Banco Central de Bolivia: Venta Bs ${bcvData.compra} - Compra Bs ${bcvData.venta} (${today})`);
            setBinanceInfo(`Binance Bs/USDT: Compra Bs ${binanceData.compra} - Venta Bs ${binanceData.venta} (Actualizado a horas 08:00 a.m. - ${today})`);
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
                className="bg-white rounded-2xl shadow-xl p-8 lg:p-12"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="text-center mb-12">
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-blue-900 mb-6">Contáctanos</h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto mb-6 rounded-full"></div>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                        ¿Tienes preguntas, comentarios o sugerencias? ¡Estamos aquí para ayudarte! Completa el formulario o utiliza nuestra información de contacto.
                    </p>
                </div>
    
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <motion.div 
                        className="rounded-2xl p-8 bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-100 shadow-lg" 
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center mr-4">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-blue-900">Información de Contacto</h2>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-blue-900 text-lg mb-2">Dirección</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        Calle Jacarandá s/n<br />
                                        Zona Puntiti Chico<br />
                                        Cochabamba, Bolivia
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-blue-900 text-lg mb-2">Correo Electrónico</h3>
                                    <a href="mailto:tcboletin@gmail.com" className="text-blue-600 hover:text-blue-700 transition-colors text-sm">
                                        tcboletin@gmail.com
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-blue-900 text-lg mb-2">Teléfono</h3>
                                    <p className="text-gray-600 text-sm">+591 XXXXXXXXX</p>
                                </div>
                            </div>

                            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl border border-blue-100">
                                <h3 className="font-bold text-blue-900 text-lg mb-3 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Horarios de Atención
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Lunes a Viernes: 8:00 AM - 6:00 PM<br />
                                    Sábados: 9:00 AM - 2:00 PM
                                </p>
                            </div>
                        </div>
                    </motion.div>
    
                    <motion.form 
                        onSubmit={submit} 
                        className="bg-gradient-to-br from-blue-900 to-blue-800 text-white rounded-2xl p-8 shadow-2xl border border-blue-700"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Envíanos un Mensaje</h2>
                            <p className="text-blue-100 text-sm">Completa el formulario y nos pondremos en contacto contigo</p>
                        </div>
    
                        {[
                            { label: 'Nombre', id: 'name', type: 'text', value: data.name, error: errors.name },
                            { label: 'Correo Electrónico', id: 'email', type: 'email', value: data.email, error: errors.email },
                            { label: 'Asunto', id: 'subject', type: 'text', value: data.subject, error: errors.subject },
                        ].map(({ label, id, type, value, error }) => (
                            <div key={id} className="mb-6">
                                <label htmlFor={id} className="block text-sm font-semibold mb-3 text-blue-100">{label}</label>
                                <input
                                    id={id}
                                    type={type}
                                    value={value}
                                    onChange={(e) => setData(id as keyof typeof data, e.target.value)}
                                    className={`w-full p-4 rounded-xl text-gray-800 bg-white bg-opacity-95 focus:outline-none focus:ring-3 focus:ring-blue-300 focus:bg-white transition-all duration-200 placeholder-gray-400 ${error ? 'border-2 border-red-400' : 'border border-gray-200'}`}
                                    placeholder={`Ingresa tu ${label.toLowerCase()}`}
                                />
                                {error && <p className="text-red-300 text-sm mt-2 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {error}
                                </p>}
                            </div>
                        ))}
    
                        <div className="mb-6">
                            <label htmlFor="message" className="block text-sm font-semibold mb-3 text-blue-100">Mensaje</label>
                            <textarea
                                id="message"
                                value={data.message}
                                onChange={(e) => setData('message', e.target.value)}
                                className={`w-full p-4 rounded-xl text-gray-800 bg-white bg-opacity-95 focus:outline-none focus:ring-3 focus:ring-blue-300 focus:bg-white transition-all duration-200 placeholder-gray-400 resize-none ${errors.message ? 'border-2 border-red-400' : 'border border-gray-200'}`}
                                placeholder="Cuéntanos en qué podemos ayudarte..."
                                rows={5}
                            />
                            {errors.message && <p className="text-red-300 text-sm mt-2 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.message}
                            </p>}
                        </div>
    
                        <div className="text-center pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className={`bg-white text-blue-900 font-bold py-4 px-8 rounded-xl hover:bg-blue-50 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center mx-auto space-x-2 ${processing ? 'opacity-50 cursor-not-allowed transform-none' : 'hover:transform'}`}
                            >
                                {processing ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Enviando...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                        <span>Enviar Mensaje</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.form>
                </div>
            </motion.div>
        </motion.section>
    </MainLayout>
    
    );


}