import { useForm } from '@inertiajs/react';
import { GoogleMap, Libraries, Marker, useLoadScript } from '@react-google-maps/api';
import React, { useCallback, useRef, useState } from 'react';

const mapContainerStyle = {
    width: '100%',
    height: '400px',
};

const center = {
    lat: -17.393836,
    lng: -66.156872,
};

const mapOptions = {
    styles: [
        {
            featureType: 'all',
            elementType: 'all',
            stylers: [{ saturation: -50 }],
        },
    ],
};

// Move libraries configuration outside component
const libraries: Libraries = ['places', 'geocoding'];

interface GeocoderResult {
    address_components: Array<{
        long_name: string;
        short_name: string;
        types: string[];
    }>;
    formatted_address: string;
    geometry: {
        location: {
            lat: () => number;
            lng: () => number;
        };
    };
}

interface SearchControlsProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
    usersPerPage: 5 | 10 | 20 | 50;
    onUsersPerPageChange: (value: 5 | 10 | 20 | 50) => void;
    onActionButtonClick: () => void;
    actionButtonName: string;
}

interface FormData {
    name: string;
    code: string;
    ubication: string;
    lat: string;
    log: string;
}

export default function SearchControlsTraders({
    searchTerm,
    onSearchChange,
    usersPerPage,
    onUsersPerPageChange,
    onActionButtonClick,
    actionButtonName,
}: SearchControlsProps) {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState<google.maps.LatLngLiteral | null>(null);
    const mapRef = useRef<google.maps.Map | null>(null);
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        code: '',
        ubication: '',
        lat: '',
        log: '',
    });
    const allTrue = () => {
        if (data.name && data.code && data.ubication && selectedPosition) {
            return true;
        }
        return false;
    };
    const handleCreateTrader = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        post('/traders', {
            onSuccess: () => {
                setData({
                    name: '',
                    code: '',
                    ubication: '',
                    lat: '',
                    log: '',
                });
                setSelectedPosition(null);
                closePopup();
            },
        });
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData((data) => ({
            ...data,
            [name]: value,
        }));
    };

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: 'AIzaSyBT0JHPi2LOwQYONtCSJGt4zH_WqJsgJD0',
        libraries,
    });

    const formatDirections = (results: GeocoderResult[]): string => {
        console.log(results);
        if (results.length > 0 && results[0].address_components && results[0].address_components.length > 0) {
            const hasPlusCode = results[0].address_components[0].types.includes('plus_code');
            console.log('hasplus', hasPlusCode);
            if (hasPlusCode) {
                const completeName = results[0].formatted_address; //JR3W+2X Cochabamba, Cochabamba, Bolivia
                const plus_code = results[0].address_components[0].long_name; //JR3W+2X
                const withoutCode = completeName.replace(plus_code + ',', '').trim();
                console.log('Plus code found');
                return withoutCode;
            }
            return results[0].formatted_address;
        }
        return '';
    };
    const formatCode = (results: GeocoderResult[]): string => {
        const string1 = results[0].address_components[1].long_name;
        const string2 = results[0].address_components[2].long_name;

        return (string1 + '-' + string2).replaceAll(' ', '-').toLowerCase();
    };

    const onMapLoad = useCallback((map: google.maps.Map) => {
        mapRef.current = map;
    }, []);

    const onMapClick = useCallback(
        (e: google.maps.MapMouseEvent) => {
            if (e.latLng && mapRef.current) {
                const lat = e.latLng.lat();
                const lng = e.latLng.lng();
                const position = { lat, lng };

                setSelectedPosition(position);

                // Update form data with coordinates
                setData({
                    ...data,
                    lat: lat.toString(),
                    log: lng.toString(),
                });

                // Get address from coordinates
                const geocoder = new window.google.maps.Geocoder();
                geocoder.geocode({ location: position }, (results: GeocoderResult[], status: google.maps.GeocoderStatus) => {
                    if (status === 'OK' && results && results.length > 0) {
                        const formatted = formatDirections(results);
                        setData((data) => ({
                            ...data,
                            code: formatCode(results),
                            ubication: formatted,
                        }));
                    } else {
                        setData((data) => ({
                            ...data,
                            ubication: 'Dirección no encontrada',
                        }));
                    }
                });
            }
        },
        [data],
    );

    const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = parseInt(e.target.value) as 5 | 10 | 20 | 50;
        onUsersPerPageChange(value);
    };

    const handleNuevoUsuarioClick = () => {
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
    };

    if (loadError) {
        return <div>Error loading maps</div>;
    }

    return (
        <div className="mb-3 flex items-center justify-between gap-4 px-6">
            <div className="flex items-center gap-4">
                <div className="relative w-full sm:w-64">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <input
                        type="text"
                        className="block w-full rounded-md border border-gray-300 bg-white py-2 pr-3 pl-10 leading-5 placeholder-gray-400 focus:border-[#005A26] focus:ring-[#005A26] focus:outline-none sm:text-sm"
                        placeholder="Buscar..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        aria-label="Buscar usuarios"
                    />
                </div>

                <div className="flex items-center gap-2 rounded-md border border-gray-300 bg-white">
                    <span className="p-2 text-sm text-gray-700">Mostrar:</span>
                    <select
                        className="block w-20 rounded-md border border-gray-300 py-2 pr-2 pl-2 text-sm focus:border-[#005A26] focus:ring-[#005A26] focus:outline-none"
                        value={usersPerPage}
                        onChange={handlePerPageChange}
                        aria-label="Usuarios por página"
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                    </select>
                    <span className="p-2 text-sm text-gray-700">por página</span>
                </div>
            </div>

            <button
                onClick={handleNuevoUsuarioClick}
                className="flex cursor-pointer items-center gap-2 rounded-md bg-[#001276] px-4 py-2 text-sm font-semibold text-white hover:bg-[#00471E] focus:ring-2 focus:ring-[#005A26] focus:ring-offset-1 focus:outline-none"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5 3a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2H5zm7 14a1 1 0 110-2 1 1 0 010 2zm1-4H8a1 1 0 010-2h5a1 1 0 010 2z" />
                </svg>
                {actionButtonName}
            </button>

            {isPopupOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-[80%] rounded-lg bg-white p-6 shadow-lg">
                        <h2 className="mb-4 text-lg font-semibold">Nuevo librecambista</h2>
                        <div className="flex gap-x-10">
                            <form className="mx-right max-w-xl min-w-[20rem]">
                                <div className="mb-5">
                                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                        Nombre
                                    </label>
                                    <input
                                        onChange={handleChange}
                                        type="text"
                                        value={data.name}
                                        id="name"
                                        name="name"
                                        autoComplete="off"
                                        className="dark:shadow-xs-light block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-xs focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div className="mb-5">
                                    <label htmlFor="code" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                        Código
                                    </label>
                                    <div className="relative">
                                        <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-gray-500">TC-</span>
                                        <input
                                            onChange={handleChange}
                                            type="text"
                                            id="code"
                                            autoComplete="off"
                                            name="code"
                                            value={data.code}
                                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 shadow-xs focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="mb-5">
                                    <label htmlFor="repeat-password" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                        Ubicación
                                    </label>
                                    <input
                                        onChange={handleChange}
                                        type="text"
                                        id="ubication"
                                        name="ubication"
                                        autoComplete="off"
                                        value={data.ubication}
                                        required
                                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm"
                                    />
                                </div>
                                <div className="mb-5">
                                    <label htmlFor="coordinates" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                        Coordenadas
                                    </label>
                                    <input
                                        type="text"
                                        id="coordinates"
                                        value={selectedPosition ? `${selectedPosition.lat.toFixed(6)}, ${selectedPosition.lng.toFixed(6)}` : ''}
                                        disabled={true}
                                        className="block w-full rounded-lg border border-gray-300 bg-gray-200 p-2.5 text-sm"
                                    />
                                </div>
                                <div className="mt-10 flex items-center justify-end gap-2">
                                    <button
                                        onClick={(e) => handleCreateTrader(e)}
                                        className={`mt-4 rounded-md ${allTrue() ? 'bg-blue-900' : 'bg-gray-500'} cursor-pointer px-4 py-2 text-white hover:bg-blue-600`}
                                        disabled={!allTrue()}
                                    >
                                        Aceptar
                                    </button>
                                    <button
                                        onClick={closePopup}
                                        className="mt-4 cursor-pointer rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </form>
                            <div className="relative h-[400px] w-full">
                                {!isLoaded ? (
                                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100">
                                        <div className="text-center">
                                            <div className="mb-2 h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-gray-900"></div>
                                            <p className="text-sm text-gray-600">Cargando mapa...</p>
                                        </div>
                                    </div>
                                ) : (
                                    <GoogleMap
                                        mapContainerStyle={mapContainerStyle}
                                        center={center}
                                        zoom={13}
                                        options={mapOptions}
                                        onLoad={onMapLoad}
                                        onClick={onMapClick}
                                    >
                                        {selectedPosition && <Marker position={selectedPosition} onClick={() => setIsPopupOpen(true)} />}
                                        {/* {isPopupOpen && selectedPosition && (
                                            <InfoWindow position={selectedPosition} onCloseClick={() => setIsPopupOpen(false)}>
                                                <div>
                                                    <p>Latitud: {selectedPosition.lat}</p>
                                                    <p>Longitud: {selectedPosition.lng}</p>
                                                </div>
                                            </InfoWindow>
                                        )} */}
                                    </GoogleMap>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
