import MainLayout from '@/layouts/main-layout';
import { type SharedData } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react'

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

            <div className="container">
                <h1 className="text-4xl font-extrabold mb-6 text-center" style={{ color: colorPrimario }}>Contáctanos</h1>
                <p className="mb-8 text-lg text-center" style={{ color: colorTexto }}>¿Tienes preguntas o sugerencias? ¡Estamos aquí para ayudarte!</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Información de Contacto */}
                    <div className="bg-white rounded-lg p-6" style={{ backgroundColor: colorFondoClaro }}>
                        <h2 className="text-2xl font-semibold mb-4" style={{ color: colorPrimario }}>Nuestra Información</h2>
                        <p className="mb-4"><strong style={{ color: colorPrimario }}>Dirección:</strong> Av. Blanco Galindo Km 8.5 Una cuadra al norte, Cochabamba, Bolivia</p>
                        <p className="mb-4"><strong style={{ color: colorPrimario }}>Email:</strong> info@tuempresa.com</p>
                        <p className="mb-4"><strong style={{ color: colorPrimario }}>Teléfono:</strong> +591 XXXXXXXXX</p>
                    </div>

                    {/* Formulario de Contacto */}
                    <form onSubmit={submit} className="bg-white shadow-lg rounded-lg p-8" style={{ backgroundColor: colorPrimario }}>
                        <h2 className="text-2xl font-semibold mb-6 text-center" style={{ color: 'white' }}>Envíanos un Mensaje</h2>
                        <div className="mb-6">
                            <label className="block text-sm font-bold mb-2" htmlFor="name" style={{ color: 'white' }}>
                                Nombre
                            </label>
                            <input
                                className={`shadow border rounded w-full py-3 px-4 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-${colorPrimario} ${errors.name ? 'border-red-500' : ''}`}
                                id="name"
                                type="text"
                                placeholder="Tu nombre"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            {errors.name && <p className="text-red-500 text-xs italic mt-2">{errors.name}</p>}
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-bold mb-2" htmlFor="email" style={{ color: 'white' }}>
                                Correo Electrónico
                            </label>
                            <input
                                className={`shadow border rounded w-full py-3 px-4 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-${colorPrimario} ${errors.email ? 'border-red-500' : ''}`}
                                id="email"
                                type="email"
                                placeholder="Tu correo electrónico"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            {errors.email && <p className="text-red-500 text-xs italic mt-2">{errors.email}</p>}
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-bold mb-2" htmlFor="subject" style={{ color: 'white' }}>
                                Asunto
                            </label>
                            <input
                                className={`shadow border rounded w-full py-3 px-4 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-${colorPrimario} ${errors.subject ? 'border-red-500' : ''}`}
                                id="subject"
                                type="text"
                                placeholder="Asunto del mensaje"
                                value={data.subject}
                                onChange={(e) => setData('subject', e.target.value)}
                            />
                            {errors.subject && <p className="text-red-500 text-xs italic mt-2">{errors.subject}</p>}
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-bold mb-2" htmlFor="message" style={{ color: 'white' }}>
                                Mensaje
                            </label>
                            <textarea
                                className={`shadow border rounded w-full py-3 px-4 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-${colorPrimario} ${errors.message ? 'border-red-500' : ''}`}
                                id="message"
                                placeholder="Escribe tu mensaje aquí..."
                                value={data.message}
                                onChange={(e) => setData('message', e.target.value)}
                            ></textarea>
                            {errors.message && <p className="text-red-500 text-xs italic mt-2">{errors.message}</p>}
                        </div>
                        <div className="flex justify-center">
                            <button
                                className={`bg-white hover:bg-opacity-90 text-${colorPrimario} font-bold py-3 px-6 rounded focus:outline-none focus:ring-2 focus:ring-${colorPrimario} ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                type="submit"
                                disabled={processing}
                                style={{ color: colorPrimario }}
                            >
                                {processing ? 'Enviando...' : 'Enviar Mensaje'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </MainLayout>
    );


}