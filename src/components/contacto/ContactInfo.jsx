import { CONTACT_INFO } from '../../data/institutional';
import Icon from '../common/Icon';

export default function ContactInfo() {
  return (
    <div className="contact-info-panel">
      <span className="eyebrow">Contacto institucional</span>
      <h3 className="contact-info-panel__title">Información de sede</h3>
      <div className="contact-info-list">
        <div className="contact-info-item">
          <span className="contact-info-item__icon">
            <Icon name="mail" size={20} />
          </span>
          <div className="contact-info-item__text">
            <span className="contact-info-item__label">Correo institucional</span>
            <a href={`mailto:${CONTACT_INFO.email}`} className="contact-info-item__val">
              {CONTACT_INFO.email}
            </a>
          </div>
        </div>

        <div className="contact-info-item">
          <span className="contact-info-item__icon">
            <Icon name="pin" size={20} />
          </span>
          <div className="contact-info-item__text">
            <span className="contact-info-item__label">Ubicación</span>
            <span className="contact-info-item__val">
              {CONTACT_INFO.location} ({CONTACT_INFO.institution})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
