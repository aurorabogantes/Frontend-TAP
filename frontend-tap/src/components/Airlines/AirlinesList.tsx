import { useState, useEffect } from 'react';
import type { Airline } from '../../types';
import { getAirlines } from '../../services/api';
import './Airlines.css';

interface AirlinesListProps {
  onSelectAirline: (airline: Airline) => void;
  refreshTrigger?: number;
}

function AirlinesList({ onSelectAirline, refreshTrigger }: AirlinesListProps) {
  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAirlines();
  }, [refreshTrigger]);

  const loadAirlines = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAirlines();
      setAirlines(data);
    } catch (err) {
      setError('Error al cargar las aerolíneas');
      console.error(err);
    } finally {
      setLoading(false);
    }
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
          {airlines.map((airline) => (
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
    </div>
  );
}

export default AirlinesList;
