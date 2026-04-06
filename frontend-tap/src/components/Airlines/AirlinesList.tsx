import { useState, useEffect } from 'react';
import type { Airline } from '../../types';
import { getAirlines, searchAirlines } from '../../services/api';
import './Airlines.css';

interface AirlinesListProps {
  onSelectAirline: (airline: Airline) => void;
  refreshTrigger?: number;
}

const ITEMS_PER_PAGE = 3;

function AirlinesList({ onSelectAirline, refreshTrigger }: AirlinesListProps) {
  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchName, setSearchName] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Cálculos de paginación
  const totalPages = Math.ceil(airlines.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedAirlines = airlines.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    loadAirlines();
  }, [refreshTrigger]);

  const loadAirlines = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsSearching(false);
      setCurrentPage(1);
      const data = await getAirlines();
      setAirlines(data);
    } catch (err) {
      setError('Error al cargar las aerolíneas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchName.trim() && !searchPhone.trim()) {
      loadAirlines();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setIsSearching(true);
      setCurrentPage(1);
      const data = await searchAirlines(
        searchName.trim() || undefined,
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

  const handleClearSearch = () => {
    setSearchName('');
    setSearchPhone('');
    loadAirlines();
  };

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
      
      <div className="search-section">
        <div className="search-inputs">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            &laquo;
          </button>
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            &lsaquo;
          </button>
          <span className="pagination-info">
            Página {currentPage} de {totalPages} ({airlines.length} registros)
          </span>
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            &rsaquo;
          </button>
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
