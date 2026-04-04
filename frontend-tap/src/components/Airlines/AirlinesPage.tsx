import { useState } from 'react';
import type { Airline } from '../../types';
import AirlinesList from './AirlinesList';
import AirlineForm from './AirlineForm';
import AirlineEdit from './AirlineEdit';
import './Airlines.css';

function AirlinesPage() {
  const [selectedAirline, setSelectedAirline] = useState<Airline | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSelectAirline = (airline: Airline) => {
    setSelectedAirline(airline);
  };

  const handleFormSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleEditSuccess = () => {
    setSelectedAirline(null);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleCancelEdit = () => {
    setSelectedAirline(null);
  };

  return (
    <div className="airlines-container">
      <h2>Gestión de Aerolíneas</h2>
      
      <div className="airlines-grid">
        <div className="airlines-left">
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
