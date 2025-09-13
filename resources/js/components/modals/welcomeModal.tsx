import React from "react";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-4 p-8 sm:p-10 overflow-y-auto max-h-[90vh] border-t-8 border-[#2AA846]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Título */}
        <h2 className="text-3xl font-bold text-[#0055A4] mb-2 leading-tight">
          Bienvenido a <span className="italic text-[#002B50]">tcboletin.com</span>
        </h2>
        <p className="text-lg text-gray-700 mb-6">
          Tu Fuente Confiable de Información.
        </p>

        {/* Contenido */}
        <div className="space-y-5 text-gray-800 text-base leading-relaxed">
          <p>
            Nuestro compromiso es brindarte información educativa, confiable y transparente sobre las variables que afectan tu economía cotidiana. Aquí encontrarás herramientas y contenidos que te ayudarán a tomar decisiones informadas, especialmente en contextos donde los datos oficiales pueden ser insuficientes o limitados.
          </p>

          <div>
            <h3 className="text-xl font-semibold text-[#0055A4] mb-2">Nuestros principales valores son:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Educativa:</strong> Ofrecemos recursos que fortalecen tu conocimiento económico.
              </li>
              <li>
                <strong>Transparencia:</strong> Presentamos datos claros, verificables y actualizados.
              </li>
              <li>
                <strong>Informativa:</strong> Compartimos contenidos útiles para la toma de decisiones inteligentes.
              </li>
              <li>
                <strong>Anti-especulación:</strong> Promovemos la ética, la objetividad y el acceso abierto a la información.
              </li>
            </ul>
          </div>

          <p>
            Los datos publicados en esta plataforma provienen de fuentes confiables como medios de comunicación reconocidos, analistas financieros, publicaciones especializadas y reportes del mercado. Nuestro objetivo es ofrecerte una visión clara, útil y actualizada de la coyuntura económica.
          </p>

          {/* Aviso Legal */}
          <div className="bg-[#F8FAFC] border-l-4 border-[#0055A4] p-4 rounded-md">
            <p className="font-semibold text-[#002B50] mb-1">Aviso Legal:</p>
            <p className="text-sm text-gray-700">
              Al continuar, el usuario declara entender que esta página tiene un propósito exclusivamente informativo, educativo y transparente. Bajo ningún motivo se promueve la especulación ni se incentivan acciones contrarias a las normativas gubernamentales vigentes.
            </p>
          </div>
        </div>

        {/* Botón */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-[#0055A4] text-white font-medium hover:bg-[#002B50] transition"
          >
            Entiendo y Acepto
          </button>
        </div>
      </div>
    </div>
  );
};
