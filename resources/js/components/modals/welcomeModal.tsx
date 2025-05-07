import React from "react";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/70"
      onClick={onClose}
    >
      <div 
        className="p-8 rounded-lg max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: '#E8EBF3' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Bienvenido a <span className="font-bold" style={{ color: '#242852' }}>tcboleitheconomico.com</span>: Tu Fuente Confiable de Información Económica Financiera
        </h2>

        <p className="mb-4 text-gray-700">
          Nuestro compromiso es proporcionarte información confiable, educativa y transparente. Aquí encontrarás herramientas y recursos para ayudarte a tomar decisiones informadas.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mb-2">Nuestros principales valores son:</h3>
        <ul className="list-disc pl-6 mb-4 space-y-1 text-gray-700">
          <li><strong>Educativa:</strong> Brindarte recursos para mejorar tu conocimiento.</li>
          <li><strong>Transparencia:</strong> Datos actualizados y precisos.</li>
          <li><strong>Informativa:</strong> Información para la toma de decisiones inteligentes.</li>
          <li><strong>Anti-especulación:</strong> Promovemos la claridad y la ética en el mercado.</li>
        </ul>

        <p className="mb-4 text-gray-700">
          La información económica financiera presentada en esta página proviene de diversas fuentes confiables, incluyendo periódicos, analistas financieros y otras publicaciones reconocidas. Nuestro objetivo es ofrecer una visión completa y actualizada del mercado para ayudarte a tomar decisiones informadas.
        </p>

        <div className="mb-6 p-4 rounded" style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}>
          <p className="font-semibold" style={{ color: '#242852' }}>Aviso Legal:</p>
          <p style={{ color: '#242852' }}>
            Al continuar, el usuario entiende que nuestro objetivo es ofrecer información confiable, educativa y transparente, y que en ningún momento esta página promueve la especulación o acciones que contravengan las regulaciones gubernamentales.
          </p>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded transition font-medium cursor-pointer bg-[#242852] hover:bg-[#2f346b] text-white"
          >
            Entiendo y Acepto
          </button>
        </div>
      </div>
    </div>
  );
};