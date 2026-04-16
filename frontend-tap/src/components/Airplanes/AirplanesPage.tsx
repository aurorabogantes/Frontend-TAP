import { useState } from 'react';
import type { Airplane } from '../../types';
import AirplanesList from './AirplanesList';
import AirplaneForm from './AirplaneForm';
import AirplaneEdit from './AirplaneEdit';
import './Airplanes.css';

/**
 * Página principal del módulo de Aviones.
 * Coordina la lista de aviones, el formulario de creación y el componente de edición.
 * Usa un layout de dos columnas: izquierda (form/edit) y derecha (lista).
 * 
 * @returns JSX con el layout de gestión de aviones
 */
function AirplanesPage() {
  // Avión seleccionado para editar (null = modo creación)
  const [selectedAirplane, setSelectedAirplane] = useState<Airplane | null>(null);
  // Trigger numérico para forzar recarga de la lista (incrementa en cada cambio)
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
      
      {/* Layout de dos columnas: izquierda (formulario) y derecha (lista) */}
      <div className="airplanes-grid">
        <div className="airplanes-left">
          {/* Renderizado condicional: muestra edición si hay avión seleccionado, sino el formulario de creación */}
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
          {/* Lista paginada de aviones con opción de editar */}
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