import { Dialog } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { FiX, FiCheckCircle, FiTrash2, FiPlus } from 'react-icons/fi';
import axios from 'axios';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    traderId: string;
}

interface Price {
    id?: number;
    price_buy: string;
    price_sale: string;
    isNew?: boolean;
}

export default function AddPriceModal({ isOpen, onClose, traderId }: Props) {
    const [prices, setPrices] = useState<Price[]>([]);
    const [loading, setLoading] = useState(false);
    const [savingIndex, setSavingIndex] = useState<number | null>(null);

    useEffect(() => {
        if (isOpen && traderId) fetchPrices();
    }, [isOpen, traderId]);

    const fetchPrices = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/location-money-changer-price/${traderId}`);
            setPrices(res.data);
        } catch (error) {
            console.error('Error al cargar precios:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (index: number, field: 'price_buy' | 'price_sale', value: string) => {
        const updated = [...prices];
        updated[index][field] = value;
        setPrices(updated);
    };

    const addRow = () => {
        setPrices([...prices, { price_buy: '', price_sale: '', isNew: true }]);
    };

    const saveRow = async (price: Price, index: number) => {
        setSavingIndex(index);
        try {
            if (price.isNew) {
                await axios.post('/location-money-changer-price', {
                    id_location_money_changer: traderId,
                    price_buy: price.price_buy,
                    price_sale: price.price_sale,
                });
            } else {
                await axios.put(`/location-money-changer-price/${price.id}`, {
                    price_buy: price.price_buy,
                    price_sale: price.price_sale,
                });
            }
            await fetchPrices();
        } catch (err) {
            console.error('Error al guardar precio:', err);
        } finally {
            setSavingIndex(null);
        }
    };

    const deleteRow = async (price: Price, index: number) => {
        if (price.id) {
            try {
                await axios.delete(`/location-money-changer-price/${price.id}`);
                await fetchPrices();
            } catch (err) {
                console.error('Error al eliminar precio:', err);
            }
        } else {
            const updated = prices.filter((_, i) => i !== index);
            setPrices(updated);
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <Dialog.Panel className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <Dialog.Title className="text-lg font-bold text-gray-800">
                        Precios del Dólar - Librecambista
                    </Dialog.Title>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <FiX size={20} />
                    </button>
                </div>

                {loading ? (
                    <div className="text-gray-500 text-center py-6">Cargando precios...</div>
                ) : (
                    <div className="space-y-4">
                        <table className="w-full table-auto border text-sm">
                            <thead className="bg-gray-100 text-gray-700">
                                <tr>
                                    <th className="px-3 py-2 text-left">Compra (Bs)</th>
                                    <th className="px-3 py-2 text-left">Venta (Bs)</th>
                                    <th className="px-3 py-2 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {prices.map((price, index) => (
                                    <tr key={index} className="border-t">
                                        <td className="px-3 py-2">
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={price.price_buy}
                                                onChange={e => handleChange(index, 'price_buy', e.target.value)}
                                                className="w-full border rounded px-2 py-1 text-sm"
                                            />
                                        </td>
                                        <td className="px-3 py-2">
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={price.price_sale}
                                                onChange={e => handleChange(index, 'price_sale', e.target.value)}
                                                className="w-full border rounded px-2 py-1 text-sm"
                                            />
                                        </td>
                                        <td className="px-3 py-2 text-right space-x-2">
                                            <button
                                                onClick={() => saveRow(price, index)}
                                                disabled={savingIndex === index}
                                                className="text-green-600 hover:underline text-sm"
                                            >
                                                {savingIndex === index ? 'Guardando...' : 'Guardar'}
                                            </button>
                                            <button
                                                onClick={() => deleteRow(price, index)}
                                                className="text-red-600 hover:underline text-sm"
                                            >
                                                <FiTrash2 className="inline-block mr-1" />
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button
                            onClick={addRow}
                            className="flex items-center text-blue-600 text-sm hover:underline"
                        >
                            <FiPlus className="mr-1" />
                            Añadir nuevo precio
                        </button>
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
