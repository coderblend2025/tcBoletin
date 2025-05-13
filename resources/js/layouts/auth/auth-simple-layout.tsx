import AppLogoIcon from '@/components/app-logo-icon';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

const colorPrimario = '#001276';
export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div style={{ backgroundColor: colorPrimario, minHeight: '100vh', padding: '20px' }} className="bg-[#F4F4F4] dark:bg-[#1A1A1A] flex min-h-screen flex-col items-center justify-center gap-8 p-8 md:p-12">
             <div className="text-center mt-4">
                    <button
                        onClick={() => window.location.href = '/'}
                        className="bg-white text-blue-900 font-bold py-2 px-4 rounded hover:bg-blue-100 transition-all duration-200"
                    >
                        Regresar al Home
                    </button>
                </div>
            <div className="w-full max-w-md bg-white dark:bg-[#2A2A2A] rounded-lg shadow-lg p-6 md:p-8">
                <div className="flex flex-col items-center gap-6">
                    <Link href={route('home')} className="flex flex-col items-center gap-3 font-medium">
                        <img src="/pictures/logo.png" alt="TC Boletín Logo" className="h-12 w-auto" />
                    </Link>
                    
                    <div className="space-y-3 text-center">
                        <h1 className="text-2xl font-bold text-[#333333] dark:text-[#EDEDED]">{title}</h1>
                        <p className="text-sm text-[#666666] dark:text-[#B3B3B3]">{description}</p>
                    </div>
                </div>
                <div className="mt-6">
                    {children}
                </div>
            </div>
    </div>
    );
}
