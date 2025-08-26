import { Dialog } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';
import axios from 'axios';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    traderInfo: {
        id: string;
        ubication_name: string;
        lan: string;
        log: string;
    };
}

interface Price {
    price_buy: string;
    created_at: string;
    updated_at: string;
}

export default function PriceInfoModal({ isOpen, onClose, traderInfo }: Props) {
    const [prices, setPrices] = useState<Price[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && traderInfo?.id) fetchPrices();
    }, [isOpen, traderInfo]);

    const fetchPrices = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/location-money-changer-price/info/${traderInfo.id}`);
            setPrices(res.data);
        } catch (error) {
            console.error('Error al cargar la información:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <Dialog.Panel className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <Dialog.Title className="text-lg font-bold text-gray-800">
                        Información del Punto
                    </Dialog.Title>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <FiX size={20} />
                    </button>
                </div>

                {/* Ubicación y mapa */}
                <div className="mb-6">
                    <div className="mb-2 text-sm text-gray-700"><strong>Ubicación:</strong> {traderInfo.ubication_name}</div>
                    <div className="rounded overflow-hidden border border-gray-200">
                        <iframe
                            width="100%"
                            height="200"
                            frameBorder="0"
                            src={`https://maps.google.com/maps?q=${traderInfo.lan},${traderInfo.log}&z=16&output=embed`}
                            allowFullScreen
                        />
                    </div>
                </div>

                <div className="mb-4 text-base font-semibold text-gray-800">Historial de Precios - Compra</div>
                {loading ? (
                    <div className="text-gray-500 text-center py-6">Cargando datos...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto border text-sm">
                            <thead className="bg-gray-100 text-gray-700">
                                <tr>
                                    <th className="px-3 py-2 text-left">Precio Compra (Bs)</th>
                                    <th className="px-3 py-2 text-left">Fecha de creación</th>
                                    <th className="px-3 py-2 text-left">Última actualización</th>
                                </tr>
                            </thead>
                            <tbody>
                                {prices.map((price, index) => (
                                    <tr key={index} className="border-t">
                                        <td className="px-3 py-2">{price.price_buy}</td>
                                        <td className="px-3 py-2">
                                            {new Date(price.created_at).toLocaleString()}
                                        </td>
                                        <td className="px-3 py-2">
                                            {new Date(price.updated_at).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="flex justify-end mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
                    >
                        Cerrar
                    </button>
                </div>
            </Dialog.Panel>
        </Dialog>
    );
}
