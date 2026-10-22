import RepositoryExplorer from '../components/repositorio/RepositoryExplorer';
import './Repositorio.css';

export default function Repositorio() {
  return (
    <>
      <section className="page-hero">
        <div className="grid-container">
          <div className="page-hero__box">
            <span className="eyebrow">Producción científica</span>
            <h1>Repositorio</h1>
            <p>
              Investigaciones, artículos, libros y cartillas rurales producidos por el centro, en un
              solo lugar.
            </p>
          </div>
        </div>
      </section>
      <RepositoryExplorer />
    </>
  );
}
