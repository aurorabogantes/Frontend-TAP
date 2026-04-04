import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>✈️ Gestión de Aviones</h1>
      </div>
      <ul className="navbar-nav">
        <li>
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
          <NavLink to="/owners" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Propietarios
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
