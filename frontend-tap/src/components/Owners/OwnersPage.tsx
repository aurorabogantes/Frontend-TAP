import { useState, useEffect } from 'react';
import type { Airline, AirplaneWithAirline, Airplane } from '../../types';
import { getAirplanes, getAirlines, updateAirplane } from '../../services/api';
import { FaEdit, FaPlane, FaBuilding, FaArrowRight, FaExclamationTriangle, FaCheckCircle, FaSave, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './Owners.css';

const ITEMS_PER_PAGE = 5;

function OwnersPage() {
  const [airplanesWithAirlines, setAirplanesWithAirlines] = useState<AirplaneWithAirline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  
  const [selectedAirplane, setSelectedAirplane] = useState<Airplane | null>(null);
  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState(false);
  const [newAirlineId, setNewAirlineId] = useState<number>(0);

  // Cálculos de paginación
  const totalPages = Math.ceil(airplanesWithAirlines.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedAirplanes = airplanesWithAirlines.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch both airplanes and airlines in parallel
      const [airplanes, airlinesData] = await Promise.all([
        getAirplanes(),
        getAirlines(),
      ]);
      
      // Create a map for quick airline lookup
      const airlinesMap = new Map<number, Airline>();
      airlinesData.forEach((airline) => {
        airlinesMap.set(airline.id, airline);
      });
      
      // Combine airplanes with airline names
      const combined: AirplaneWithAirline[] = airplanes.map((airplane) => {
        const airline = airlinesMap.get(airplane.airlineId);
        return {
          ...airplane,
          airlineName: airline?.name || 'Sin aerolínea asignada',
        };
      });
      
      setAirplanesWithAirlines(combined);
      setAirlines(airlinesData);
      setCurrentPage(1);
    } catch (err) {
      setError('Error al cargar los datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  
  const handleSelectAirplane = (airplane: Airplane) => {
    setSelectedAirplane(airplane);
    setNewAirlineId(airplane.airlineId);
    setEditError(null);
    setEditSuccess(false);
  };

  const handleCancelEdit = () => {
    setSelectedAirplane(null);
    setNewAirlineId(0);
    setEditError(null);
    setEditSuccess(false);
  };

  const handleUpdateAirplane = async () => {
    if (!selectedAirplane) return;

    if (newAirlineId === 0) {
      setEditError('Debe seleccionar una aerolínea');
      return;
    }

    try {
      setEditLoading(true);
      setEditError(null);
      setEditSuccess(false);
      
      await updateAirplane(selectedAirplane.id, {
        model: selectedAirplane.model || '',
        airlineId: newAirlineId,
      });

      setEditSuccess(true);
      handleCancelEdit();
      loadData();
    } catch (err) {
      setEditError('Error al actualizar el propietario del avión');
      console.error(err);
    } finally {
      setEditLoading(false);
    }
  };
  

  if (loading) {
    return (
      <div className="owners-container">
        <h2>Propietarios - Listado de Aviones</h2>
        <div className="loading">Cargando aviones...</div>
      </div>
    );
  }

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
      
      <div className="owners-info">
        <p>
          Esta vista muestra todos los aviones registrados junto con la información 
          de su aerolínea actual (propietario).
        </p>
      </div>
      
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
              {paginatedAirplanes.map((airplane) => (
                <tr key={airplane.id}>
                  <td>{airplane.id}</td>
                  <td>{airplane.model || '-'}</td>
                  <td>
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
          
          <div className="summary">
            <p>Total de aviones: <strong>{airplanesWithAirlines.length}</strong></p>
          </div>

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
      
      
      {selectedAirplane && (
        <div className="modal-overlay" onClick={handleCancelEdit}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><FaEdit className="header-icon" /> Cambiar Propietario</h3>
              <button className="modal-close" onClick={handleCancelEdit} disabled={editLoading}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-body">
              {/* Tarjeta del avión */}
              <div className="airplane-card">
                <div className="airplane-icon"><FaPlane /></div>
                <div className="airplane-details">
                  <span className="airplane-model">{selectedAirplane.model || 'Sin modelo'}</span>
                  <span className="airplane-id">ID: {selectedAirplane.id}</span>
                </div>
              </div>

              {/* Sección de transferencia */}
              <div className="transfer-section">
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

              {/* Selector de aerolínea */}
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

            <div className="modal-footer">
              <button 
                className="btn-cancel" 
                onClick={handleCancelEdit}
                disabled={editLoading}
              >
                Cancelar
              </button>
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
      
      
      <button className="btn-refresh" onClick={loadData}>
        Actualizar Lista
      </button>
    </div>
  );
}

export default OwnersPage;
