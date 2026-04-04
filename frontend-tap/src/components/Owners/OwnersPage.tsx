import { useState, useEffect } from 'react';
import type { Airline, AirplaneWithAirline } from '../../types';
import { getAirplanes, getAirlines } from '../../services/api';
import './Owners.css';

function OwnersPage() {
  const [airplanesWithAirlines, setAirplanesWithAirlines] = useState<AirplaneWithAirline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch both airplanes and airlines in parallel
      const [airplanes, airlines] = await Promise.all([
        getAirplanes(),
        getAirlines(),
      ]);
      
      // Create a map for quick airline lookup
      const airlinesMap = new Map<number, Airline>();
      airlines.forEach((airline) => {
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
    } catch (err) {
      setError('Error al cargar los datos');
      console.error(err);
    } finally {
      setLoading(false);
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
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="summary">
            <p>Total de aviones: <strong>{airplanesWithAirlines.length}</strong></p>
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
