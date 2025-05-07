import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState, useEffect } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { RegisterModal } from "@/components/modals/registerModal";

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        setShowModal(true);
    }, []);
    
    const handleContinue = () => {
        // Lógica cuando se hace clic en CONTINUAR
        setShowModal(false);
    };

    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Crear una cuenta" description="Ingresa tus datos para crear tu cuenta">
        <Head title="Registro" />
        <form className="flex flex-col gap-6" onSubmit={submit}>
            <div className="grid gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                        id="name"
                        type="text"
                        required
                        autoFocus
                        tabIndex={1}
                        autoComplete="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        disabled={processing}
                        placeholder="Nombre completo"
                        className={`w-full p-3 rounded text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 ${errors.name ? 'border-red-500 border' : ''}`}
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>
    
                <div className="grid gap-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input
                        id="email"
                        type="email"
                        required
                        tabIndex={2}
                        autoComplete="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        disabled={processing}
                        placeholder="correo@ejemplo.com"
                        className={`w-full p-3 rounded text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 ${errors.email ? 'border-red-500 border' : ''}`}
                    />
                    <InputError message={errors.email} />
                </div>
    
                <div className="grid gap-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                        id="password"
                        type="password"
                        required
                        tabIndex={3}
                        autoComplete="new-password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        disabled={processing}
                        placeholder="Contraseña"
                        className={`w-full p-3 rounded text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 ${errors.password ? 'border-red-500 border' : ''}`}
                    />
                    <InputError message={errors.password} />
                </div>
    
                <div className="grid gap-2">
                    <Label htmlFor="password_confirmation">Confirmar contraseña</Label>
                    <Input
                        id="password_confirmation"
                        type="password"
                        required
                        tabIndex={4}
                        autoComplete="new-password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        disabled={processing}
                        placeholder="Confirmar contraseña"
                        className={`w-full p-3 rounded text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 ${errors.password_confirmation ? 'border-red-500 border' : ''}`}
                    />
                    <InputError message={errors.password_confirmation} />
                </div>
    
                <Button  className="mt-2 w-full" tabIndex={5} disabled={processing}>
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    Crear cuenta
                </Button>
            </div>
    
            <div className="text-muted-foreground text-center text-sm">
                ¿Ya tienes una cuenta?{' '}
                <TextLink href={route('login')} tabIndex={6}>
                    Iniciar sesión
                </TextLink>
            </div>
        </form>
        <RegisterModal 
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onContinue={handleContinue}
            />
    </AuthLayout>
    );
}
