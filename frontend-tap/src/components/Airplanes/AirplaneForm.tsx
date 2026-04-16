import { useState, useEffect } from 'react';
import type { AirplaneFormData, Airline } from '../../types';
import { createAirplane, getAirlines } from '../../services/api';
import './Airplanes.css';

/**
 * Props del componente AirplaneForm.
 * @property onSuccess - Callback ejecutado después de crear un avión exitosamente
 */
interface AirplaneFormProps {
  onSuccess: () => void;
}

/**
 * Formulario para crear un nuevo avión.
 * Permite ingresar el modelo y seleccionar la aerolínea propietaria.
 * Carga las aerolíneas disponibles al montar el componente.
 * 
 * @param props - Props del componente (onSuccess)
 * @returns JSX del formulario de creación de avión
 */
function AirplaneForm({ onSuccess }: AirplaneFormProps) {
  // Estado del formulario controlado
  const [formData, setFormData] = useState<AirplaneFormData>({
    model: '',
    airlineId: 0,
  });
  // Lista de aerolíneas disponibles para el selector
  const [airlines, setAirlines] = useState<Airline[]>([]);
  // Estados de UI: carga, error y éxito
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Efecto: carga las aerolíneas disponibles al montar el componente
  useEffect(() => {
    /**
     * Obtiene las aerolíneas disponibles para asociar el avión nuevo.
     * Si hay aerolíneas disponibles, preselecciona la primera.
     */
    const fetchAirlines = async () => {
      try {
        const data = await getAirlines();
        setAirlines(data);
        // Preselecciona la primera aerolínea si existe
        if (data.length > 0) {
          setFormData((prev) => ({ ...prev, airlineId: data[0].id }));
        }
      } catch (err) {
        setError('Error al cargar las aerolíneas');
      }
    };
    fetchAirlines();
  }, []);

  // Actualiza el estado del formulario cuando el usuario escribe o cambia la aerolínea.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'airlineId' ? parseInt(value, 10) : value,
    }));
  };

  // Valida y envía el nuevo avión al API.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.model.trim()) {
      setError('El modelo es requerido');
      return;
    }
    if (formData.airlineId === 0) {
      setError('Debe seleccionar una aerolínea');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      await createAirplane(formData);
      setSuccess(true);
      setFormData({ model: '', airlineId: airlines.length > 0 ? airlines[0].id : 0 });
      onSuccess();
    } catch (err) {
      setError('Error al crear el avión');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="airplane-form">
      <h3>Agregar Nuevo Avión</h3>
      <form onSubmit={handleSubmit}>
        {/* Campo de modelo del avión */}
        <div className="form-group">
          <label htmlFor="model">Modelo:</label>
          <input
            type="text"
            id="model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            placeholder="Modelo del avión"
            disabled={loading}
          />
        </div>
        {/* Selector de aerolínea propietaria */}
        <div className="form-group">
          <label htmlFor="airlineId">Aerolínea:</label>
          <select
            id="airlineId"
            name="airlineId"
            value={formData.airlineId}
            onChange={handleChange}
            disabled={loading || airlines.length === 0}
          >
            {airlines.map((airline) => (
              <option key={airline.id} value={airline.id}>
                {airline.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Mensajes de error y éxito */}
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Avión creado exitosamente</div>}
        
        {/* Botón de envío con estado de carga */}
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Agregar Avión'}
        </button>
      </form>
    </div>
  );
}

export default AirplaneForm;