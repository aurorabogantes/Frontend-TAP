import { useState, useEffect } from 'react';
import type { Airline, AirlineFormData } from '../../types';
import { updateAirline, getAirlineById } from '../../services/api';
import './Airlines.css';

// Props del componente: aerolínea a editar y callbacks para éxito/cancelación
interface AirlineEditProps {
  airline: Airline; // Aerolínea seleccionada desde la lista
  onSuccess: () => void; // Callback cuando se actualiza exitosamente
  onCancel: () => void; // Callback para cancelar la edición
}

/**
 * Componente para editar una aerolínea existente.
 * Carga datos frescos del servidor al montar y permite modificar nombre y teléfono.
 */
function AirlineEdit({ airline, onSuccess, onCancel }: AirlineEditProps) {
  // Estado del formulario con los datos editables
  const [formData, setFormData] = useState<AirlineFormData>({
    name: '',
    phone: '',
  });
  // Estados de UI: carga, error y éxito
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Efecto: carga datos actualizados del servidor cuando cambia la aerolínea seleccionada
  useEffect(() => {
    // Función para obtener datos frescos de la aerolínea por su ID
    const loadAirlineData = async () => {
      try {
        setLoading(true);
        const freshData = await getAirlineById(airline.id);
        setFormData({
          name: freshData.name || '',
          phone: freshData.phone || '',
        });
        setError(null);
        setSuccess(false);
      } catch (err) {
        // Si falla, usar los datos que ya tenemos
        setFormData({
          name: airline.name || '',
          phone: airline.phone || '',
        });
        console.error('Error al cargar datos frescos:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAirlineData();
  }, [airline.id]); // Dependencia: se ejecuta cuando cambia el ID de la aerolínea

  // Manejador genérico de cambios en inputs: actualiza el campo correspondiente en formData
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value, // Actualiza dinámicamente el campo según el atributo "name" del input
    }));
  };

  // Manejador de envío del formulario: valida y envía la actualización al servidor
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Previene recarga de página
    
    // Validación: nombre es obligatorio
    if (!formData.name.trim()) {
      setError('El nombre es requerido');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      await updateAirline(airline.id, formData); // Llama al API para actualizar
      setSuccess(true);
      // Retraso de 1 segundo para mostrar mensaje de éxito antes de cerrar
      setTimeout(() => {
        onSuccess(); // Notifica al padre que la edición fue exitosa
      }, 1000);
    } catch (err) {
      setError('Error al actualizar la aerolínea');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="airline-edit">
      <h3>Editar Aerolínea (ID: {airline.id})</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="edit-name">Nombre:</label>
          <input
            type="text"
            id="edit-name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nombre de la aerolínea"
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="edit-phone">Teléfono:</label>
          <input
            type="text"
            id="edit-phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Teléfono de contacto"
            disabled={loading}
          />
        </div>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Aerolínea actualizada exitosamente</div>}
        
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

export default AirlineEdit;
