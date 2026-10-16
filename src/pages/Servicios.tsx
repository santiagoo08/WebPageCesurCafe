import StackedServices from '../components/servicios/StackedServices';
import Testimonials from '../components/servicios/Testimonials';
import './Servicios.css';

export default function Servicios() {
  return (
    <>
      <section className="page-hero">
        <div className="grid-container">
          <div className="page-hero__box">
            <span className="eyebrow">Lo que hacemos</span>
            <h1>Servicios</h1>
            <p>Capacidades de investigación aplicada para el territorio y sus comunidades.</p>
          </div>
        </div>
      </section>
      <StackedServices />
      <Testimonials />
    </>
  );
}
