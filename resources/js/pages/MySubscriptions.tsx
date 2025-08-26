import React from 'react';

export default function MySubscriptions() {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold text-blue-900 mb-4">Mis Subscripciones</h1>
      <p className="text-blue-700 mb-6">Aquí puedes ver y gestionar tus subscripciones activas.</p>
      {/* Aquí va la lógica y la UI para mostrar las subscripciones */}
      <div className="bg-white rounded-xl shadow p-6 border border-blue-100">
        <p className="text-gray-500">No tienes subscripciones activas.</p>
      </div>
    </div>
  );
}
