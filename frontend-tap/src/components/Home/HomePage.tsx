import { FaPlaneDeparture, FaUsers } from 'react-icons/fa';
import './Home.css';

/**
 * Página de inicio del sistema.
 * Muestra información general, características principales y enlace a la documentación.
 */
function HomePage() {
  return (
    <div className="home-container">
      {/* Sección hero: título principal y descripción del sistema */}
      <div className="hero-section">
        <h1>Sistema de Gestión de Aviones</h1>
        <p>Administra aerolíneas y aviones de forma fácil y eficiente</p>
      </div>
      
      {/* Grid de tarjetas con las características/módulos del sistema */}
      <div className="features-grid">
        {/* Tarjeta del módulo de Aerolíneas */}
        <div className="feature-card">
          <div className="feature-icon"><FaPlaneDeparture /></div>
          <h3>Aerolíneas</h3>
          <p>Gestiona las aerolíneas registradas en el sistema</p>
          <ul>
            <li>Agregar nuevas aerolíneas</li>
            <li>Ver listado completo</li>
            <li>Editar información</li>
          </ul>
        </div>
        
        {/* Tarjeta del módulo de Propietarios */}
        <div className="feature-card">
          <div className="feature-icon"><FaUsers /></div>
          <h3>Propietarios</h3>
          <p>Visualiza los aviones y sus propietarios actuales</p>
          <ul>
            <li>Listar todos los aviones</li>
            <li>Ver aerolínea asociada</li>
            <li>Información de modelo</li>
          </ul>
        </div>
      </div>
      
      {/* Información del API con enlace a documentación Swagger */}
      <div className="api-info">
        <h3>API Backend</h3>
        <p>
          Este sistema se conecta a la API de Azure: 
          <a 
            href="https://gestiondeavionesapi-grcwcze3ema9bpfc.canadacentral-01.azurewebsites.net/swagger/index.html" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Ver documentación Swagger
          </a>
        </p>
      </div>
    </div>
  );
}

export default HomePage;
