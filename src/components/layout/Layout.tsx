import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import Navbar from './Navbar';
import Footer from './Footer';
import CafeBotWidget from '../chat/CafeBotWidget';
import { ChatProvider } from '../../context/ChatContext';

/** Lleva el scroll al inicio al cambiar de vista. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

/** Estructura global: Navbar + vista activa + Footer + CaféBot flotante. */
export default function Layout() {
  return (
    <ChatProvider>
      <div className="app-shell">
        <ScrollToTop />
        <Navbar />
        <main className="app-main">
          <Outlet />
        </main>
        <Footer />
        <CafeBotWidget />
      </div>
    </ChatProvider>
  );
}
