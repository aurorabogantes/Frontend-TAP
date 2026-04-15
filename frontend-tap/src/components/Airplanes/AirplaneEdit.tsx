import { useState, useEffect } from 'react';
import type { Airplane, Airline, AirplaneFormData } from '../../types';
import { updateAirplane, getAirlines, getAirplaneById } from '../../services/api';
import './Airplanes.css';

interface AirplaneEditProps {
  airplane: Airplane;
  onSuccess: () => void;
  onCancel: () => void;
}

function AirplaneEdit({ airplane, onSuccess, onCancel }: AirplaneEditProps) {
  const [formData, setFormData] = useState<AirplaneFormData>({
    model: airplane.model || '',
    airlineId: airplane.airlineId,
  });
  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Trae datos frescos del avión para evitar editar información desactualizada.
    const loadAirplaneData = async () => {
      try {
        setLoading(true);
        const freshData = await getAirplaneById(airplane.id);
        setFormData({
          model: freshData.model || '',
          airlineId: freshData.airlineId,
        });
        setError(null);
        setSuccess(false);
      } catch (err) {
        setFormData({
          model: airplane.model || '',
          airlineId: airplane.airlineId,
        });
        console.error('Error al cargar datos frescos:', err);
      }
    };

    // Carga las aerolíneas para permitir cambiar el propietario.
    const fetchAirlines = async () => {
      try {
        const data = await getAirlines();
        setAirlines(data);
      } catch (err) {
        setError('Error al cargar las aerolíneas');
      } finally {
        setLoading(false);
      }
    };

    loadAirplaneData();
    fetchAirlines();
  }, [airplane.id]);

  // Sincroniza el formulario con los cambios hechos por el usuario.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'airlineId' ? parseInt(value, 10) : value,
    }));
  };

  // Valida los datos y guarda la edición del avión en la API.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.model.trim()) {
      setError('El modelo es requerido');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      await updateAirplane(airplane.id, formData);
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1000);
    } catch (err) {
      setError('Error al actualizar el avión');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="airplane-edit">
      <h3>Editar Avión</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="model">Modelo:</label>
          <input
            type="text"
            id="model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="airlineId">Aerolínea:</label>
          <select
            id="airlineId"
            name="airlineId"
            value={formData.airlineId}
            onChange={handleChange}
            disabled={loading || airlines.length === 0}
          >
            <option value="">Seleccione una aerolínea</option>
            {airlines.map((airline) => (
              <option key={airline.id} value={airline.id}>
                {airline.name}
              </option>
            ))}
          </select>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Avión actualizado exitosamente</div>}
        
        <div className="button-group">
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
          <button type="button" className="btn-cancel" onClick={onCancel} disabled={loading}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default AirplaneEdit;