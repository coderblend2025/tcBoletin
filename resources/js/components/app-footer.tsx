// Footer.jsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp, faTiktok, faFacebookF, faInstagram } from '@fortawesome/free-brands-svg-icons';

function AppFooter() {
    const colorPrimario = '#1C1C1D';
    const colorTextoClaro = '#E8EBF3';

    return (
        <footer className="w-full py-6" style={{ backgroundColor: colorPrimario, color: colorTextoClaro }}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0 text-center md:text-left">
                    <h4 className="text-lg font-semibold">CONTACTO</h4>
                    <p className="text-sm">Av. Blanco Galindo Km 8.5 Una cuadra al norte</p>
                    <p className="text-sm">Cochabamba, Bolivia</p>
                </div>
                <div className="text-center md:text-right">
                    <p className="text-sm mb-2">Para conocer las últimas actualizaciones síguenos en nuestras redes sociales</p>
                    <div className="flex items-center space-x-4">
                        <a href="#" target="_blank" rel="noopener noreferrer" className="text-lg hover:opacity-80">
                            <FontAwesomeIcon icon={faWhatsapp} />
                        </a>
                        <a href="#" target="_blank" rel="noopener noreferrer" className="text-lg hover:opacity-80">
                            <FontAwesomeIcon icon={faTiktok} />
                        </a>
                        <a href="#" target="_blank" rel="noopener noreferrer" className="text-lg hover:opacity-80">
                            <FontAwesomeIcon icon={faFacebookF} />
                        </a>
                        <a href="#" target="_blank" rel="noopener noreferrer" className="text-lg hover:opacity-80">
                            <FontAwesomeIcon icon={faInstagram} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default AppFooter;