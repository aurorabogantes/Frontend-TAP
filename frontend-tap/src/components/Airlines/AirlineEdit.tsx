import { useState, useEffect } from 'react';
import type { Airline, AirlineFormData } from '../../types';
import { updateAirline, getAirlineById } from '../../services/api';
import './Airlines.css';

interface AirlineEditProps {
  airline: Airline;
  onSuccess: () => void;
  onCancel: () => void;
}

function AirlineEdit({ airline, onSuccess, onCancel }: AirlineEditProps) {
  const [formData, setFormData] = useState<AirlineFormData>({
    name: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Cargar datos frescos del servidor usando getAirlineById
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
  }, [airline.id]);

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
      await updateAirline(airline.id, formData);
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
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
