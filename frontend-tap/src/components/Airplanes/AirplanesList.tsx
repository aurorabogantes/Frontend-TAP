import { useState, useEffect } from 'react';
import type { Airplane} from '../../types';
import { getAirplanes, getAirlines } from '../../services/api';
import './Airplanes.css';

/**
 * Props del componente AirplanesList.
 * @property onSelectAirplane - Callback ejecutado al seleccionar un avión para editar
 * @property refreshTrigger - Valor numérico que, al cambiar, fuerza la recarga de la lista
 */
interface AirplanesListProps {
  onSelectAirplane: (airplane: Airplane) => void;
  refreshTrigger?: number;
}

/** Cantidad de aviones visibles por página */
const ITEMS_PER_PAGE = 3;

/**
 * Componente que muestra y pagina el listado de aviones.
 * Carga los aviones y aerolíneas desde la API, y muestra el nombre de la aerolínea asociada.
 * 
 * @param props - Props del componente (onSelectAirplane, refreshTrigger)
 * @returns JSX con la lista paginada de aviones
 */
function AirplanesList({ onSelectAirplane, refreshTrigger }: AirplanesListProps) {
  // Estado principal: lista de aviones
  const [airplanes, setAirplanes] = useState<Airplane[]>([]);
  // Mapa de ID de aerolínea -> nombre (para mostrar en la lista)
  const [airlines, setAirlines] = useState<Map<number, string>>(new Map());
  // Estados de UI: carga y error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Estado de paginación
  const [currentPage, setCurrentPage] = useState(1);

  // Calcula qué registros se muestran en la página actual.
  const totalPages = Math.ceil(airplanes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedAirplanes = airplanes.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Recarga el listado cada vez que cambia el indicador de refresco.
  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  // Carga aviones y aerolíneas para mostrar el listado con el nombre asociado.
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      setCurrentPage(1);
      
      const [airplanesData, airlinesData] = await Promise.all([
        getAirplanes(),
        getAirlines(),
      ]);
      
      const airlinesMap = new Map(airlinesData.map(a => [a.id, a.name || 'N/A']));
      
      setAirplanes(airplanesData);
      setAirlines(airlinesMap);

    } catch (err) {
      setError('Error al cargar los datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Estado de loading sin mensaje específico (ya está en UI)
  if (loading) {
    return <div className="loading">Cargando aviones...</div>;
  }

  // Muestra un mensaje con opción de reintentar si hubo error
  if (error) {
    return (
      <div className="error">
        {error}
        <button onClick={loadData}>Reintentar</button>
      </div>
    );
  }

  // Muestra mensaje cuando no hay aviones registrados
  if (airplanes.length === 0) {
    return <div className="empty">No hay aviones registrados</div>;
  }

  return (
    <div className="airplanes-list">
      <h3>Lista de Aviones</h3>
      
      {/* Contenedor de tarjetas de aviones (paginadas) */}
      <div className="list-container">
        {paginatedAirplanes.map((airplane) => (
          <div key={airplane.id} className="list-item">
            {/* Información del avión: modelo y aerolínea */}
            <div className="item-info">
              <strong>Modelo:</strong> {airplane.model || 'N/A'} <br />
              <strong>Aerolínea:</strong> {airlines.get(airplane.airlineId) || 'Desconocida'}
            </div>
            {/* Botón para seleccionar y editar el avión */}
            <div className="item-actions">
              <button className="btn-edit" onClick={() => onSelectAirplane(airplane)}>
                Editar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Controles de paginación (solo si hay más de una página) */}
      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>
            Anterior
          </button>
          <span>Página {currentPage} de {totalPages}</span>
          <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}

export default AirplanesList;