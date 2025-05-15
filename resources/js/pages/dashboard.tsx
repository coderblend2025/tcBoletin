import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { BarChart3, DollarSign, Search, Users } from 'lucide-react';
import { useRef, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

// Sample locations in Cochabamba
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

    // Initialize the map when the API is loaded
    window.initMap = () => {
        if (!isAdmin && mapRef.current && !map && window.google) {
            setIsLoading(false);
            const googleMap = new window.google.maps.Map(mapRef.current, {
                center: { lat: -17.393836, lng: -66.156872 }, // Cochabamba coordinates
                zoom: 13,
                styles: [
                    {
                        featureType: 'all',
                        elementType: 'all',
                        stylers: [{ saturation: -50 }],
                    },
                ],
            });

            setMap(googleMap);

            // Add sample markers
            const newMarkers = sampleLocations.map((location) => {
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
                    </div>`,
                });

                marker.addListener('click', () => {
                    infowindow.open(googleMap, marker);
                });

                return marker;
            });

            setMarkers(newMarkers);

            // Initialize SearchBox
            if (searchInputRef.current) {
                const searchBoxInstance = new window.google.maps.places.SearchBox(searchInputRef.current);
                setSearchBox(searchBoxInstance);

                searchBoxInstance.addListener('places_changed', () => {
                    const places = searchBoxInstance.getPlaces();
                    if (places && places.length > 0) {
                        const place = places[0];
                        if (place.geometry && place.geometry.location) {
                            googleMap.setCenter(place.geometry.location);
                            googleMap.setZoom(15);

                            // Add marker for searched location
                            new window.google.maps.Marker({
                                position: place.geometry.location,
                                map: googleMap,
                                title: place.name,
                                animation: window.google.maps.Animation.DROP,
                            });
                        }
                    }
                });
            }
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard">
                {!isAdmin && (
                    <script
                        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBT0JHPi2LOwQYONtCSJGt4zH_WqJsgJD0&libraries=places&callback=initMap"
                        async
                        defer
                    />
                )}
            </Head>

            <div className="flex h-[calc(100vh-4rem)] flex-1 flex-col gap-4">
                {isAdmin ? (
                    <>
                        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                            {/* Usuarios Registrados */}
                            <div className="relative flex aspect-video items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-900">
                                <div className="space-y-2 p-6 text-center">
                                    <Users className="mx-auto h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Usuarios Registrados</h3>
                                    <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">1,235</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Nuevos esta semana: 56</p>
                                </div>
                            </div>

                            {/* Vendedores de Dólares */}
                            <div className="relative flex aspect-video items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-900">
                                <div className="space-y-2 p-6 text-center">
                                    <DollarSign className="mx-auto h-8 w-8 text-green-600 dark:text-green-400" />
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Vendedores de Dólares</h3>
                                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">567</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Activos hoy: 450</p>
                                </div>
                            </div>

                            {/* Ingresos a la Página */}
                            <div className="relative flex aspect-video items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-900">
                                <div className="space-y-2 p-6 text-center">
                                    <BarChart3 className="mx-auto h-8 w-8 text-blue-600 dark:text-blue-400" />
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Ingresos a la Página</h3>
                                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">8,910</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Visitas únicas hoy: 1,289</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-900">
                            <h3 className="mb-4 text-center text-lg font-semibold text-gray-800 dark:text-gray-200">
                                Gráfica del Tipo de Cambio del Dólar
                            </h3>
                            <canvas id="exchangeRateChart" className="h-64 w-full"></canvas>
                        </div>

                        <script>
                            {`
                        document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('exchangeRateChart').getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(0, 18, 118, 0.5)');
    gradient.addColorStop(1, 'rgba(0, 18, 118, 0.05)');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May'],
            datasets: [{
                label: 'Tipo de Cambio (Bs/USD)',
                data: [6.96, 6.95, 6.97, 6.94, 6.96],
                borderColor: '#001276',
                backgroundColor: gradient,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#001276',
                pointBorderColor: '#fff',
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                },
                tooltip: {
                    backgroundColor: '#001276',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Meses',
                        color: '#333',
                        font: { weight: 'bold' }
                    },
                    ticks: {
                        color: '#555'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Bolivianos (Bs)',
                        color: '#333',
                        font: { weight: 'bold' }
                    },
                    ticks: {
                        color: '#555'
                    },
                    beginAtZero: false,
                },
            },
        },
    });
});

                     `}
                        </script>
                    </>
                ) : (
                    <div className="relative h-full w-full">
                        {/* Map Container */}
                        {isLoading && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                                <div className="text-center">
                                    <div className="mb-2 h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">Cargando mapa...</p>
                                </div>
                            </div>
                        )}
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

                        {/* Floating Exchange Rate */}
                        <Card className="absolute top-20 left-4 z-10 bg-white/90 p-4 backdrop-blur-sm dark:bg-gray-800/90">
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
