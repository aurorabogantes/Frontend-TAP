import { useState } from 'react';
import type { Airplane } from '../../types';
import AirplanesList from './AirplanesList';
import AirplaneForm from './AirplaneForm';
import AirplaneEdit from './AirplaneEdit';
import './Airplanes.css';

function AirplanesPage() {
  const [selectedAirplane, setSelectedAirplane] = useState<Airplane | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSelectAirplane = (airplane: Airplane) => {
    setSelectedAirplane(airplane);
  };

  const handleFormSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleEditSuccess = () => {
    setSelectedAirplane(null);
    setRefreshTrigger((prev) => prev + 1);
  };

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