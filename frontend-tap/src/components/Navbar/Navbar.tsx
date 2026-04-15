import { NavLink } from 'react-router-dom';
import { FaPlane } from 'react-icons/fa';
import './Navbar.css';

/**
 * Barra de navegación principal del sistema.
 * Contiene el logo/título y los enlaces a cada módulo.
 * Usa NavLink de react-router-dom para resaltar la ruta activa.
 */
function Navbar() {
  return (
    <nav className="navbar">
      {/* Logo y título del sistema */}
      <div className="navbar-brand">
        <h1><FaPlane className="brand-icon" /> Gestión de Aviones</h1>
      </div>
      {/* Lista de enlaces de navegación */}
      <ul className="navbar-nav">
        <li>
          {/* NavLink aplica clase 'active' automáticamente cuando la ruta coincide */}
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Inicio
          </NavLink>
        </li>
        <li>
          <NavLink to="/airlines" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Aerolíneas
          </NavLink>
        </li>
        <li>
          <NavLink to="/airplanes" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Aviones
          </NavLink>
        </li>
        <li>
          <NavLink to="/owners" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Propietarios
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
