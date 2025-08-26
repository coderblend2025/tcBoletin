import { Head } from '@inertiajs/react';
import React from 'react';

import AppInfoBar from '@/components/app-infobar';
import AppMainNavigation from '@/components/app-mainnavigation';
import AppMainHeader from '@/components/app-mainheader';
import AppFooter from '@/components/app-footer';

interface MainLayoutProps {
    title: string;
    bcvInfo: string;
    binanceInfo: string;
    auth: any;
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
            <div className="flex min-h-screen flex-col items-center bg-[#333333]  text-[#1b1b18] lg:justify-start dark:bg-[#0a0a0a]">
                <AppInfoBar bcvInfo={bcvInfo} binanceInfo={binanceInfo} colorPrimario={colorPrimario} />
                <AppMainHeader auth={auth} colorPrimario={colorPrimario} />
                <AppMainNavigation colorPrimario={colorPrimario} />
                <main
                    className="max-w mx-auto flex w-full flex-col gap-8 px-4 py-8 sm:px-6 lg:flex-row lg:px-8 bg-[#f0f2f5] dark:bg-[#1a1a1a]"
                >
                    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:flex-row lg:px-8">{children}</div>
                </main>
                <AppFooter />
            </div>
        </>
    );
}
