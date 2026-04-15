import { useState, useEffect } from 'react';
import type { Airline } from '../../types';
import { getAirlines, searchAirlines } from '../../services/api';
import './Airlines.css';

// Props del componente: callback para seleccionar aerolínea y trigger para refrescar la lista
interface AirlinesListProps {
  onSelectAirline: (airline: Airline) => void;
  refreshTrigger?: number; // Cambia su valor desde el padre para forzar recarga
}

// Número de aerolíneas mostradas por página
const ITEMS_PER_PAGE = 3;

function AirlinesList({ onSelectAirline, refreshTrigger }: AirlinesListProps) {
  // Estado principal: lista de aerolíneas y estados de carga/error
  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para los filtros de búsqueda
  const [searchName, setSearchName] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [isSearching, setIsSearching] = useState(false); // Indica si hay una búsqueda activa
  
  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1);

  // Cálculos de paginación: total de páginas, índice inicial y aerolíneas de la página actual
  const totalPages = Math.ceil(airlines.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedAirlines = airlines.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Efecto: recarga la lista cuando cambia refreshTrigger (ej. después de crear/editar)
  useEffect(() => {
    loadAirlines();
  }, [refreshTrigger]);

  // Carga todas las aerolíneas desde la API y resetea estados de búsqueda/paginación
  const loadAirlines = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsSearching(false); // Limpia el estado de búsqueda
      setCurrentPage(1); // Vuelve a la primera página
      const data = await getAirlines();
      setAirlines(data);
    } catch (err) {
      setError('Error al cargar las aerolíneas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Busca aerolíneas por nombre y/o teléfono; si ambos están vacíos, recarga todo
  const handleSearch = async () => {
    if (!searchName.trim() && !searchPhone.trim()) {
      loadAirlines(); // Si no hay filtros, muestra todas
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setIsSearching(true); // Activa indicador de búsqueda para mostrar botón "Limpiar"
      setCurrentPage(1); // Reinicia paginación al buscar
      const data = await searchAirlines(
        searchName.trim() || undefined, // undefined si está vacío para no enviar parámetro
        searchPhone.trim() || undefined
      );
      setAirlines(data);
    } catch (err) {
      setError('Error al buscar aerolíneas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Limpia los campos de búsqueda y recarga la lista completa
  const handleClearSearch = () => {
    setSearchName('');
    setSearchPhone('');
    loadAirlines();
  };

  // Estados de carga, error y lista vacía: renderizado condicional temprano
  if (loading) {
    return <div className="loading">Cargando aerolíneas...</div>;
  }

  if (error) {
    return (
      <div className="error">
        {error}
        <button onClick={loadAirlines}>Reintentar</button>
      </div>
    );
  }

  if (airlines.length === 0) {
    return <div className="empty">No hay aerolíneas registradas</div>;
  }

  return (
    <div className="airlines-list">
      <h3>Lista de Aerolíneas</h3>
      
      {/* Sección de búsqueda: inputs con soporte para Enter y botones de acción */}
      <div className="search-section">
        <div className="search-inputs">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()} // Busca al presionar Enter
          />
          <input
            type="text"
            placeholder="Buscar por teléfono..."
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <div className="search-buttons">
          <button onClick={handleSearch} className="btn-search">
            Buscar
          </button>
          {/* Botón "Limpiar" solo visible cuando hay una búsqueda activa */}
          {isSearching && (
            <button onClick={handleClearSearch} className="btn-clear">
              Limpiar
            </button>
          )}
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {/* Itera solo las aerolíneas de la página actual (paginatedAirlines) */}
          {paginatedAirlines.map((airline) => (
            <tr key={airline.id}>
              <td>{airline.id}</td>
              <td>{airline.name || '-'}</td>
              <td>{airline.phone || '-'}</td>
              <td>
                <button 
                  className="btn-edit"
                  onClick={() => onSelectAirline(airline)}
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Controles de paginación: solo se muestran si hay más de una página */}
      {totalPages > 1 && (
        <div className="pagination">
          {/* Ir a primera página */}
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            &laquo;
          </button>
          {/* Página anterior */}
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            &lsaquo;
          </button>
          {/* Indicador de página actual y total de registros */}
          <span className="pagination-info">
            Página {currentPage} de {totalPages} ({airlines.length} registros)
          </span>
          {/* Página siguiente */}
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            &rsaquo;
          </button>
          {/* Ir a última página */}
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            &raquo;
          </button>
        </div>
      )}
    </div>
  );
}

export default AirlinesList;
