import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/Home';
import { AirlinesPage } from './components/Airlines';
import { OwnersPage } from './components/Owners';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/airlines" element={<AirlinesPage />} />
            <Route path="/owners" element={<OwnersPage />} />
          </Routes>
        </main>
        <footer className="footer">
          <p>© 2026 Sistema de Gestión de Aviones - Tópicos Avanzados de Programación</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
