// Jeu d'icônes sobres (style ligne, homogène) pour remplacer les emojis.
// Toutes en stroke currentColor : la couleur vient du parent.

type IconName =
  | "sea"
  | "beach"
  | "home"
  | "plane"
  | "phone"
  | "mail"
  | "pin"
  | "concierge"
  | "car"
  | "calendar"
  | "expand"
  | "wifi"
  | "terrace"
  | "parking"
  | "kitchen"
  | "check"
  | "cube"
  | "navigation";

const PATHS: Record<IconName, React.ReactNode> = {
  sea: (
    <>
      <path d="M2 7c.7.5 1.4 1 2.7 1C7.3 8 7.3 6 10 6s2.6 2 5.3 2C18 8 18 6 20.7 6c1 0 1.6.3 2.3.8" />
      <path d="M2 12c.7.5 1.4 1 2.7 1C7.3 13 7.3 11 10 11s2.6 2 5.3 2C18 13 18 11 20.7 11c1 0 1.6.3 2.3.8" />
      <path d="M2 17c.7.5 1.4 1 2.7 1C7.3 18 7.3 16 10 16s2.6 2 5.3 2C18 18 18 16 20.7 16c1 0 1.6.3 2.3.8" />
    </>
  ),
  beach: (
    <>
      <path d="M3 11a9 9 0 0 1 18 0z" />
      <line x1="12" y1="11" x2="12" y2="21" />
      <path d="M9 21a3 3 0 0 1 6 0" />
    </>
  ),
  home: (
    <>
      <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
    </>
  ),
  plane: (
    <>
      <path d="M21 15.5 13.5 12V5.5a1.5 1.5 0 0 0-3 0V12L3 15.5V17l7.5-2v4L8 20.5V22l4-1 4 1v-1.5L13.5 19v-4L21 17z" />
    </>
  ),
  phone: (
    <>
      <path d="M22 16.9v2.1a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h2.1a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L7.3 9.6a16 16 0 0 0 6 6l1.2-1.1a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z" />
    </>
  ),
  mail: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m3 6 9 7 9-7" />
    </>
  ),
  pin: (
    <>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  concierge: (
    <>
      <path d="M4 18h16" />
      <path d="M5 18a7 7 0 0 1 14 0" />
      <line x1="12" y1="6" x2="12" y2="8" />
      <circle cx="12" cy="4.5" r="1" />
    </>
  ),
  car: (
    <>
      <path d="M3 12.5 5 7.5A2 2 0 0 1 6.9 6h10.2A2 2 0 0 1 19 7.5l2 5" />
      <path d="M3 12.5h18V17a1 1 0 0 1-1 1h-1.2a2 2 0 0 1-3.6 0H8.8a2 2 0 0 1-3.6 0H4a1 1 0 0 1-1-1z" />
      <circle cx="7" cy="16.5" r="1" />
      <circle cx="17" cy="16.5" r="1" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4.5" width="18" height="16.5" rx="2" />
      <line x1="3" y1="9.5" x2="21" y2="9.5" />
      <line x1="8" y1="2.5" x2="8" y2="6" />
      <line x1="16" y1="2.5" x2="16" y2="6" />
    </>
  ),
  expand: (
    <>
      <path d="M15 3h6v6" />
      <path d="M9 21H3v-6" />
      <path d="m21 3-7 7" />
      <path d="M3 21l7-7" />
    </>
  ),
  wifi: (
    <>
      <path d="M2 8.8a15 15 0 0 1 20 0" />
      <path d="M5 12.5a10 10 0 0 1 14 0" />
      <path d="M8.5 16a5 5 0 0 1 7 0" />
      <circle cx="12" cy="19.5" r="0.6" />
    </>
  ),
  terrace: (
    <>
      <path d="M3 21h18" />
      <path d="M5 21V9l7-4 7 4v12" />
      <path d="M9 21v-5h6v5" />
    </>
  ),
  parking: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 17V7h3.5a3 3 0 0 1 0 6H9" />
    </>
  ),
  kitchen: (
    <>
      <path d="M6 2v6a2 2 0 0 0 2 2v12" />
      <path d="M6 2v4M9 2v4" />
      <path d="M18 2a3 3 0 0 0-3 3v6h3" />
      <path d="M18 11v11" />
    </>
  ),
  check: (
    <>
      <path d="m5 12 5 5L20 6" />
    </>
  ),
  cube: (
    <>
      <path d="M12 2 3 7v10l9 5 9-5V7z" />
      <path d="M3 7l9 5 9-5" />
      <path d="M12 12v10" />
    </>
  ),
  navigation: (
    <>
      <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </>
  ),
};

type IconProps = {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
};

export default function Icon({
  name,
  size = 24,
  className,
  strokeWidth = 1.6,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}

export type { IconName };
