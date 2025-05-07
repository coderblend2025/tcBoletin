import React from "react";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({ 
  isOpen, 
  onClose,
  onContinue 
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/70"
      onClick={onClose}
    >
      <div 
        className="p-8 rounded-lg max-w-md w-full mx-4"
        style={{ backgroundColor: '#E8EBF3' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            tcboletineconomico.com
          </h1>
          
          <h2 className="text-xl text-gray-600 mb-6">
            A partir de tu Aporte Voluntario puedes acceder a información actualizada de
            <span className="block font-bold text-gray-800 mt-1">
              tcboletineconomico.com
            </span>
          </h2>
          
          <div className="bg-white p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Aprovecha de nuestra red de consultores independientes
            </h3>
            <p className="text-gray-700 mb-4">
              Tendrás acceso ilimitado a contenido exclusivo
            </p>
            <p className="text-2xl font-bold text-[#242852]">
              Por USD 2,87 mensuales.
            </p>
            <p className="text-gray-600">
              Cancela cuando quieras.
            </p>
          </div>
          
          <button
            onClick={onContinue}
            className="w-full py-3 font-bold rounded-lg transition cursor-pointer bg-[#242852] hover:bg-[#2f346b] text-white"
          >
            CONTINUAR
          </button>
        </div>
      </div>
    </div>
  );
};