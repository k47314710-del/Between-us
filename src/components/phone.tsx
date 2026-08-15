import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { ArrowLeftIcon, BatteryIcon, HeartIcon, WifiIcon } from "@/components/icons";
import type { PhoneModel } from "@/lib/world";

export function Hearts() {
  const hearts = [
    { left: "8%", delay: "0s", size: "1.1rem", dur: "16s" },
    { left: "22%", delay: "3s", size: "0.7rem", dur: "21s" },
    { left: "41%", delay: "6s", size: "1.4rem", dur: "18s" },
    { left: "63%", delay: "1.5s", size: "0.9rem", dur: "23s" },
    { left: "78%", delay: "8s", size: "1.2rem", dur: "19s" },
    { left: "91%", delay: "4.5s", size: "0.8rem", dur: "25s" },
  ];
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      {hearts.map((h, i) => (
        <HeartIcon
          key={i}
          className="float-heart absolute bottom-[-10%] text-primary/25"
          style={{
            left: h.left,
            width: h.size,
            height: h.size,
            animationDelay: h.delay,
            animationDuration: h.dur,
          }}
        />
      ))}
    </div>
  );
}

export function Aurora({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-aurora">
      <Hearts />
      <div className="relative">{children}</div>
    </div>
  );
}

function useClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }));
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, []);
  return time;
}

export function SignalBars({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-end gap-[2px] ${className}`}>
      {[3, 5, 7, 9].map((h, i) => (
        <span
          key={i}
          className="w-[3px] rounded-[1px] bg-current"
          style={{ height: h, opacity: i === 3 ? 1 : 0.55 }}
        />
      ))}
    </span>
  );
}

/** Top-of-screen status row: live clock left, signal / wifi / battery right. */
export function DeviceStatus({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const time = useClock();
  const dark = tone === "dark";
  return (
    <div
      className={`flex items-center justify-between px-6 pt-3.5 text-[0.72rem] font-semibold ${
        dark ? "text-foreground" : "text-white"
      }`}
    >
      <span className={dark ? "" : "text-shadow-soft"}>{time || "\u00A0"}</span>
      <span className="flex items-center gap-1.5">
        <SignalBars className="text-current" />
        <WifiIcon className="h-3.5 w-3.5" />
        <BatteryIcon className="h-4 w-4" />
      </span>
    </div>
  );
}

const MODEL_STYLE: Record<
  PhoneModel,
  {
    shell: string;
    screenPad: string;
    screenRadius: string;
  }
> = {
  redmi9a: {
    shell: "bg-gradient-to-b from-neutral-500 via-neutral-700 to-neutral-950",
    screenPad: "pt-[0.3rem] pb-5",
    screenRadius: "rounded-t-[1.7rem] rounded-b-[0.55rem]",
  },
  realme8: {
    shell: "bg-gradient-to-b from-neutral-100 via-neutral-400 to-neutral-900",
    screenPad: "p-[0.3rem]",
    screenRadius: "rounded-[2.1rem]",
  },
  generic: {
    shell: "bg-gradient-to-b from-neutral-300 via-neutral-500 to-neutral-800",
    screenPad: "p-[0.3rem]",
    screenRadius: "rounded-[2.35rem]",
  },
};

function Notch({ model }: { model: PhoneModel }) {
  if (model === "redmi9a") {
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[0.35rem] z-40 h-[0.8rem] w-[0.85rem] -translate-x-1/2 rounded-full bg-black"
      >
        <div className="absolute left-1/2 top-[0.26rem] h-[0.26rem] w-[0.26rem] -translate-x-1/2 rounded-full bg-[#16213a]" />
      </div>
    );
  }
  if (model === "realme8") {
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute left-[4%] top-[0.55rem] z-40 flex h-[0.75rem] w-[0.75rem] items-center justify-center rounded-full bg-black"
      >
        <div className="h-[0.34rem] w-[0.34rem] rounded-full bg-[#2c3a5c] ring-1 ring-black/60" />
      </div>
    );
  }
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-2.5 z-40 flex h-[1.35rem] w-[4.6rem] -translate-x-1/2 items-center justify-end rounded-full bg-black pr-2"
    >
      <div className="h-[0.45rem] w-[0.45rem] rounded-full bg-[#17213b]" />
    </div>
  );
}

export function PhoneFrame({
  children,
  model = "generic",
}: {
  children: ReactNode;
  model?: PhoneModel;
}) {
  const s = MODEL_STYLE[model];
  return (
    <div className="mx-auto flex w-full max-w-[24rem] flex-col items-center px-4 py-6 sm:py-12">
      <div
        className={`relative rounded-[3.2rem] p-[0.42rem] shadow-phone ring-1 ring-black/40 ${s.shell}`}
      >
        <div aria-hidden className="absolute -left-[0.34rem] top-[6.4rem] h-7 w-[0.3rem] rounded-l-md bg-neutral-700" />
        <div aria-hidden className="absolute -left-[0.34rem] top-[9rem] h-12 w-[0.3rem] rounded-l-md bg-neutral-700" />
        <div aria-hidden className="absolute -right-[0.34rem] top-[8.4rem] h-20 w-[0.3rem] rounded-r-md bg-neutral-700" />
        <div className={`rounded-[2.9rem] bg-neutral-950 ${s.screenPad}`}>
          <div
            className={`relative h-[min(43.33rem,82vh)] w-[19.5rem] overflow-hidden bg-screen ${s.screenRadius}`}
          >
            <div
              className={`pointer-events-none absolute inset-0 z-30 ring-1 ring-inset ring-black/20 ${s.screenRadius}`}
            />
            <Notch model={model} />
            <div className="scrollbar-hide h-full overflow-y-auto overflow-x-hidden">
              {children}
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute bottom-1.5 left-1/2 z-40 h-1 w-28 -translate-x-1/2 rounded-full bg-black/60 mix-blend-difference"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function StatusBar({ label }: { label?: string }) {
  return (
    <div className="sticky top-0 z-30 border-b border-border/40 bg-screen/85 backdrop-blur-md">
      <DeviceStatus tone="dark" />
      {label ? (
        <p className="pb-1.5 text-center text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
          {label}
        </p>
      ) : null}
    </div>
  );
}

export function ScreenHeader({
  title,
  backTo,
  backParams,
}: {
  title: string;
  backTo: string;
  backParams?: Record<string, string>;
}) {
  return (
    <div className="flex items-center gap-3 px-5 py-4">
      <Link
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        to={backTo as any}
        params={backParams as never}
        aria-label="Go back"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground transition hover:bg-accent"
      >
        <ArrowLeftIcon className="h-5 w-5" />
      </Link>
      <h1 className="font-display text-lg tracking-tight text-foreground">{title}</h1>
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-border/70 bg-card p-4 shadow-soft ${className}`}>
      {children}
    </div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
      {children}
    </p>
  );
}
