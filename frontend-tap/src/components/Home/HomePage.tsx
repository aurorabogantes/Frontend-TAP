import './Home.css';

function HomePage() {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Sistema de Gestión de Aviones</h1>
        <p>Administra aerolíneas y aviones de forma fácil y eficiente</p>
      </div>
      
      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">🛫</div>
          <h3>Aerolíneas</h3>
          <p>Gestiona las aerolíneas registradas en el sistema</p>
          <ul>
            <li>Agregar nuevas aerolíneas</li>
            <li>Ver listado completo</li>
            <li>Editar información</li>
          </ul>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">👥</div>
          <h3>Propietarios</h3>
          <p>Visualiza los aviones y sus propietarios actuales</p>
          <ul>
            <li>Listar todos los aviones</li>
            <li>Ver aerolínea asociada</li>
            <li>Información de modelo</li>
          </ul>
        </div>
      </div>
      
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
