import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Card, SectionLabel } from "@/components/phone";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  CakeIcon,
  CameraIcon,
  CheckIcon,
  DotIcon,
  GiftIcon,
  HeartIcon,
  Icon,
  ImageIcon,
  LockIcon,
  MailIcon,
  MoonIcon,
  MusicIcon,
  PinIcon,
  PlaneIcon,
  PlayIcon,
  SadIcon,
  SendIcon,
  SleepIcon,
  SunIcon,
} from "@/components/icons";
import { mySnaps, sendMessage, sendMissYou, sendSnap } from "@/lib/db";
import { publicUrl } from "@/lib/supabase";
import { albumArt, PHONE_MODEL, PHONE_SPECS, type Person, type PersonSlug } from "@/lib/world";
import {
  useDeviceCapabilities,
  type CapabilityState,
  type DeviceCapability,
} from "@/hooks/use-device-capabilities";

type Props = { p: Person; viewer: PersonSlug };

const APP_GRADIENTS: Record<string, string> = {
  photos: "from-orange-400 via-rose-500 to-pink-600",
  snap: "from-amber-400 to-orange-600",
  messages: "from-emerald-400 to-teal-600",
  location: "from-sky-400 to-indigo-600",
  food: "from-rose-400 to-red-600",
  missyou: "from-pink-400 to-rose-600",
  music: "from-red-500 to-rose-600",
  mood: "from-amber-400 to-orange-500",
  diary: "from-purple-400 to-indigo-600",
  surprises: "from-fuchsia-400 to-purple-600",
  activity: "from-slate-400 to-slate-700",
  sleep: "from-indigo-500 to-blue-700",
  calendar: "from-emerald-400 to-green-600",
  device: "from-cyan-400 to-sky-600",
  camera: "from-stone-500 to-neutral-700",
  herday: "from-rose-400 to-rose-700",
};

export function AppIcon({
  slug,
  icon,
  size = "h-14 w-14",
}: {
  slug: string;
  icon: string;
  size?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-[1.15rem] bg-gradient-to-br shadow-soft ${size} ${
        APP_GRADIENTS[slug] ?? "from-primary to-chart-4"
      }`}
    >
      <Icon name={icon} className="h-[55%] w-[55%] text-white drop-shadow-sm" />
    </div>
  );
}

export function PhotosApp({ p }: Props) {
  return (
    <div className="space-y-6 px-5 pb-10">
      {p.photos.map((group) => (
        <div key={group.day}>
          <SectionLabel>{group.day}</SectionLabel>
          <div className="grid grid-cols-3 gap-2">
            {group.items.map((item, i) => (
              <figure key={i} className="overflow-hidden rounded-xl bg-secondary">
                <img
                  src={item.src}
                  alt={item.caption}
                  loading="lazy"
                  width={768}
                  height={768}
                  className="aspect-square w-full object-cover transition hover:scale-105"
                />
              </figure>
            ))}
          </div>
        </div>
      ))}
      <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
        <HeartIcon className="h-3.5 w-3.5 text-primary" /> Shared only between us
      </p>
    </div>
  );
}

export function SnapApp({ p }: Props) {
  return (
    <div className="px-5 pb-10 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-primary">New snap</p>
      <h2 className="mt-2 flex items-center justify-center gap-2 font-display text-2xl tracking-tight">
        From {p.name} <HeartIcon className="h-5 w-5 text-primary" />
      </h2>
      <div className="mt-5 overflow-hidden rounded-3xl border border-primary/25 shadow-phone">
        <img
          src={p.snap.image}
          alt={p.snap.caption}
          width={768}
          height={1024}
          className="w-full object-cover"
        />
      </div>
      <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {p.snap.time}
      </p>
      <p className="mt-2 font-display text-lg">&ldquo;{p.snap.caption}&rdquo;</p>
      <Link
        to="/phone/$person/$app"
        params={{ person: p.slug, app: "camera" }}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary-foreground shadow-soft transition hover:-translate-y-0.5"
      >
        <CameraIcon className="h-4 w-4" /> Snap back
      </Link>
    </div>
  );
}

export function MessagesApp({ p, viewer }: Props) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSend() {
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      await sendMessage(viewer, p.slug, text.trim());
      setText("");
      setOpen(false);
      setSent(true);
    } catch {
      /* keep composer open so they can retry */
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-3 px-5 pb-10">
      <SectionLabel>
        <span className="inline-flex items-center gap-1.5">
          <MailIcon className="h-3.5 w-3.5" /> From {p.name}
        </span>
      </SectionLabel>
      {p.messages.map((m, i) => (
        <Card key={i}>
          <p className="font-display text-lg leading-snug">&ldquo;{m.text}&rdquo;</p>
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>{m.time}</span>
            <HeartIcon className="h-3.5 w-3.5 text-primary" />
          </div>
        </Card>
      ))}

      {open ? (
        <Card>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Write to ${p.name}…`}
            rows={3}
            autoFocus
            className="w-full resize-none rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <div className="mt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full px-4 py-2 text-sm text-muted-foreground"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void onSend()}
              disabled={sending || !text.trim()}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft disabled:opacity-50"
            >
              {sending ? "Sending…" : "Send"}
              <SendIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        </Card>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-primary/40 py-3 text-sm text-primary"
        >
          {sent ? (
            <>
              Sent <CheckIcon className="h-4 w-4" />
            </>
          ) : (
            <>
              Write a reply <ArrowRightIcon className="h-4 w-4" />
            </>
          )}
        </button>
      )}
    </div>
  );
}

export function LocationApp({ p }: Props) {
  return (
    <div className="px-5 pb-10 text-center">
      <h2 className="font-display text-2xl tracking-tight">{p.name} is here</h2>
      <div className="mt-5 flex h-56 flex-col items-center justify-center rounded-3xl bg-accent shadow-soft">
        <PinIcon className="animate-heartbeat h-9 w-9 text-primary" />
        <p className="mt-3 font-display text-xl tracking-tight">{p.location.city}</p>
        <p className="text-sm text-muted-foreground">{p.location.place}</p>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">Updated {p.location.updated}</p>
      <p className="mt-2 flex items-center justify-center gap-1.5 text-xs uppercase tracking-[0.2em] text-primary">
        <DotIcon
          className={`h-2 w-2 ${p.location.sharing ? "text-green-500" : "text-muted-foreground/40"}`}
        />
        {p.location.sharing ? "Location sharing on" : "Location sharing off"}
      </p>
    </div>
  );
}

export function FoodApp({ p }: Props) {
  return (
    <div className="space-y-4 px-5 pb-10">
      {p.meals.map((m) => (
        <Card key={m.key}>
          <SectionLabel>
            <span className="inline-flex items-center gap-1.5">
              <Icon name={m.icon} className="h-3.5 w-3.5" /> {m.label}
            </span>
          </SectionLabel>
          {m.item ? (
            <>
              <p className="font-display text-xl tracking-tight">{m.item}</p>
              <p className="text-sm text-muted-foreground">{m.time}</p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Not updated yet</p>
          )}
        </Card>
      ))}
    </div>
  );
}

export function MissYouApp({ p, viewer }: Props) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function onMiss() {
    if (sending) return;
    setSending(true);
    try {
      await sendMissYou(viewer, p.slug);
      setSent(true);
    } catch {
      /* keep button available so they can retry */
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="px-5 pb-12 text-center">
      <HeartIcon className="animate-heartbeat mx-auto h-11 w-11 text-primary" />
      <h2 className="mt-6 text-xs uppercase tracking-[0.3em] text-muted-foreground">
        {p.name} missed you
      </h2>
      <p className="mt-4 font-display text-7xl leading-none text-gradient-love">
        {p.missYou.count}
      </p>
      <p className="mt-2 text-sm uppercase tracking-[0.3em] text-muted-foreground">times today</p>
      <p className="mt-8 text-sm text-muted-foreground">Last missed you {p.missYou.last}</p>
      <p className="mt-3 font-display text-xl">&ldquo;{p.missYou.note}&rdquo;</p>
      <button
        type="button"
        onClick={() => void onMiss()}
        disabled={sending || sent}
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary-foreground shadow-soft transition hover:-translate-y-0.5 disabled:opacity-60"
      >
        {sent ? (
          <>
            Missed them <CheckIcon className="h-4 w-4" />
          </>
        ) : (
          <>
            <HeartIcon className="h-4 w-4" /> I miss them too
          </>
        )}
      </button>
      <SadIcon className="mx-auto mt-6 h-9 w-9 text-muted-foreground" />
    </div>
  );
}

export function MusicApp({ p }: Props) {
  return (
    <div className="px-5 pb-10 text-center">
      <p className="flex items-center justify-center gap-1.5 text-xs uppercase tracking-[0.3em] text-primary">
        <MusicIcon className="h-3.5 w-3.5" /> Now playing
      </p>
      <img
        src={albumArt}
        alt="Album art"
        loading="lazy"
        width={768}
        height={768}
        className="mx-auto mt-5 w-44 rounded-3xl shadow-phone"
      />
      <h2 className="mt-5 font-display text-2xl tracking-tight">{p.music.song}</h2>
      <p className="text-sm text-muted-foreground">{p.music.artist}</p>
      <div className="mx-auto mt-6 h-1.5 w-56 rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${p.music.progress}%` }}
        />
      </div>
      <button
        type="button"
        aria-label="Play"
        className="mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-soft"
      >
        <PlayIcon className="h-6 w-6" />
      </button>
      <p className="mt-6 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
        <HeartIcon className="h-3.5 w-3.5 text-primary" /> &ldquo;{p.music.note}&rdquo;
      </p>
    </div>
  );
}

export function MoodApp({ p }: Props) {
  return (
    <div className="px-5 pb-12 text-center">
      <h2 className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
        How is {p.name}?
      </h2>
      <Icon name={p.mood.icon} className="mx-auto mt-8 h-16 w-16 text-primary" />
      <p className="mt-5 font-display text-3xl tracking-tight text-gradient-love">
        {p.mood.label}
      </p>
      <p className="mt-5 font-display text-lg">&ldquo;{p.mood.note}&rdquo;</p>
      <p className="mt-6 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Updated {p.mood.updated}
      </p>
    </div>
  );
}

export function DiaryApp({ p }: Props) {
  return (
    <div className="px-5 pb-12 text-center">
      <p className="font-display text-2xl tracking-tight">{p.diary.date}</p>
      <div className="mt-6 rounded-3xl border border-border/70 bg-card p-6 text-left shadow-soft">
        <p className="font-display text-lg leading-relaxed">&ldquo;{p.diary.text}&rdquo;</p>
        <HeartIcon className="mx-auto mt-6 h-5 w-5 text-primary" />
        <p className="mt-2 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {p.diary.time}
        </p>
      </div>
    </div>
  );
}

export function SurprisesApp({ p }: Props) {
  return (
    <div className="space-y-4 px-5 pb-10">
      <SectionLabel>
        <span className="inline-flex items-center gap-1.5">
          <GiftIcon className="h-3.5 w-3.5" /> From {p.name}
        </span>
      </SectionLabel>
      {p.surprises.map((s) => (
        <Card key={s.title} className={s.locked ? "opacity-90" : ""}>
          <p className="flex items-center gap-2 font-display text-lg tracking-tight">
            {s.locked ? (
              <LockIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
            ) : (
              <GiftIcon className="h-4 w-4 shrink-0 text-primary" />
            )}
            {s.title}
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">{s.sub}</p>
        </Card>
      ))}
    </div>
  );
}

export function ActivityApp({ p }: Props) {
  return (
    <div className="space-y-4 px-5 pb-10">
      {p.activity.map((a, i) => (
        <div key={i} className="flex items-start gap-4">
          <Icon name={a.icon} className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
          <div>
            <p className="text-sm font-semibold">{a.text}</p>
            <p className="text-xs text-muted-foreground">{a.ago}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SleepApp({ p }: Props) {
  return (
    <div className="px-5 pb-12 text-center">
      <p className="flex items-center justify-center gap-1.5 text-xs uppercase tracking-[0.3em] text-muted-foreground">
        <MoonIcon className="h-3.5 w-3.5" /> Last night
      </p>
      <div className="mt-8 space-y-2">
        <p className="flex items-center justify-center gap-2 font-display text-2xl tracking-tight">
          <SleepIcon className="h-5 w-5 text-muted-foreground" /> {p.sleep.asleep}
        </p>
        <p className="text-muted-foreground">
          <ArrowDownIcon className="mx-auto h-4 w-4" />
        </p>
        <p className="flex items-center justify-center gap-2 font-display text-2xl tracking-tight">
          <SunIcon className="h-5 w-5 text-muted-foreground" /> {p.sleep.awake}
        </p>
      </div>
      <p className="mt-8 font-display text-4xl text-gradient-love">{p.sleep.duration}</p>
      <p className="mt-6 font-display text-lg">&ldquo;{p.sleep.note}&rdquo;</p>
    </div>
  );
}

export function CalendarApp({ p }: Props) {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  return (
    <div className="px-5 pb-10">
      <p className="text-center font-display text-xl tracking-tight">August 2026</p>
      <div className="mt-5 grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={i} className="py-1 uppercase tracking-[0.1em]">
            {d}
          </span>
        ))}
        <span />
        <span />
        <span />
        <span />
        <span />
        {days.map((d) => (
          <span
            key={d}
            className={`inline-flex items-center justify-center rounded-lg py-2 text-sm ${
              d === 15
                ? "bg-primary font-semibold text-primary-foreground"
                : "text-foreground/80"
            }`}
          >
            {d === 15 ? <HeartIcon className="h-3.5 w-3.5" /> : d}
          </span>
        ))}
      </div>
      <div className="mt-6 space-y-2 text-sm">
        <p className="flex items-center gap-2">
          <HeartIcon className="h-4 w-4 text-primary" /> Anniversary — Sep 8
        </p>
        <p className="flex items-center gap-2">
          <PlaneIcon className="h-4 w-4 text-primary" /> Next meeting — Sep 21
        </p>
        <p className="flex items-center gap-2">
          <CakeIcon className="h-4 w-4 text-primary" /> {p.name}&apos;s birthday — Nov 2
        </p>
      </div>
    </div>
  );
}

export function HerDayApp({ p }: Props) {
  return (
    <div className="px-5 pb-12">
      <p className="text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
        August 15, 2026
      </p>
      <ol className="mt-7 space-y-6 border-l border-border/80 pl-6">
        {p.timeline.map((t, i) => (
          <li key={i} className="relative animate-soft-rise" style={{ animationDelay: `${i * 60}ms` }}>
            <span className="absolute -left-[2.1rem] flex h-7 w-7 items-center justify-center rounded-full bg-card shadow-soft">
              <Icon name={t.icon} className="h-3.5 w-3.5 text-primary" />
            </span>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{t.time}</p>
            <p className="font-display text-lg tracking-tight">{t.title}</p>
            {t.detail ? <p className="text-sm text-muted-foreground">{t.detail}</p> : null}
          </li>
        ))}
      </ol>
      <div className="mt-8 rounded-2xl bg-accent p-5 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Current mood</p>
        <p className="mt-2 flex items-center justify-center gap-2 font-display text-2xl tracking-tight">
          <Icon name={p.mood.icon} className="h-6 w-6 text-primary" /> {p.mood.label}
        </p>
      </div>
      <p className="mt-6 text-center text-xs text-muted-foreground">
        <Link to="/" className="underline decoration-primary/40">
          Our little world
        </Link>
      </p>
    </div>
  );
}

type MySnapRow = {
  id: string;
  storage_path: string;
  caption: string | null;
  created_at: string;
};

type CameraStatus =
  | "starting"
  | "ready"
  | "captured"
  | "sending"
  | "sent"
  | "unavailable";

export function CameraApp({ p, viewer }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [status, setStatus] = useState<CameraStatus>("starting");
  const [preview, setPreview] = useState("");
  const [caption, setCaption] = useState("");
  const [error, setError] = useState("");
  const [snaps, setSnaps] = useState<MySnapRow[]>([]);

  useEffect(() => {
    let cancelled = false;
    mySnaps(viewer)
      .then((rows) => {
        if (!cancelled) setSnaps(rows);
      })
      .catch(() => {
        /* gallery is best-effort */
      });
    return () => {
      cancelled = true;
    };
  }, [viewer]);

  useEffect(() => {
    let stream: MediaStream | null = null;
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("unavailable");
      return;
    }
    navigator.mediaDevices
      .getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 1280 } },
        audio: false,
      })
      .then((s) => {
        stream = s;
        if (videoRef.current) videoRef.current.srcObject = s;
        setStatus("ready");
      })
      .catch(() => setStatus("unavailable"));
    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  function capture() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = 640;
    canvas.height = 640;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, 640, 640);
    setPreview(canvas.toDataURL("image/jpeg", 0.85));
    setError("");
    setStatus("captured");
  }

  async function send() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setStatus("sending");
    try {
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.85),
      );
      if (!blob) throw new Error("Could not encode photo");
      await sendSnap(viewer, p.slug, blob, caption.trim() || undefined);
      setStatus("sent");
      setCaption("");
      const rows = await mySnaps(viewer);
      setSnaps(rows);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not send snap");
      setStatus("unavailable");
    }
  }

  async function onFile(file: File) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      canvas.width = 640;
      canvas.height = 640;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const side = Math.min(img.width, img.height);
        ctx.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, 640, 640);
        setPreview(canvas.toDataURL("image/jpeg", 0.85));
        setError("");
        setStatus("captured");
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  return (
    <div className="space-y-5 px-5 pb-10">
      <canvas ref={canvasRef} className="hidden" />

      <div className="overflow-hidden rounded-3xl border border-primary/25 bg-black shadow-phone">
        {status === "ready" ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="aspect-square w-full object-cover"
          />
        ) : status === "captured" || status === "sending" ? (
          <img src={preview} alt="Captured snap" className="aspect-square w-full object-cover" />
        ) : status === "sent" ? (
          <div className="flex aspect-square flex-col items-center justify-center gap-3 text-white">
            <HeartIcon className="animate-heartbeat h-10 w-10 text-primary" />
            <p className="font-display text-xl">Snap sent to {p.name}</p>
          </div>
        ) : status === "starting" ? (
          <div className="flex aspect-square items-center justify-center text-sm text-muted-foreground">
            Starting camera…
          </div>
        ) : (
          <div className="flex aspect-square flex-col items-center justify-center gap-3 bg-card p-6 text-center">
            <ImageIcon className="h-9 w-9 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {error || "Camera unavailable — choose a photo instead"}
            </p>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft">
              Pick a photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void onFile(f);
                }}
              />
            </label>
          </div>
        )}
      </div>

      <p className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Sending a snap to {p.name}
      </p>

      {(status === "ready" || status === "captured" || status === "unavailable") && (
        <div className="space-y-3">
          {status === "captured" && (
            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add a caption…"
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          )}
          <div className="flex justify-center gap-3">
            {status === "captured" ? (
              <>
                <button
                  type="button"
                  onClick={() => setStatus("ready")}
                  className="rounded-full bg-secondary px-5 py-3 text-sm font-semibold text-secondary-foreground"
                >
                  Retake
                </button>
                <button
                  type="button"
                  onClick={() => void send()}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary-foreground shadow-soft"
                >
                  Send snap <SendIcon className="h-4 w-4" />
                </button>
              </>
            ) : status === "ready" ? (
              <button
                type="button"
                onClick={capture}
                aria-label="Take photo"
                className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-primary/40 bg-primary/15"
              >
                <CameraIcon className="h-7 w-7 text-primary" />
              </button>
            ) : (
              <p className="text-xs text-muted-foreground">
                Still {status === "unavailable" ? "not available" : "…"}
              </p>
            )}
          </div>
        </div>
      )}

      {status === "sent" && (
        <button
          type="button"
          onClick={() => setStatus("ready")}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-primary/30 py-3 text-sm text-primary"
        >
          <CameraIcon className="h-4 w-4" /> Send another
        </button>
      )}

      <div>
        <SectionLabel>My snaps</SectionLabel>
        {snaps.length === 0 ? (
          <p className="py-4 text-center text-xs text-muted-foreground">
            No snaps yet — they show up here and on {p.name}&apos;s phone.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {snaps.map((s) => (
              <figure key={s.id} className="overflow-hidden rounded-xl bg-secondary">
                <img
                  src={publicUrl("snaps", s.storage_path)}
                  alt={s.caption ?? ""}
                  loading="lazy"
                  width={320}
                  height={320}
                  className="aspect-square w-full object-cover"
                />
              </figure>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const STATE_LABEL: Record<CapabilityState, string> = {
  granted: "On",
  denied: "Off",
  unsupported: "N/A",
  idle: "Ask",
};

const STATE_COLOR: Record<CapabilityState, string> = {
  granted: "text-green-500",
  denied: "text-red-500",
  unsupported: "text-muted-foreground",
  idle: "text-amber-500",
};

function CapabilityRow({ c }: { c: DeviceCapability }) {
  return (
    <Card className="flex items-center gap-3 p-3">
      <Icon name={c.icon} className="h-5 w-5 shrink-0 text-primary" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{c.label}</p>
        <p className="truncate text-xs text-muted-foreground">{c.value}</p>
      </div>
      {c.request ? (
        <button
          type="button"
          onClick={() => void c.request?.()}
          className="shrink-0 rounded-full border border-primary/40 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-primary transition hover:bg-primary hover:text-primary-foreground"
        >
          {c.actionLabel}
        </button>
      ) : (
        <span
          className={`shrink-0 text-[0.62rem] font-semibold uppercase tracking-[0.14em] ${STATE_COLOR[c.state]}`}
        >
          {STATE_LABEL[c.state]}
        </span>
      )}
    </Card>
  );
}

export function DeviceApp({ p }: { p: Person }) {
  const { capabilities, blocked } = useDeviceCapabilities();
  const specs = PHONE_SPECS[PHONE_MODEL[p.slug]];
  return (
    <div className="space-y-5 px-5 pb-10">
      <Card>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
            <Icon name="smartphone" className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-display text-base tracking-tight">{specs.name}</p>
            <p className="text-xs text-muted-foreground">{p.name}'s phone</p>
          </div>
        </div>
        <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-secondary px-2 py-3">
            <dt className="text-[0.62rem] font-semibold uppercase tracking-wider text-muted-foreground">
              Display
            </dt>
            <dd className="mt-1 text-xs font-semibold">{specs.display}</dd>
          </div>
          <div className="rounded-xl bg-secondary px-2 py-3">
            <dt className="text-[0.62rem] font-semibold uppercase tracking-wider text-muted-foreground">
              Screen
            </dt>
            <dd className="mt-1 text-xs font-semibold">{specs.screen}</dd>
          </div>
          <div className="rounded-xl bg-secondary px-2 py-3">
            <dt className="text-[0.62rem] font-semibold uppercase tracking-wider text-muted-foreground">
              Diagonal
            </dt>
            <dd className="mt-1 text-xs font-semibold">{specs.screenCm}</dd>
          </div>
        </dl>
      </Card>
      <Card className="border-dashed">
        <p className="text-xs leading-relaxed text-muted-foreground">
          Everything this little phone can read straight from your browser — and
          the few things no web app is ever allowed to see.
        </p>
      </Card>
      <div className="space-y-2">
        {capabilities.map((c) => (
          <CapabilityRow key={c.key} c={c} />
        ))}
      </div>
      <div>
        <SectionLabel>No web app can see these</SectionLabel>
        <div className="space-y-2">
          {blocked.map((b) => (
            <Card key={b.label} className="flex items-center gap-3 p-3 opacity-80">
              <Icon name={b.icon} className="h-5 w-5 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{b.label}</p>
                <p className="text-xs text-muted-foreground">{b.note}</p>
              </div>
              <LockIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export const appTitles: Record<string, string> = {
  photos: "Photos",
  snap: "New Snap",
  messages: "Messages",
  location: "Location",
  food: "Food",
  missyou: "Miss You",
  music: "Music",
  mood: "Mood",
  diary: "Diary",
  surprises: "Surprises",
  activity: "Recent Activity",
  sleep: "Sleep",
  calendar: "Our Calendar",
  herday: "Their Day",
  device: "Device",
  camera: "Camera",
};
