import { useState } from 'react';
import type { AirlineFormData } from '../../types';
import { createAirline } from '../../services/api';
import './Airlines.css';

interface AirlineFormProps {
  onSuccess: () => void;
}

function AirlineForm({ onSuccess }: AirlineFormProps) {
  const [formData, setFormData] = useState<AirlineFormData>({
    name: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('El nombre es requerido');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      await createAirline(formData);
      setSuccess(true);
      setFormData({ name: '', phone: '' });
      onSuccess();
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
