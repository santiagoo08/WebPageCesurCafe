import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// ZURB Foundation primero (XY Grid + utilidades); luego nuestros estilos la sobrescriben.
import 'foundation-sites/dist/css/foundation.min.css'
import './styles/variables.css'
import './index.css'
import './styles/components.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
