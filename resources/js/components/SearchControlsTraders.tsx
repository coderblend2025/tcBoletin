import { useForm } from '@inertiajs/react';
import { GoogleMap, Libraries, Marker, useLoadScript } from '@react-google-maps/api';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { IoMdAdd } from 'react-icons/io';

const mapContainerStyle = { width: '100%', height: '400px' };

const center = { lat: -17.393836, lng: -66.156872 };

const mapOptions = {
  styles: [{ featureType: 'all', elementType: 'all', stylers: [{ saturation: -50 }] }],
};

// (si tu build lo requiere, puedes dejar 'geocoding'; no es obligatorio)
const libraries: Libraries = ['places'];

interface GeocoderResult {
  address_components: Array<{ long_name: string; short_name: string; types: string[] }>;
  formatted_address: string;
  geometry: { location: { lat: () => number; lng: () => number } };
}

interface SearchControlsProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  usersPerPage: 5 | 10 | 20 | 50;
  onUsersPerPageChange: (value: 5 | 10 | 20 | 50) => void;
  onActionButtonClick: () => void;
  actionButtonName: string;
  isPopupOpen: boolean;
  setIsPopupOpen: (isOpen: boolean) => void;
  initialData?: {
    id: string | null;
    name: string;
    code: string;
    ubication: string;
    lat: string;
    log: string;
  };
}

export default function SearchControlsTraders({
  searchTerm,
  onSearchChange,
  usersPerPage,
  onUsersPerPageChange,
  onActionButtonClick,
  actionButtonName,
  isPopupOpen,
  setIsPopupOpen,
  initialData,
}: SearchControlsProps) {
  const [selectedPosition, setSelectedPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const { data, setData, post, put } = useForm({
    id: initialData?.id || '',
    name: initialData?.name || '',
    code: initialData?.code || '',
    ubication: initialData?.ubication || '',
    lat: initialData?.lat || '',
    log: initialData?.log || '',
  });

  const allTrue = () => !!(data.name && data.code && data.ubication && (selectedPosition || (data.lat && data.log)));

  const handleCreateTrader = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    post('/traders', {
      onSuccess: () => {
        setData({ id: '', name: '', code: '', ubication: '', lat: '', log: '' });
        setSelectedPosition(null);
        closePopup();
      },
    });
  };

  const handleEditTrader = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    put(`/traders/${data.id}`, { onSuccess: () => closePopup() });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((d) => ({ ...d, [name]: value }));
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyDYuMfW-2HoL1ZvqW4RoCANUKPuHfux3TY',
    libraries,
  });

  const formatDirections = (results: GeocoderResult[]): string => {
    if (results.length > 0 && results[0].address_components?.length > 0) {
      const hasPlusCode = results[0].address_components[0].types.includes('plus_code');
      if (hasPlusCode) {
        const completeName = results[0].formatted_address;
        const plus_code = results[0].address_components[0].long_name;
        return completeName.replace(plus_code + ',', '').trim();
      }
      return results[0].formatted_address;
    }
    return '';
  };

  const formatCode = (results: GeocoderResult[]): string => {
    const string1 = results[0].address_components[1]?.long_name || '';
    const string2 = results[0].address_components[2]?.long_name || '';
    return (string1 + '-' + string2).replaceAll(' ', '-').toLowerCase();
  };

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    if (initialData?.lat && initialData?.log) {
      const position = { lat: parseFloat(initialData.lat), lng: parseFloat(initialData.log) };
      map.setCenter(position);
      map.setZoom(15);
    }
  }, [initialData]);

  const onMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng && mapRef.current) {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        const position = { lat, lng };

        setSelectedPosition(position);
        setData((d) => ({ ...d, lat: lat.toString(), log: lng.toString() }));

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: position }, (results: GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
          if (status === 'OK' && results && results.length > 0) {
            const formatted = formatDirections(results);
            setData((d) => ({ ...d, code: formatCode(results), ubication: formatted }));
          } else {
            setData((d) => ({ ...d, ubication: 'Dirección no encontrada' }));
          }
        });
      }
    },
    [setData],
  );

  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value) as 5 | 10 | 20 | 50;
    onUsersPerPageChange(value);
  };

  const handleNuevoUsuarioClick = () => setIsPopupOpen(true);

  const closePopup = () => {
    setIsPopupOpen(false);
    setData({ id: '', name: '', code: '', ubication: '', lat: '', log: '' });
    setSelectedPosition(null);
  };

  useEffect(() => {
    if (initialData) {
      setData({
        id: initialData.id ?? '',
        name: initialData.name ?? '',
        code: initialData.code ?? '',
        ubication: initialData.ubication ?? '',
        lat: initialData.lat ?? '',
        log: initialData.log ?? '',
      });

      if (initialData.lat && initialData.log) {
        const position = { lat: parseFloat(initialData.lat), lng: parseFloat(initialData.log) };
        setSelectedPosition(position);
        if (mapRef.current) {
          mapRef.current.setCenter(position);
          mapRef.current.setZoom(15);
        }
      }
    }
  }, [initialData]);

  if (loadError) return <div>Error loading maps</div>;

  return (
    <div className="mb-3 px-3 sm:px-6">
      {/* CONTROLES: columna en móvil, fila en >= sm */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Izquierda: buscador + selector */}
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
          {/* Buscador */}
          <div className="relative w-full sm:w-64 md:w-80">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full rounded-md border border-gray-300 bg-white py-2 pr-3 pl-10 text-sm leading-5 placeholder-gray-400 focus:border-[#005A26] focus:outline-none focus:ring-[#005A26]"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              aria-label="Buscar usuarios"
            />
          </div>

          {/* Selector por página */}
          <div className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white sm:w-auto sm:justify-start">
            <span className="px-3 py-2 text-sm text-gray-700">Mostrar:</span>
            <select
              className="w-28 rounded-md border border-transparent px-2 py-2 text-sm focus:border-[#005A26] focus:outline-none focus:ring-[#005A26] bg-white"
              value={usersPerPage}
              onChange={handlePerPageChange}
              aria-label="Usuarios por página"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
            <span className="hidden px-3 py-2 text-sm text-gray-700 xs:inline">por página</span>
          </div>
        </div>

        {/* Botón acción: full width en móvil */}
        <button
          onClick={handleNuevoUsuarioClick}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-[#001276] px-4 py-2 text-sm font-semibold text-white hover:bg-[#00471E] focus:outline-none focus:ring-2 focus:ring-[#00471E] focus:ring-offset-2 sm:w-auto"
        >
          <IoMdAdd />
          <span className="truncate">{actionButtonName}</span>
        </button>
      </div>

      {/* POPUP RESPONSIVE */}
      {isPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50">
          {/* Contenedor: full-screen en móvil, tarjeta centrada en >= sm */}
          <div className="w-full h-[100dvh] sm:h-auto sm:max-h-[90vh] sm:w-[92%] md:w-[85%] lg:w-[80%] rounded-none sm:rounded-2xl bg-white shadow-2xl sm:overflow-hidden flex flex-col">
            {/* Header sticky (móvil) */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b px-4 py-3 sm:px-6 bg-white">
              <h2 className="text-base sm:text-lg font-semibold">Punto de Referencia Cambiaria</h2>
              <button
                onClick={closePopup}
                className="rounded-md bg-red-100 px-3 py-1.5 text-sm font-semibold text-red-700 hover:bg-red-200"
              >
                Cerrar
              </button>
            </div>

            {/* Contenido scrollable */}
            <div className="flex-1 overflow-y-auto">
              {/* Grid responsive: 1 col en móvil, 2 cols en >= md */}
              <div className="grid grid-cols-1 gap-6 p-4 sm:p-6 md:grid-cols-2">
                {/* Formulario */}
                <form className="max-w-full">
                  <div className="mb-4">
                    <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-900">
                      Nombre
                    </label>
                    <input
                      onChange={handleChange}
                      type="text"
                      value={data.name}
                      id="name"
                      name="name"
                      autoComplete="off"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="code" className="mb-1 block text-sm font-medium text-gray-900">
                      Código
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                        TC-
                      </span>
                      <input
                        onChange={handleChange}
                        type="text"
                        id="code"
                        name="code"
                        autoComplete="off"
                        value={data.code}
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="ubication" className="mb-1 block text-sm font-medium text-gray-900">
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

                  <div className="mb-4">
                    <label htmlFor="coordinates" className="mb-1 block text-sm font-medium text-gray-900">
                      Coordenadas
                    </label>
                    <input
                      type="text"
                      id="coordinates"
                      value={
                        selectedPosition
                          ? `${selectedPosition.lat.toFixed(6)}, ${selectedPosition.lng.toFixed(6)}`
                          : data.lat && data.log
                          ? `${data.lat}, ${data.log}`
                          : ''
                      }
                      disabled
                      className="block w-full rounded-lg border border-gray-300 bg-gray-100 p-2.5 text-sm"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Toca/Click en el mapa para autocompletar dirección y coordenadas.
                    </p>
                  </div>
                </form>

                {/* Mapa: alto grande en móvil */}
                <div className="relative w-full">
                  {!isLoaded ? (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100">
                      <div className="text-center">
                        <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
                        <p className="text-sm text-gray-600">Cargando mapa...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-72 sm:h-96 md:h-[400px] rounded-lg overflow-hidden">
                      <GoogleMap
                        mapContainerStyle={{ width: '100%', height: '100%' }}
                        center={selectedPosition || center}
                        zoom={selectedPosition ? 15 : 13}
                        options={mapOptions}
                        onLoad={onMapLoad}
                        onClick={onMapClick}
                      >
                        {selectedPosition && (
                          <Marker position={selectedPosition} onClick={() => setIsPopupOpen(true)} />
                        )}
                      </GoogleMap>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer sticky con acciones (móvil) */}
            <div className="sticky bottom-0 z-10 border-t bg-white px-4 py-3 sm:px-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <button
                  onClick={(e) => {
                    allTrue() && (data.id !== '' ? handleEditTrader(e) : handleCreateTrader(e));
                  }}
                  className={`w-full sm:w-auto rounded-md px-4 py-2 text-white font-semibold ${
                    allTrue() ? 'bg-blue-900 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                  }`}
                  disabled={!allTrue()}
                >
                  {data.id !== '' ? 'Editar' : 'Aceptar'}
                </button>
                <button
                  onClick={closePopup}
                  className="w-full sm:w-auto rounded-md bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
