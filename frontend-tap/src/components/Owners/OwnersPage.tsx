import { useState, useEffect } from 'react';
import type { Airline, AirplaneWithAirline, Airplane } from '../../types';
import { getAirplanes, getAirlines, updateAirplane } from '../../services/api';
import { FaEdit, FaPlane, FaBuilding, FaArrowRight, FaExclamationTriangle, FaCheckCircle, FaSave, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './Owners.css';

// Número de aviones por página en la tabla
const ITEMS_PER_PAGE = 5;

/**
 * Página de Propietarios: muestra listado de aviones con su aerolínea (propietario)
 * y permite cambiar el propietario mediante un modal de edición.
 */
function OwnersPage() {
  // Lista combinada de aviones con el nombre de su aerolínea
  const [airplanesWithAirlines, setAirplanesWithAirlines] = useState<AirplaneWithAirline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Estados para el modal de edición de propietario
  const [selectedAirplane, setSelectedAirplane] = useState<Airplane | null>(null); // Avión seleccionado para editar
  const [airlines, setAirlines] = useState<Airline[]>([]); // Lista de aerolíneas para el selector
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState(false);
  const [newAirlineId, setNewAirlineId] = useState<number>(0); // ID de la nueva aerolínea seleccionada

  // Cálculos de paginación
  const totalPages = Math.ceil(airplanesWithAirlines.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedAirplanes = airplanesWithAirlines.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  
  // Efecto: carga datos al montar el componente
  useEffect(() => {
    loadData();
  }, []);

  /**
   * Carga aviones y aerolíneas en paralelo, luego combina los datos
   * para mostrar el nombre de la aerolínea junto a cada avión.
   */
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch paralelo de aviones y aerolíneas para mejor rendimiento
      const [airplanes, airlinesData] = await Promise.all([
        getAirplanes(),
        getAirlines(),
      ]);
      
      // Mapa para búsqueda rápida de aerolínea por ID (O(1) en lugar de O(n))
      const airlinesMap = new Map<number, Airline>();
      airlinesData.forEach((airline) => {
        airlinesMap.set(airline.id, airline);
      });
      
      // Combina cada avión con el nombre de su aerolínea propietaria
      const combined: AirplaneWithAirline[] = airplanes.map((airplane) => {
        const airline = airlinesMap.get(airplane.airlineId);
        return {
          ...airplane,
          airlineName: airline?.name || 'Sin aerolínea asignada', // Fallback si no tiene aerolínea
        };
      });
      
      setAirplanesWithAirlines(combined);
      setAirlines(airlinesData);
      setCurrentPage(1); // Reinicia paginación al recargar
    } catch (err) {
      setError('Error al cargar los datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Abre el modal de edición con el avión seleccionado
  const handleSelectAirplane = (airplane: Airplane) => {
    setSelectedAirplane(airplane);
    setNewAirlineId(airplane.airlineId); // Preselecciona la aerolínea actual
    setEditError(null);
    setEditSuccess(false);
  };

  // Cierra el modal y resetea estados de edición
  const handleCancelEdit = () => {
    setSelectedAirplane(null);
    setNewAirlineId(0);
    setEditError(null);
    setEditSuccess(false);
  };

  /**
   * Actualiza el propietario del avión seleccionado.
   * Valida que se haya seleccionado una aerolínea diferente.
   */
  const handleUpdateAirplane = async () => {
    if (!selectedAirplane) return;

    // Validación: debe seleccionar una aerolínea
    if (newAirlineId === 0) {
      setEditError('Debe seleccionar una aerolínea');
      return;
    }

    try {
      setEditLoading(true);
      setEditError(null);
      setEditSuccess(false);
      
      // Llama al API para actualizar solo el airlineId del avión
      await updateAirplane(selectedAirplane.id, {
        model: selectedAirplane.model || '',
        airlineId: newAirlineId, // Nuevo propietario
      });

      setEditSuccess(true);
      handleCancelEdit(); // Cierra el modal
      loadData(); // Recarga la lista para reflejar el cambio
    } catch (err) {
      setEditError('Error al actualizar el propietario del avión');
      console.error(err);
    } finally {
      setEditLoading(false);
    }
  };
  
  // Renderizado de estado de carga
  if (loading) {
    return (
      <div className="owners-container">
        <h2>Propietarios - Listado de Aviones</h2>
        <div className="loading">Cargando aviones...</div>
      </div>
    );
  }

  // Renderizado de estado de error con opción de reintentar
  if (error) {
    return (
      <div className="owners-container">
        <h2>Propietarios - Listado de Aviones</h2>
        <div className="error">
          {error}
          <button onClick={loadData}>Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="owners-container">
      <h2>Propietarios - Listado de Aviones</h2>
      
      {/* Información descriptiva de la página */}
      <div className="owners-info">
        <p>
          Esta vista muestra todos los aviones registrados junto con la información 
          de su aerolínea actual (propietario).
        </p>
      </div>
      
      {/* Renderizado condicional: lista vacía o tabla con datos */}
      {airplanesWithAirlines.length === 0 ? (
        <div className="empty">No hay aviones registrados</div>
      ) : (
        <div className="airplanes-list">
          <table>
            <thead>
              <tr>
                <th>ID Avión</th>
                <th>Modelo</th>
                <th>Aerolínea Actual (Propietario)</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {/* Itera solo los aviones de la página actual */}
              {paginatedAirplanes.map((airplane) => (
                <tr key={airplane.id}>
                  <td>{airplane.id}</td>
                  <td>{airplane.model || '-'}</td>
                  <td>
                  {/* Badge con estilo condicional: verde si tiene aerolínea, gris si no */}
                    <span className={airplane.airlineId ? 'airline-badge' : 'airline-badge no-airline'}>
                      {airplane.airlineName}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn-edit"
                      onClick={() => handleSelectAirplane(airplane)}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Resumen con total de aviones */}
          <div className="summary">
            <p>Total de aviones: <strong>{airplanesWithAirlines.length}</strong></p>
          </div>

          {/* Controles de paginación: solo visibles si hay más de una página */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className="pagination-btn"
                onClick={() => setCurrentPage(p => p - 1)} 
                disabled={currentPage === 1}
              >
                <FaChevronLeft /> Anterior
              </button>
              <div className="pagination-info">
                <span>Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong></span>
              </div>
              <button 
                className="pagination-btn"
                onClick={() => setCurrentPage(p => p + 1)} 
                disabled={currentPage === totalPages}
              >
                Siguiente <FaChevronRight />
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* ========== MODAL DE EDICIÓN DE PROPIETARIO ========== */}
      {/* Se muestra cuando hay un avión seleccionado. Click en overlay cierra el modal. */}
      {selectedAirplane && (
        <div className="modal-overlay" onClick={handleCancelEdit}>
          {/* stopPropagation evita que clicks dentro del modal lo cierren */}
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><FaEdit className="header-icon" /> Cambiar Propietario</h3>
              <button className="modal-close" onClick={handleCancelEdit} disabled={editLoading}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-body">
              {/* Tarjeta visual del avión seleccionado */}
              <div className="airplane-card">
                <div className="airplane-icon"><FaPlane /></div>
                <div className="airplane-details">
                  <span className="airplane-model">{selectedAirplane.model || 'Sin modelo'}</span>
                  <span className="airplane-id">ID: {selectedAirplane.id}</span>
                </div>
              </div>

              {/* Visualización de la transferencia: aerolínea actual -> nueva */}
              <div className="transfer-section">
                {/* Aerolínea actual (origen) */}
                <div className="transfer-from">
                  <span className="transfer-label">Propietario actual</span>
                  <div className="airline-card current">
                    <span className="airline-icon"><FaBuilding /></span>
                    <span className="airline-name">
                      {airlines.find(a => a.id === selectedAirplane.airlineId)?.name || 'Sin aerolínea'}
                    </span>
                  </div>
                </div>
                
                <div className="transfer-arrow"><FaArrowRight /></div>
                
                {/* Nueva aerolínea (destino) - cambia estilo cuando se selecciona una diferente */}
                <div className="transfer-to">
                  <span className="transfer-label">Nuevo propietario</span>
                  <div className={`airline-card new ${newAirlineId && newAirlineId !== selectedAirplane.airlineId ? 'selected' : ''}`}>
                    <span className="airline-icon"><FaBuilding /></span>
                    <span className="airline-name">
                      {newAirlineId ? (airlines.find(a => a.id === newAirlineId)?.name || 'Seleccione...') : 'Seleccione...'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dropdown para seleccionar nueva aerolínea */}
              <div className="form-group">
                <label htmlFor="newAirline">Seleccionar nueva aerolínea:</label>
                <select
                  id="newAirline"
                  value={newAirlineId}
                  onChange={(e) => setNewAirlineId(parseInt(e.target.value, 10))}
                  disabled={editLoading}
                  className="airline-select"
                >
                  <option value={0}>-- Seleccione una aerolínea --</option>
                  {/* Lista de aerolíneas disponibles, deshabilitando la actual */}
                  {airlines.map((airline) => (
                    <option 
                      key={airline.id} 
                      value={airline.id}
                      disabled={airline.id === selectedAirplane.airlineId}
                    >
                      {airline.name} {airline.id === selectedAirplane.airlineId ? '(actual)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mensajes de estado */}
              {editError && (
                <div className="message error-message">
                  <span className="message-icon"><FaExclamationTriangle /></span>
                  {editError}
                </div>
              )}
              {editSuccess && (
                <div className="message success-message">
                  <span className="message-icon"><FaCheckCircle /></span>
                  Propietario actualizado exitosamente
                </div>
              )}
            </div>

            {/* Footer del modal con botones de acción */}
            <div className="modal-footer">
              <button 
                className="btn-cancel" 
                onClick={handleCancelEdit}
                disabled={editLoading}
              >
                Cancelar
              </button>
              {/* Botón guardar: deshabilitado si está cargando, no hay selección, o es igual a la actual */}
              <button 
                className="btn-submit" 
                onClick={handleUpdateAirplane}
                disabled={editLoading || newAirlineId === 0 || newAirlineId === selectedAirplane.airlineId}
              >
                {editLoading ? (
                  <><span className="spinner"></span> Guardando...</>
                ) : (
                  <><FaSave /> Guardar Cambios</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Botón para recargar manualmente la lista */}
      <button className="btn-refresh" onClick={loadData}>
        Actualizar Lista
      </button>
    </div>
  );
}

export default OwnersPage;
