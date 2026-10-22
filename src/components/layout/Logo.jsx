/** Identidad CESURCAFÉ: grano de café + logotipo. */
export default function Logo({ variant = 'light', showSubtitle = true }) {
  return (
    <span className={`logo logo--${variant}`}>
      <svg
        className="logo__mark"
        viewBox="0 0 40 40"
        width="40"
        height="40"
        aria-hidden="true"
      >
        <circle cx="20" cy="20" r="20" fill="var(--accent-primary)" />
        <ellipse
          cx="20"
          cy="20"
          rx="8.5"
          ry="12"
          transform="rotate(-28 20 20)"
          fill="var(--bg-dark)"
        />
        <path
          d="M23.2 9.6c-4.2 3.6-2.4 8.2-4.1 11.2-1.4 2.6-3.9 3.6-3.6 8.8"
          transform="rotate(-6 20 20)"
          fill="none"
          stroke="var(--accent-secondary)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
      <span className="logo__text">
        <span className="logo__name">CESURCAFÉ</span>
        {showSubtitle && (
          <span className="logo__subtitle">Universidad Surcolombiana</span>
        )}
      </span>
    </span>
  );
}
