import { BrowserRouter, Route, Routes } from 'react-router';
import Layout from './components/layout/Layout';
import Inicio from './pages/Inicio';
import Nosotros from './pages/Nosotros';
import Servicios from './pages/Servicios';
import Repositorio from './pages/Repositorio';
import Contacto from './pages/Contacto';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Inicio />} />
          <Route path="nosotros" element={<Nosotros />} />
          <Route path="servicios" element={<Servicios />} />
          <Route path="repositorio" element={<Repositorio />} />
          <Route path="contacto" element={<Contacto />} />
          <Route path="*" element={<Inicio />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
