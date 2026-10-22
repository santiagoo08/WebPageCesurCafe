import VideoBackground from '../components/inicio/VideoBackground';
import VideoHero from '../components/inicio/VideoHero';
import HeroCarousel from '../components/inicio/HeroCarousel';
import PurposeSection from '../components/inicio/PurposeSection';
import AboutBanner from '../components/inicio/AboutBanner';
import RepositoryPreview from '../components/inicio/RepositoryPreview';
import ServicesSummary from '../components/inicio/ServicesSummary';
import './Inicio.css';

export default function Inicio() {
  return (
    <div className="inicio-page">
      {/* Video cafe.mp4 + overlay Espresso: fondo fijo de toda la vista */}
      <VideoBackground />
      <VideoHero />
      <HeroCarousel />
      <PurposeSection />
      <AboutBanner />
      <RepositoryPreview />
      <ServicesSummary />
    </div>
  );
}
