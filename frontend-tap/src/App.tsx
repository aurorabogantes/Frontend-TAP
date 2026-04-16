/**
 * Componente principal de la aplicación.
 * Define la estructura de navegación y el layout general usando React Router.
 */
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/Home';
import { AirlinesPage } from './components/Airlines';
import { AirplanesPage } from './components/Airplanes';
import { OwnersPage } from './components/Owners';
import './App.css';

/**
 * App - Componente raíz que configura el enrutamiento y layout.
 * 
 * Estructura:
 * - Navbar: barra de navegación fija en la parte superior
 * - main: contenido dinámico según la ruta activa
 * - footer: pie de página con información del sistema
 * 
 * @returns JSX del layout principal con rutas configuradas
 */
function App() {
  return (
    <Router>
      <div className="app">
        {/* Barra de navegación persistente en todas las páginas */}
        <Navbar />
        
        {/* Contenedor principal donde se renderizan las páginas según la ruta */}
        <main className="main-content">
          <Routes>
            {/* Ruta de inicio */}
            <Route path="/" element={<HomePage />} />
            {/* Módulo de gestión de aerolíneas */}
            <Route path="/airlines" element={<AirlinesPage />} />
            {/* Módulo de gestión de aviones */}
            <Route path="/airplanes" element={<AirplanesPage />} />
            {/* Módulo de propietarios (vista de aviones con sus aerolíneas) */}
            <Route path="/owners" element={<OwnersPage />} />
          </Routes>
        </main>
        
        {/* Pie de página con créditos del proyecto */}
        <footer className="footer">
          <p>© 2026 Sistema de Gestión de Aviones - Tópicos Avanzados de Programación</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
