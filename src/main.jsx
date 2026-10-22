import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// ZURB Foundation primero (XY Grid + utilidades); luego nuestros estilos la sobrescriben.
import 'foundation-sites/dist/css/foundation.min.css';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
