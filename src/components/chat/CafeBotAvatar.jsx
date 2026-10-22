export default function CafeBotAvatar({
  size = 40,
  showStatusDot = true,
  className = '',
}) {
  return (
    <div
      className={`cafebot-avatar ${className}`.trim()}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <div className="cafebot-avatar__icon">
        <svg viewBox="0 0 36 36" width="70%" height="70%">
          <ellipse cx="18" cy="18" rx="14" ry="17" fill="var(--accent-secondary)" />
          <path
            d="M 18,3 C 12,12 24,24 18,33"
            fill="none"
            stroke="var(--bg-dark)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      {showStatusDot && <span className="cafebot-avatar__status-dot" />}
    </div>
  );
}
