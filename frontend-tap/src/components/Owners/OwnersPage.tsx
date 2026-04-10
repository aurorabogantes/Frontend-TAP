import { useState, useEffect } from 'react';
import type { Airline, AirplaneWithAirline, Airplane } from '../../types';
import { getAirplanes, getAirlines, updateAirplane } from '../../services/api';
import './Owners.css';

function OwnersPage() {
  const [airplanesWithAirlines, setAirplanesWithAirlines] = useState<AirplaneWithAirline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  
  const [selectedAirplane, setSelectedAirplane] = useState<Airplane | null>(null);
  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState(false);
  const [newAirlineId, setNewAirlineId] = useState<number>(0);
  

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
              {airplanesWithAirlines.map((airplane) => (
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
        </div>
      )}
      
      
      {selectedAirplane && (
        <div className="airplane-edit-form">
          <h3>Editar Propietario del Avión</h3>
          <div className="form-info">
            <p><strong>ID Avión:</strong> {selectedAirplane.id}</p>
            <p><strong>Modelo:</strong> {selectedAirplane.model || '-'}</p>
          </div>

          <div className="form-group">
            <label htmlFor="newAirline">Nueva Aerolínea Propietaria:</label>
            <select
              id="newAirline"
              value={newAirlineId}
              onChange={(e) => setNewAirlineId(parseInt(e.target.value, 10))}
              disabled={editLoading}
            >
              <option value={0}>Seleccione una aerolínea</option>
              {airlines.map((airline) => (
                <option key={airline.id} value={airline.id}>
                  {airline.name}
                </option>
              ))}
            </select>
          </div>

          {editError && <div className="error-message">{editError}</div>}
          {editSuccess && <div className="success-message">Propietario actualizado exitosamente</div>}

          <button 
            className="btn-submit" 
            onClick={handleUpdateAirplane}
            disabled={editLoading}
          >
            {editLoading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
          <button 
            className="btn-cancel" 
            onClick={handleCancelEdit}
            disabled={editLoading}
          >
            Cancelar
          </button>
        </div>
      )}
      
      
      <button className="btn-refresh" onClick={loadData}>
        Actualizar Lista
      </button>
    </div>
  );
}

export default OwnersPage;
