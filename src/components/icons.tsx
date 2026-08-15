import type { ComponentType, CSSProperties, ReactNode } from "react";

export type IconProps = {
  className?: string | undefined;
  style?: CSSProperties | undefined;
};

type SvgProps = IconProps & {
  children: ReactNode;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
};

function Svg({
  className,
  style,
  children,
  fill = "none",
  stroke = "currentColor",
  strokeWidth = 2,
}: SvgProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function HeartIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </Svg>
  );
}

export function BatteryIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="2" y="7" width="16" height="10" rx="2" />
      <line x1="22" y1="11" x2="22" y2="13" />
      <rect x="4.5" y="9.5" width="7" height="5" rx="1" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </Svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </Svg>
  );
}

export function ArrowDownIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="19 12 12 19 5 12" />
    </Svg>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <Svg {...props} fill="currentColor" stroke="none">
      <polygon points="7 4.5 19 12 7 19.5 7 4.5" />
    </Svg>
  );
}

export function InfinityIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4 2 2.67 4 4 6 4a4 4 0 1 0 0-8c-2 0-4 1.33-6 4Z" />
    </Svg>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M20 10c0 4.99-5.54 10.19-7.4 11.8a1 1 0 0 1-1.2 0C9.54 20.19 4 14.99 4 10a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </Svg>
  );
}

export function DotIcon(props: IconProps) {
  return (
    <Svg {...props} fill="currentColor" stroke="none">
      <circle cx="12" cy="12" r="12" />
    </Svg>
  );
}

export function CameraIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z" />
      <circle cx="12" cy="13" r="3" />
    </Svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </Svg>
  );
}

export function MusicIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </Svg>
  );
}

export function GiftIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5" />
    </Svg>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </Svg>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </Svg>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </Svg>
  );
}

export function SleepIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5 6h7L5 13h7" />
      <path d="M15 15l2 3h-2" />
      <path d="M17 3.5l1.5 2.5H17" />
    </Svg>
  );
}

export function SadIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="8" cy="10" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="16" cy="10" r="1.4" fill="currentColor" stroke="none" />
      <path d="M8 14.5c1.5 3 6.5 3 8 0" />
    </Svg>
  );
}

export function PlaneIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
    </Svg>
  );
}

export function CakeIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 21v-8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8" />
      <path d="M4 17.5c1.2 1 2.8 1 4 0s2.8-1 4 0 2.8 1 4 0 2.8-1 4 0" />
      <path d="M8 11V8.5M12 11V8.5M16 11V8.5" />
      <circle cx="8" cy="7.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="7.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="16" cy="7.5" r="1" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function PersonIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </Svg>
  );
}

export function PencilIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </Svg>
  );
}

export function ThoughtIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </Svg>
  );
}

export function CoffeeIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
      <path d="M6 2v2M10 2v2M14 2v2" />
    </Svg>
  );
}

export function BentoIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="3" width="18" height="9" rx="2" />
      <rect x="3" y="15" width="18" height="6" rx="2" />
      <circle cx="9" cy="7.5" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="15" cy="7.5" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="7.5" cy="18" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="12" cy="18" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="16.5" cy="18" r="1.2" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function CakeSliceIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 3 19 21H5Z" />
      <path d="M8.5 15.5h7" />
      <path d="M8.5 18h7" />
      <circle cx="12" cy="3" r="1.4" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function UtensilsIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </Svg>
  );
}

export function NoteIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M15 3v4a1 1 0 0 0 1 1h4" />
      <path d="M18 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9l5 5v11a2 2 0 0 1-2 2Z" />
      <path d="M8 13h8M8 17h5" />
    </Svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </Svg>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </Svg>
  );
}

function EyeDots() {
  return (
    <>
      <circle cx="8.5" cy="10" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="10" r="1.1" fill="currentColor" stroke="none" />
    </>
  );
}

function HeartEyes() {
  return (
    <>
      <path
        d="M8.5 11c-.7-.5-1.3-.7-1.7-.4-.7.4-.8 1.4-.1 2.1.6.7 1.8 1.7 1.8 1.7s1.2-1 1.8-1.7c.7-.7.6-1.7-.1-2.1-.4-.3-1-.1-1.7.4z"
        fill="currentColor"
        stroke="none"
      />
      <path
        d="M15.5 11c-.7-.5-1.3-.7-1.7-.4-.7.4-.8 1.4-.1 2.1.6.7 1.8 1.7 1.8 1.7s1.2-1 1.8-1.7c.7-.7.6-1.7-.1-2.1-.4-.3-1-.1-1.7.4z"
        fill="currentColor"
        stroke="none"
      />
    </>
  );
}

function ClosedEyes() {
  return (
    <>
      <path d="M7.5 10c.7-.6 1.3-.6 2 0" />
      <path d="M14.5 10c.7-.6 1.3-.6 2 0" />
    </>
  );
}

type FaceProps = IconProps & { eyes: ReactNode; mouth: ReactNode };

function Face({ className, style, eyes, mouth }: FaceProps) {
  return (
    <Svg className={className} style={style}>
      <circle cx="12" cy="12" r="10" />
      {eyes}
      {mouth}
    </Svg>
  );
}

export function MoodInLoveIcon(props: IconProps) {
  return <Face {...props} eyes={<HeartEyes />} mouth={<path d="M8.5 14.5c1.5 3 5.5 3 7 0" />} />;
}

export function MoodGreatIcon(props: IconProps) {
  return <Face {...props} eyes={<EyeDots />} mouth={<path d="M8.5 14.5c1.5 3 5.5 3 7 0" />} />;
}

export function MoodOkayIcon(props: IconProps) {
  return (
    <Face {...props} eyes={<EyeDots />} mouth={<path d="M8.5 14.5C10 12.5 14 12.5 15.5 14.5" />} />
  );
}

export function MoodMehIcon(props: IconProps) {
  return <Face {...props} eyes={<EyeDots />} mouth={<path d="M8.5 15.5h7" />} />;
}

export function MoodLowIcon(props: IconProps) {
  return <Face {...props} eyes={<EyeDots />} mouth={<path d="M8.5 14.5c1.5 3 5.5 3 7 0" />} />;
}

export function MoodTiredIcon(props: IconProps) {
  return <Face {...props} eyes={<ClosedEyes />} mouth={<path d="M10.5 16.5h3" />} />;
}

export function SmartphoneIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </Svg>
  );
}

export function BoltIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </Svg>
  );
}

export function GlobeIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </Svg>
  );
}

export function MonitorIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </Svg>
  );
}

export function RotateIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M21 12a9 9 0 1 1-2.64-6.36" />
      <path d="M21 3v6h-6" />
    </Svg>
  );
}

export function WifiIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5 12.55a11 11 0 0 1 14.08 0" />
      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <path d="M12 20h.01" />
    </Svg>
  );
}

export function SignalIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M2 20h.01" />
      <path d="M7 20v-4" />
      <path d="M12 20v-8" />
      <path d="M17 20V8" />
      <path d="M22 20V4" />
    </Svg>
  );
}

export function MicIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="22" />
    </Svg>
  );
}

export function BellIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </Svg>
  );
}

export function VibrateIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m2 8 2 2-2 2 2 2-2 2" />
      <path d="m22 8-2 2 2 2-2 2 2 2" />
      <rect x="8" y="2" width="8" height="20" rx="2" />
    </Svg>
  );
}

export function ClipboardIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11v4M10 13h4" />
    </Svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    </Svg>
  );
}

export function ImageIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </Svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </Svg>
  );
}

export function MessageIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </Svg>
  );
}

export function SendIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4Z" />
    </Svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <polyline points="20 6 9 17 4 12" />
    </Svg>
  );
}

const registry: Record<string, ComponentType<IconProps>> = {
  heart: HeartIcon,
  battery: BatteryIcon,
  "arrow-left": ArrowLeftIcon,
  "arrow-right": ArrowRightIcon,
  "arrow-down": ArrowDownIcon,
  play: PlayIcon,
  infinity: InfinityIcon,
  pin: PinIcon,
  dot: DotIcon,
  camera: CameraIcon,
  mail: MailIcon,
  music: MusicIcon,
  gift: GiftIcon,
  lock: LockIcon,
  moon: MoonIcon,
  sun: SunIcon,
  sleep: SleepIcon,
  sad: SadIcon,
  plane: PlaneIcon,
  cake: CakeIcon,
  person: PersonIcon,
  pencil: PencilIcon,
  thought: ThoughtIcon,
  coffee: CoffeeIcon,
  bento: BentoIcon,
  "cake-slice": CakeSliceIcon,
  utensils: UtensilsIcon,
  note: NoteIcon,
  clock: ClockIcon,
  calendar: CalendarIcon,
  "mood-inlove": MoodInLoveIcon,
  "mood-great": MoodGreatIcon,
  "mood-okay": MoodOkayIcon,
  "mood-meh": MoodMehIcon,
  "mood-low": MoodLowIcon,
  "mood-tired": MoodTiredIcon,
  smartphone: SmartphoneIcon,
  bolt: BoltIcon,
  globe: GlobeIcon,
  monitor: MonitorIcon,
  rotate: RotateIcon,
  wifi: WifiIcon,
  signal: SignalIcon,
  mic: MicIcon,
  bell: BellIcon,
  vibrate: VibrateIcon,
  clipboard: ClipboardIcon,
  shield: ShieldIcon,
  image: ImageIcon,
  phone: PhoneIcon,
  message: MessageIcon,
  send: SendIcon,
  check: CheckIcon,
};

export function Icon({ name, ...props }: { name: string } & IconProps) {
  const C = registry[name] ?? HeartIcon;
  return <C {...props} />;
}
