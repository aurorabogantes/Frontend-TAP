import { useState } from 'react';
import type { Airplane } from '../../types';
import AirplanesList from './AirplanesList';
import AirplaneForm from './AirplaneForm';
import AirplaneEdit from './AirplaneEdit';
import './Airplanes.css';

function AirplanesPage() {
  const [selectedAirplane, setSelectedAirplane] = useState<Airplane | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Guarda el avión seleccionado para mostrar el formulario de edición.
  const handleSelectAirplane = (airplane: Airplane) => {
    setSelectedAirplane(airplane);
  };

  // Fuerza la recarga del listado cuando se crea un avión nuevo.
  const handleFormSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // Limpia la selección y refresca la lista después de editar un avión.
  const handleEditSuccess = () => {
    setSelectedAirplane(null);
    setRefreshTrigger((prev) => prev + 1);
  };

  // Cancela la edición y regresa al formulario de registro.
  const handleCancelEdit = () => {
    setSelectedAirplane(null);
  };

  return (
    <div className="airplanes-container">
      <h2>Gestión de Aviones</h2>
      
      <div className="airplanes-grid">
        <div className="airplanes-left">
          {selectedAirplane ? (
            <AirplaneEdit
              airplane={selectedAirplane}
              onSuccess={handleEditSuccess}
              onCancel={handleCancelEdit}
            />
          ) : (
            <AirplaneForm onSuccess={handleFormSuccess} />
          )}
        </div>
        
        <div className="airplanes-right">
          <AirplanesList
            onSelectAirplane={handleSelectAirplane}
            refreshTrigger={refreshTrigger}
          />
        </div>
      </div>
    </div>
  );
}

export default AirplanesPage;