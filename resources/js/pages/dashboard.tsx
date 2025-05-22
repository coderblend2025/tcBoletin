import { useEffect, useRef, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { Globe, Search, Users, DollarSign, BarChart3 } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import axios from 'axios';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
];

const sampleLocations = [
    {
        title: 'Plaza 14 de Septiembre',
        position: { lat: -17.393836, lng: -66.156872 },
        description: 'Plaza principal de Cochabamba',
    },
    {
        title: 'Cristo de la Concordia',
        position: { lat: -17.378244, lng: -66.146916 },
        description: 'Monumento religioso',
    },
    {
        title: 'Universidad Mayor de San Simón',
        position: { lat: -17.391481, lng: -66.146657 },
        description: 'Universidad pública',
    },
];

declare global {
    interface Window {
        google: any;
        initMap: () => void;
    }
}

export default function Dashboard() {
    const { auth } = usePage<{ auth: { user: { roles: string[] } } }>().props;
    const isAdmin = auth.user?.roles.includes('admin');

    const mapRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
    const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [stats, setStats] = useState({
        totalUsers: 0,
        newUsersThisWeek: 0,
        activeSellersToday: 0,
        totalPageViews: 0,
        uniqueVisitsToday: 0,
        totalExchangePoints: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isAdmin) {
            const fetchStats = async () => {
                try {
                    const response = await axios.get('/dashboard-stats');
                    setStats({
                        totalUsers: response.data.total_users,
                        newUsersThisWeek: response.data.new_users_this_week,
                        activeSellersToday: response.data.active_sellers_today,
                        totalPageViews: response.data.total_page_views,
                        uniqueVisitsToday: response.data.unique_visits_today,
                        totalExchangePoints: response.data.total_exchange_points
                    });
                } catch (error) {
                    console.error('Error fetching stats:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchStats();
        }
    }, [isAdmin]);

    // Init Google Map
    window.initMap = () => {
        if (!isAdmin && mapRef.current && !map && window.google) {
            setIsLoading(false);

            const googleMap = new window.google.maps.Map(mapRef.current, {
                center: { lat: -17.393836, lng: -66.156872 },
                zoom: 13,
                styles: [{ featureType: "all", elementType: "all", stylers: [{ saturation: -50 }] }]
            });

            setMap(googleMap);

            const newMarkers = sampleLocations.map(location => {
                const marker = new window.google.maps.Marker({
                    position: location.position,
                    map: googleMap,
                    title: location.title,
                    animation: window.google.maps.Animation.DROP,
                });

                const infowindow = new window.google.maps.InfoWindow({
                    content: `<div class="p-2">
                                    <h3 class="font-semibold">${location.title}</h3>
                                    <p>${location.description}</p>
                                </div>`
                });

                marker.addListener('click', () => infowindow.open(googleMap, marker));
                return marker;
            });

            setMarkers(newMarkers);

            if (searchInputRef.current) {
                const searchBoxInstance = new window.google.maps.places.SearchBox(searchInputRef.current);
                setSearchBox(searchBoxInstance);

                searchBoxInstance.addListener('places_changed', () => {
                    const places = searchBoxInstance.getPlaces();
                    if (places?.length > 0 && places[0].geometry?.location) {
                        googleMap.setCenter(places[0].geometry.location);
                        googleMap.setZoom(15);

                        new window.google.maps.Marker({
                            position: places[0].geometry.location,
                            map: googleMap,
                            title: places[0].name,
                            animation: window.google.maps.Animation.DROP
                        });
                    }
                });
            }
        }
    };

    if (loading && isAdmin) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            </AppLayout>
        );
    }
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard">
                {!isAdmin && (
                    <script
                        src="https://maps.googleapis..com/maps/api/js?key=AIzaSyBT0JHPi2LOwQYONtCSJGt4zH_WqJsgJD0&libraries=places&callback=initMap"
                        async defer
                    />
                )}
            </Head>
             <div className="mb-8 flex items-center justify-between">
                    <div className="bg-white border border-gray-300 w-full p-1">
                        <h4 className="font-semibold text-gray-900 text-xs dark:text-gray-100">
                            Panel Administrativo
                        </h4>
                        <hr />
                    </div>
                </div>
            
            <div className="flex  flex-1 flex-col p-5">
                {/* ADMIN PANEL */}
                {isAdmin ? (
                    <div className="mx-auto max-w-8xl w-full px-2 sm:px-6 lg:px-8"> {/* Contenedor para centrar */}
                        <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                            {/* Users Card */}
                            <StatCard
                                icon={<Users className="mx-auto h-12 w-12 text-indigo-600 dark:text-indigo-400" />}
                                title="Usuarios Registrados"
                                value={stats.totalUsers.toLocaleString()}
                                subtitle={`Nuevos esta semana: ${stats.newUsersThisWeek}`}
                            />

                            {/* Sellers Card */}
                            <StatCard
                                icon={<DollarSign className="mx-auto h-12 w-12 text-green-600 dark:text-green-400" />}
                                title="Vendedores de Dólares"
                                value={stats.activeSellersToday.toLocaleString()}
                                subtitle="Activos hoy"
                            />
                            
                            {/* Visits Card */}
                            <StatCard
                                icon={<BarChart3 className="mx-auto h-12 w-12 text-blue-600 dark:text-blue-400" />}
                                title="Ingresos a la Página"
                                value={(localStorage.getItem('visitCount') || '0')} // Usar visitCount desde localStorage
                                subtitle={`Visitas únicas hoy: ${stats.uniqueVisitsToday}`}
                            />

                            <StatCard
                                icon={<Globe className="mx-auto h-12 w-12 text-amber-600 dark:text-amber-400" />}
                                title="Puntos de Cambio"
                                value={stats.totalExchangePoints.toLocaleString()}
                                subtitle="Registrados hasta hoy"
                            />
                        </div>

                         {/* CONTENEDOR === Gráfica + Tipos de cambio externos */}
                            <div className="mt-4 grid gap-4 md:grid-cols-2">
                            {/* ───────────── GRÁFICA DEL DÓLAR ───────────── */}
                            <Card className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-md p-6">
                                <h3 className="text-center text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                                Gráfica del Tipo de Cambio del Dólar
                                </h3>
                                <canvas id="exchangeRateChart" className="w-full h-64" />
                            </Card>

                            {/* ───────────── TIPOS DE CAMBIO EXTERNOS ───────────── */}
                            <Card className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-md">
                            <div className="p-6">
                                <h3 className="text-center text-xl font-semibold text-gray-800 dark:text-gray-200 mb-5">
                                    Tipos de Cambio en Plataformas Externas
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-sm leading-tight">
                                        <thead className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                                            <tr className="">
                                                <th className="py-3 pr-6 text-left font-semibold tracking-wider">Plataforma</th>
                                                <th className="py-3 pr-6 text-left font-semibold tracking-wider">Compra</th>
                                                <th className="py-3 text-left font-semibold tracking-wider">Venta</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                            <tr>
                                                <td className="py-4 pr-6 font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">Banco Unión</td>
                                                <td className="py-4 pr-6 text-emerald-600 dark:text-emerald-400 whitespace-nowrap">6.90 Bs.</td>
                                                <td className="py-4 text-red-600 dark:text-red-400 whitespace-nowrap">6.96 Bs.</td>
                                            </tr>
                                            <tr>
                                                <td className="py-4 pr-6 font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">Wise</td>
                                                <td className="py-4 pr-6 text-emerald-600 dark:text-emerald-400 whitespace-nowrap">6.92 Bs.</td>
                                                <td className="py-4 text-red-600 dark:text-red-400 whitespace-nowrap">6.98 Bs.</td>
                                            </tr>
                                            <tr>
                                                <td className="py-4 pr-6 font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">Binance P2P</td>
                                                <td className="py-4 pr-6 text-emerald-600 dark:text-emerald-400 whitespace-nowrap">6.94 Bs.</td>
                                                <td className="py-4 text-red-600 dark:text-red-400 whitespace-nowrap">7.01 Bs.</td>
                                            </tr>
                                            <tr>
                                                <td className="py-4 pr-6 font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">Western Union</td>
                                                <td className="py-4 pr-6 text-emerald-600 dark:text-emerald-400 whitespace-nowrap">6.88 Bs.</td>
                                                <td className="py-4 text-red-600 dark:text-red-400 whitespace-nowrap">6.99 Bs.</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
                                    *Última actualización: hace 10 min
                                </p>
                            </div>
                        </Card>
                            </div>

                        {/* Points Card */}
                    </div>
                ) : (
                    // NON-ADMIN MAP SECTION
                    <div className="relative h-full w-full">
                        {isLoading && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                                <div className="text-center">
                                    <div className="mb-2 h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">Cargando mapa...</p>
                                </div>
                            </div>
                        )}

                        {/* Google Map Container */}
                        <div ref={mapRef} className="h-full w-full" style={{ display: isLoading ? 'none' : 'block' }} />

                        {/* Floating Search Box */}
                        <div className="absolute top-4 right-4 left-4 z-10 mx-auto max-w-2xl">
                            <div className="flex gap-2">
                                <Input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Buscar ubicación..."
                                    className="flex-1 bg-white/90 backdrop-blur-sm dark:bg-gray-800/90"
                                />
                                <Button variant="secondary" size="icon" className="bg-white/90 backdrop-blur-sm dark:bg-gray-800/90">
                                    <Search className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Floating Exchange Rate Box */}
                        <Card className="absolute left-4 top-20 z-10 bg-white/90 p-4 backdrop-blur-sm dark:bg-gray-800/90">
                            <h3 className="mb-2 text-sm font-semibold">Tipo de Cambio</h3>
                            <div className="space-y-1 text-sm">
                                <p>USD: 6.96 Bs.</p>
                                <p>EUR: 7.50 Bs.</p>
                            </div>
                        </Card>

                        {/* Floating Locations List */}
                        <Card className="absolute top-20 right-4 z-10 max-h-[calc(100vh-10rem)] w-72 overflow-auto bg-white/90 p-4 backdrop-blur-sm dark:bg-gray-800/90">
                            <h3 className="mb-4 text-sm font-semibold">Ubicaciones</h3>
                            <div className="space-y-3">
                                {sampleLocations.map((location, index) => (
                                    <div key={index} className="space-y-1">
                                        <h4 className="font-medium">{location.title}</h4>
                                        <p className="text-muted-foreground text-sm">{location.description}</p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

// Reusable Card Component for Admin Stats
function StatCard({
    icon,
    title,
    value,
    subtitle,
    buttonLink,
    buttonText
}: {
    icon: React.ReactNode,
    title: string,
    value: string,
    subtitle: string,
    buttonLink?: string,
    buttonText?: string
}) {
    return (
        <div className="relative aspect-video rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-md flex flex-col justify-between">
            <div className="text-center p-6 space-y-2">
                {icon}
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
                <p className="text-3xl font-bold">{value}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
            </div>
            {buttonLink && (
                <a
                    href={buttonLink}
                    className="mx-4 mb-4 mt-auto inline-block rounded-lg bg-indigo-600 px-3 py-1 text-sm font-medium text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-center"
                >
                    {buttonText || 'Ver más'}
                </a>
            )}
        </div>
    );
}