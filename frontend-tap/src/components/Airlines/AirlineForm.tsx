import { useState } from 'react';
import type { AirlineFormData } from '../../types';
import { createAirline } from '../../services/api';
import './Airlines.css';

// Props: callback para notificar al padre cuando se crea exitosamente
interface AirlineFormProps {
  onSuccess: () => void; // Se ejecuta después de crear la aerolínea para refrescar la lista
}

/**
 * Componente de formulario para crear una nueva aerolínea.
 * Contiene campos para nombre y teléfono con validación básica.
 */
function AirlineForm({ onSuccess }: AirlineFormProps) {
  // Estado del formulario controlado
  const [formData, setFormData] = useState<AirlineFormData>({
    name: '',
    phone: '',
  });
  // Estados de UI: indicador de carga, mensajes de error/éxito
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Manejador de cambios: actualiza el campo correspondiente según el atributo "name" del input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejador de envío: valida y crea la aerolínea en el servidor
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Previene recarga de página
    
    // Validación: el nombre es obligatorio
    if (!formData.name.trim()) {
      setError('El nombre es requerido');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      await createAirline(formData); // Llama al API para crear la aerolínea
      setSuccess(true);
      setFormData({ name: '', phone: '' }); // Limpia el formulario después de crear
      onSuccess(); // Notifica al padre para refrescar la lista
    } catch (err) {
      setError('Error al crear la aerolínea');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="airline-form">
      <h3>Agregar Nueva Aerolínea</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nombre:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nombre de la aerolínea"
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Teléfono:</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Teléfono de contacto"
            disabled={loading}
          />
        </div>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Aerolínea creada exitosamente</div>}
        
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Agregar Aerolínea'}
        </button>
      </form>
    </div>
  );
}

export default AirlineForm;
