import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type SubscriptionForm = {
    card_number: string;
    expiration_date: string;
    cvv: string;
    cardholder_name: string;
    amount: string;
};

export default function Subscription() {
    const { data, setData, post, processing, errors } = useForm<Required<SubscriptionForm>>({
        card_number: '',
        expiration_date: '',
        cvv: '',
        cardholder_name: '',
        amount: '7.99',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('subscription.store'));
    };

    return (
        <AuthLayout title="Configura tu tarjeta de crédito o débito" description="Ingresa los datos para iniciar tu membresía">
            <Head title="Suscripción" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="card_number">Número de tarjeta</Label>
                        <Input
                            id="card_number"
                            type="text"
                            required
                            maxLength={19}
                            autoComplete="cc-number"
                            placeholder="XXXX XXXX XXXX XXXX"
                            value={data.card_number}
                            onChange={(e) => setData('card_number', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.card_number} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="expiration_date">Fecha de vencimiento</Label>
                            <Input
                                id="expiration_date"
                                type="text"
                                required
                                maxLength={7}
                                autoComplete="cc-exp"
                                placeholder="MM/AAAA"
                                value={data.expiration_date}
                                onChange={(e) => setData('expiration_date', e.target.value)}
                                disabled={processing}
                            />
                            <InputError message={errors.expiration_date} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                                id="cvv"
                                type="password"
                                required
                                maxLength={4}
                                autoComplete="cc-csc"
                                placeholder="***"
                                value={data.cvv}
                                onChange={(e) => setData('cvv', e.target.value)}
                                disabled={processing}
                            />
                            <InputError message={errors.cvv} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="cardholder_name">Nombre en la tarjeta</Label>
                        <Input
                            id="cardholder_name"
                            type="text"
                            required
                            autoComplete="cc-name"
                            placeholder="Nombre completo"
                            value={data.cardholder_name}
                            onChange={(e) => setData('cardholder_name', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.cardholder_name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="amount">Monto</Label>
                        <Input
                            id="amount"
                            type="text"
                            disabled
                            value={`USD ${data.amount} al mes`}
                        />
                    </div>

                    <Button type="submit" className="mt-2 w-full bg-red-600 hover:bg-red-700" disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                        Iniciar membresía
                    </Button>
                </div>
            </form>
        </AuthLayout>
    );
}
