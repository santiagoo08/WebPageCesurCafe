// Íconos SVG en línea (trazo con currentColor).
import type { ReactNode } from 'react';

export type IconName =
  | 'target'
  | 'compass'
  | 'award'
  | 'lab'
  | 'fermentation'
  | 'training'
  | 'search'
  | 'mail'
  | 'pin'
  | 'send'
  | 'close'
  | 'chat'
  | 'quote';

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

const PATHS: Record<IconName, ReactNode> = {
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2z" />
    </>
  ),
  award: (
    <>
      <circle cx="12" cy="9" r="5.5" />
      <path d="m8.5 13.5-1.5 7 5-2.5 5 2.5-1.5-7" />
    </>
  ),
  lab: (
    <>
      <path d="M9 3h6M10 3v6l-5.2 9.1A2 2 0 0 0 6.5 21h11a2 2 0 0 0 1.7-2.9L14 9V3" />
      <path d="M7.5 15h9" />
    </>
  ),
  fermentation: (
    <>
      <path d="M7 4h10l-1 16H8L7 4z" />
      <circle cx="11" cy="14" r="1.2" />
      <circle cx="13.5" cy="10.5" r="0.9" />
      <circle cx="12" cy="17" r="0.7" />
    </>
  ),
  training: (
    <>
      <path d="m2.5 9 9.5-5 9.5 5-9.5 5-9.5-5z" />
      <path d="M6.5 11.2V16c0 1.5 2.5 3 5.5 3s5.5-1.5 5.5-3v-4.8" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.2-4.2" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-6.5-6.2-6.5-11.2a6.5 6.5 0 1 1 13 0C18.5 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.8" r="2.3" />
    </>
  ),
  send: <path d="M4 12 20 4l-6 16-2.5-6.5L4 12z" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  chat: (
    <path d="M5 18.5V6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v7a2.5 2.5 0 0 1-2.5 2.5H9l-4 2.5z" />
  ),
  quote: (
    <path
      d="M10 7H6.5A2.5 2.5 0 0 0 4 9.5V13h4.5v4H5M20 7h-3.5A2.5 2.5 0 0 0 14 9.5V13h4.5v4H15"
      strokeLinejoin="round"
    />
  ),
};

export default function Icon({ name, size = 24, className }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
