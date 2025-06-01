import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { FaCcVisa, FaCcMastercard, FaCcAmex } from 'react-icons/fa';

import InputError from '@/components/input-error';
import { RegisterModal } from '@/components/modals/registerModal';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    card_number: string;
    card_expiry: string;
    card_cvv: string;
    card_name: string;
};

export default function Register() {
    const [showModal, setShowModal] = useState(true);
    const [step, setStep] = useState(1);

    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        card_number: '',
        card_expiry: '',
        card_cvv: '',
        card_name: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const handleContinue = () => {
        setShowModal(false);
        setStep(2);
    };

    return (
        <AuthLayout
            title={step === 1 ? 'Crear una cuenta' : 'Configura tu tarjeta de crédito o débito'}
            description={step === 1 ? 'Ingresa tus datos para continuar' : 'Completa los datos de tu tarjeta para continuar'}
        >
            <Head title="Registro" />

            <form
                className="flex flex-col gap-6"
                onSubmit={
                    step === 1
                        ? (e) => {
                              e.preventDefault();
                              handleContinue();
                          }
                        : submit
                }
            >
                {step === 1 ? (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nombre</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    autoComplete="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    disabled={processing}
                                    placeholder="Nombre completo"
                                    className={`w-full rounded bg-white p-3 text-gray-800 focus:ring-2 focus:ring-blue-300 focus:outline-none ${errors.name ? 'border border-red-500' : ''}`}
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Correo electrónico</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    disabled={processing}
                                    placeholder="correo@ejemplo.com"
                                    className={`w-full rounded bg-white p-3 text-gray-800 focus:ring-2 focus:ring-blue-300 focus:outline-none ${errors.email ? 'border border-red-500' : ''}`}
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Contraseña</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    autoComplete="new-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    disabled={processing}
                                    placeholder="Contraseña"
                                    className={`w-full rounded bg-white p-3 text-gray-800 focus:ring-2 focus:ring-blue-300 focus:outline-none ${errors.password ? 'border border-red-500' : ''}`}
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">Confirmar contraseña</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    autoComplete="new-password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    disabled={processing}
                                    placeholder="Confirmar contraseña"
                                    className={`w-full rounded bg-white p-3 text-gray-800 focus:ring-2 focus:ring-blue-300 focus:outline-none ${errors.password_confirmation ? 'border border-red-500' : ''}`}
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <Button style={{ backgroundColor: '#03CF48' }} type="submit" className="mt-2 w-full" disabled={processing}>
                                Continuar
                            </Button>
                        </div>

                        <div className="text-muted-foreground text-center text-sm">
                            ¿Ya tienes una cuenta? <TextLink href={route('login')}>Iniciar sesión</TextLink>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="grid gap-6">

                            <div className="flex items-center space-x-2 mb-4">
                                <FaCcVisa className="text-3xl text-blue-600" />
                                <FaCcMastercard className="text-3xl text-red-600" />
                                <FaCcAmex className="text-3xl text-indigo-600" />
                            </div>

                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="card_number">Número de tarjeta</Label>
                                    <Input
                                        id="card_number"
                                        type="text"
                                        required
                                        placeholder="•••• •••• •••• ••••"
                                        value={data.card_number}
                                        onChange={(e) => setData('card_number', e.target.value)}
                                        className="p-3 text-gray-800"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="card_expiry">Fecha de vencimiento</Label>
                                        <Input
                                            id="card_expiry"
                                            type="text"
                                            required
                                            placeholder="MM/AA"
                                            value={data.card_expiry}
                                            onChange={(e) => setData('card_expiry', e.target.value)}
                                            className="p-3 text-gray-800"
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="card_cvv">CVV</Label>
                                        <Input
                                            id="card_cvv"
                                            type="text"
                                            required
                                            placeholder="123"
                                            value={data.card_cvv}
                                            onChange={(e) => setData('card_cvv', e.target.value)}
                                            className="p-3 text-gray-800"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="card_name">Nombre en la tarjeta</Label>
                                    <Input
                                        id="card_name"
                                        type="text"
                                        required
                                        placeholder="Nombre como aparece en la tarjeta"
                                        value={data.card_name}
                                        onChange={(e) => setData('card_name', e.target.value)}
                                        className="p-3 text-gray-800"
                                    />
                                </div>

                                <div className="text-sm text-center text-gray-600">
                                    USD 7,99 al mes - <span className="font-semibold">Premium</span>
                                </div>

                                <p className="text-xs text-gray-500 leading-5 text-justify">
                                    Al hacer clic en el botón <strong>«Iniciar membresía»</strong>, aceptas nuestros <span className="underline">Términos de uso</span> y nuestra <span className="underline">Declaración de privacidad</span>, y declaras que tienes más de 18 años. Asimismo, entiendes que Netflix continuará tu membresía a menos que la canceles, te facturará el cargo mensual (actualmente de USD 7,99 + impuestos aplicables) y puedes cancelarla en cualquier momento desde tu cuenta.
                                </p>

                                <div className="mt-4 flex justify-between">
                                    <Button type="button" variant="outline" onClick={() => setStep(1)} disabled={processing}>
                                        Volver
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                        Crear cuenta / Iniciar Membresía
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </form>

            <RegisterModal isOpen={showModal} onClose={() => setShowModal(false)} onContinue={handleContinue} />
        </AuthLayout>
    );
}
