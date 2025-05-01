import { Head } from '@inertiajs/react';
import React from 'react';

import AppInfoBar from '@/components/app-infobar';
import AppMainNavigation from '@/components/app-mainnavigation';
import AppMainHeader from '@/components/app-mainheader';
import AppFooter from '@/components/app-footer';

interface MainLayoutProps {
    title: string;
    bcvInfo: any; // Replace 'any' with the appropriate type if known
    binanceInfo: any; // Replace 'any' with the appropriate type if known
    auth: any; // Replace 'any' with the appropriate type if known
    children: React.ReactNode;
}

export default function MainLayout({ title, bcvInfo, binanceInfo, auth, children }: MainLayoutProps) {
    const colorPrimario = '#001276';

    return (
        <>
            <Head title={title}>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] text-[#1b1b18] lg:justify-start dark:bg-[#0a0a0a]">
                <AppInfoBar bcvInfo={bcvInfo} binanceInfo={binanceInfo} colorPrimario={colorPrimario} />
                <AppMainHeader auth={auth} colorPrimario={colorPrimario} />
                <AppMainNavigation colorPrimario={colorPrimario} />
                <main className="flex flex-col lg:flex-row w-full max-w mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8" style={{ backgroundColor: '#E8EBF3' }}>
                    <div className="flex flex-col lg:flex-row w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
                        {children}
                    </div>
                </main>
                <AppFooter/>
            </div>
        </>
    );
}