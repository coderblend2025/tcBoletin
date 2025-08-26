import React from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { FaCrown, FaCheck, FaTimes, FaUsers, FaChartLine } from 'react-icons/fa';

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
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Fondo oscuro con desenfoque */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          {/* Modal principal */}
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden border border-gray-200"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 40 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Botón de cerrar elegante */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer"
            >
              <FaTimes className="text-gray-600 text-sm" />
            </button>

            <div className="p-8">
              <div className="text-center mb-6">
                {/* Header mejorado */}
                <motion.div
                  className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <FaCrown className="text-2xl text-blue-600" />
                </motion.div>

                <h1 className="text-2xl font-bold text-blue-900 mb-2">
                  TC Boletín Económico
                </h1>

                <h2 className="text-base text-gray-600 mb-6 leading-relaxed">
                  A partir de tu Aporte Voluntario puedes acceder a información actualizada de
                  <span className="block font-bold text-blue-900 mt-1">
                    tcboletineconomico.com
                  </span>
                </h2>

                {/* Tarjeta de contenido mejorada */}
                <div className="bg-gradient-to-br from-blue-50 to-gray-50 p-6 rounded-xl mb-6 border border-blue-200">
                  <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center justify-center">
                    <FaUsers className="text-blue-600 mr-2" />
                    Aprovecha de nuestra red de consultores independientes
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Tendrás acceso ilimitado a contenido exclusivo
                  </p>
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <p className="text-3xl font-bold text-blue-900 mb-1">
                      USD 2,87
                    </p>
                    <p className="text-sm text-gray-600">
                      mensuales • Cancela cuando quieras
                    </p>
                  </div>
                </div>

                {/* Botón mejorado */}
                <motion.button
                  onClick={onContinue}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  CONTINUAR
                </motion.button>

                {/* Garantía sutil */}
                <p className="text-xs text-gray-500 mt-4">
                  🔒 Proceso seguro y encriptado
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};