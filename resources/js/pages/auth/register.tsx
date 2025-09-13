import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState, useEffect } from 'react';

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
};

export default function Register() {
    const [showModal, setShowModal] = useState(true);
    const [paymentsEnabled, setPaymentsEnabled] = useState(true);
    const [loadingPayments, setLoadingPayments] = useState(true);

    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        fetch('/payment/is-enabled')
            .then(res => res.json())
            .then(data => {
                setPaymentsEnabled(!!data.enabled);
                setLoadingPayments(false);
            })
            .catch(() => setLoadingPayments(false));
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const handleContinue = () => {
        setShowModal(false);
    };

    return (
        <AuthLayout
            title='Crear una cuenta'
            description='Ingresa tus datos para continuar'
        >
            <Head title="Registro" />

            <form
                className="flex flex-col gap-6"
                onSubmit={submit}
            >
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
                        {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                        Crear cuenta
                    </Button>
                </div>
                
                <div className="text-muted-foreground text-center text-sm">
                    ¿Ya tienes una cuenta? <TextLink href={route('login')}>Iniciar sesión</TextLink>
                </div>
            </form>

            <RegisterModal isOpen={showModal} onClose={() => setShowModal(false)} onContinue={handleContinue} />
        </AuthLayout>
    );
}