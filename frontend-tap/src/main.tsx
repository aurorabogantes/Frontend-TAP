/**
 * Punto de entrada principal de la aplicación React.
 * Monta el componente raíz en el DOM usando React 18.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' // Estilos globales de la aplicación
import App from './App.tsx' // Componente raíz de la aplicación

// Crea la raíz de React y renderiza la aplicación dentro del elemento #root del HTML.
// StrictMode activa verificaciones adicionales en modo desarrollo.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
