import { useState } from 'react';
import type { Airline } from '../../types';
import AirlinesList from './AirlinesList';
import AirlineForm from './AirlineForm';
import AirlineEdit from './AirlineEdit';
import './Airlines.css';

/**
 * Página principal del módulo de Aerolíneas.
 * Coordina la lista, el formulario de creación y el componente de edición.
 * Usa un layout de dos columnas: izquierda (form/edit) y derecha (lista).
 */
function AirlinesPage() {
  // Aerolínea seleccionada para editar (null = modo creación)
  const [selectedAirline, setSelectedAirline] = useState<Airline | null>(null);
  // Trigger numérico para forzar recarga de la lista (incrementa en cada cambio)
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Callback cuando se selecciona una aerolínea desde la lista para editar
  const handleSelectAirline = (airline: Airline) => {
    setSelectedAirline(airline); // Activa modo edición
  };

  // Callback cuando se crea una aerolínea exitosamente
  const handleFormSuccess = () => {
    setRefreshTrigger((prev) => prev + 1); // Fuerza recarga de la lista
  };

  // Callback cuando se edita una aerolínea exitosamente
  const handleEditSuccess = () => {
    setSelectedAirline(null); // Vuelve a modo creación
    setRefreshTrigger((prev) => prev + 1); // Fuerza recarga de la lista
  };

  // Callback para cancelar la edición
  const handleCancelEdit = () => {
    setSelectedAirline(null); // Vuelve a modo creación sin refrescar
  };

  return (
    <div className="airlines-container">
      <h2>Gestión de Aerolíneas</h2>
      
      {/* Layout de dos columnas: izquierda (formulario) y derecha (lista) */}
      <div className="airlines-grid">
        <div className="airlines-left">
          {/* Renderizado condicional: muestra edición si hay aerolínea seleccionada, sino el formulario de creación */}
          {selectedAirline ? (
            <AirlineEdit
              airline={selectedAirline}
              onSuccess={handleEditSuccess}
              onCancel={handleCancelEdit}
            />
          ) : (
            <AirlineForm onSuccess={handleFormSuccess} />
          )}
        </div>
        
        <div className="airlines-right">
          <AirlinesList
            onSelectAirline={handleSelectAirline}
            refreshTrigger={refreshTrigger}
          />
        </div>
      </div>
    </div>
  );
}

export default AirlinesPage;
