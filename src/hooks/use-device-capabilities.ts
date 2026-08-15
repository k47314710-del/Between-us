import * as React from "react";

export type CapabilityState = "granted" | "denied" | "unsupported" | "idle";

export type DeviceCapability = {
  key: string;
  label: string;
  icon: string;
  value: string;
  state: CapabilityState;
  actionLabel?: string | undefined;
  request?: (() => Promise<void>) | undefined;
};

export type BlockedCapability = { icon: string; label: string; note: string };

type BatteryManagerLike = {
  level: number;
  charging: boolean;
  addEventListener(type: "levelchange" | "chargingchange", listener: () => void): void;
  removeEventListener(type: "levelchange" | "chargingchange", listener: () => void): void;
};

type NetworkInfo = { effectiveType?: string };

const orientationLabel = (type: string | undefined, angle: number | undefined): string => {
  if (type) {
    if (type.startsWith("landscape")) return "Landscape";
    return "Portrait";
  }
  if (angle === 90 || angle === -90) return "Landscape";
  return "Portrait";
};

export const blockedCapabilities: BlockedCapability[] = [
  { icon: "music", label: "Currently playing song", note: "Browsers keep this private" },
  { icon: "smartphone", label: "Other apps", note: "Invisible to web apps" },
  { icon: "message", label: "WhatsApp messages", note: "Only your own apps can see them" },
  { icon: "phone", label: "Call history", note: "Not exposed to browsers" },
  { icon: "image", label: "Whole gallery", note: "Websites only see photos you pick" },
  { icon: "pin", label: "Background location", note: "Browsers restrict continuous tracking" },
  {
    icon: "battery",
    label: "Exact battery on every phone",
    note: "Battery API is Chrome/Android only",
  },
];

export function useDeviceCapabilities(): {
  capabilities: DeviceCapability[];
  blocked: BlockedCapability[];
} {
  const [now, setNow] = React.useState(() => new Date());
  const [online, setOnline] = React.useState(true);
  const [batteryInfo, setBatteryInfo] = React.useState<BatteryManagerLike | null>(null);
  const [netType, setNetType] = React.useState<string | null>(null);
  const [screenInfo, setScreenInfo] = React.useState({ width: 0, height: 0, orientation: "" });
  const [darkMode, setDarkMode] = React.useState(false);
  const [geoState, setGeoState] = React.useState<CapabilityState>("idle");
  const [mediaState, setMediaState] = React.useState<CapabilityState>("idle");
  const [notifState, setNotifState] = React.useState<CapabilityState>("idle");
  const [clipState, setClipState] = React.useState<CapabilityState>("idle");

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    setOnline(navigator.onLine);
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    const updateNet = () => {
      const conn = (navigator as { connection?: NetworkInfo }).connection;
      setNetType(conn?.effectiveType ?? null);
    };
    updateNet();
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    (
      navigator as {
        connection?: NetworkInfo & { addEventListener?: (t: string, c: () => void) => void };
      }
    ).connection?.addEventListener?.("change", updateNet);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
      (
        navigator as {
          connection?: NetworkInfo & { removeEventListener?: (t: string, c: () => void) => void };
        }
      ).connection?.removeEventListener?.("change", updateNet);
    };
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    let battery: BatteryManagerLike | null = null;
    const onLevelChange = () => setBatteryInfo(battery);
    const onChargingChange = () => setBatteryInfo(battery);
    const nav = navigator as Navigator & { getBattery?: () => Promise<BatteryManagerLike> };
    if (!nav.getBattery) return;
    nav
      .getBattery()
      .then((b) => {
        battery = b;
        b.addEventListener("levelchange", onLevelChange);
        b.addEventListener("chargingchange", onChargingChange);
        setBatteryInfo(b);
      })
      .catch(() => {});
    return () => {
      battery?.removeEventListener("levelchange", onLevelChange);
      battery?.removeEventListener("chargingchange", onChargingChange);
    };
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const updateScreen = () => {
      setScreenInfo({
        width: window.innerWidth,
        height: window.innerHeight,
        orientation: screen.orientation?.type ?? String(window.orientation ?? ""),
      });
    };
    updateScreen();
    window.addEventListener("resize", updateScreen);
    screen.orientation?.addEventListener("change", updateScreen);
    return () => {
      window.removeEventListener("resize", updateScreen);
      screen.orientation?.removeEventListener("change", updateScreen);
    };
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setDarkMode(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const requestLocation = React.useCallback(async () => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setGeoState("unsupported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => setGeoState("granted"),
      () => setGeoState("denied"),
    );
  }, []);

  const requestMedia = React.useCallback(async () => {
    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setMediaState("unsupported");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      stream.getTracks().forEach((t) => t.stop());
      setMediaState("granted");
    } catch {
      setMediaState("denied");
    }
  }, []);

  const requestNotifications = React.useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setNotifState("unsupported");
      return;
    }
    const permission = await Notification.requestPermission();
    setNotifState(permission === "granted" ? "granted" : "denied");
  }, []);

  const requestClipboard = React.useCallback(async () => {
    if (typeof window === "undefined" || !navigator.clipboard?.readText) {
      setClipState("unsupported");
      return;
    }
    try {
      await navigator.clipboard.readText();
      setClipState("granted");
    } catch {
      setClipState("denied");
    }
  }, []);

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const batteryLevel = batteryInfo ? Math.round(batteryInfo.level * 100) : null;

  const capabilities: DeviceCapability[] = [
    batteryLevel !== null
      ? {
          key: "battery",
          label: "Battery",
          icon: "battery",
          value: `${batteryLevel}% · ${batteryInfo?.charging ? "Charging" : "On battery"}`,
          state: "granted",
        }
      : {
          key: "battery",
          label: "Battery",
          icon: "battery",
          value: "Live battery not exposed by this browser",
          state: "unsupported",
        },
    {
      key: "time",
      label: "Current time",
      icon: "clock",
      value: now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", second: "2-digit" }),
      state: "granted",
    },
    {
      key: "timezone",
      label: "Time zone",
      icon: "globe",
      value: timeZone || "Local",
      state: "granted",
    },
    {
      key: "screen",
      label: "Screen size",
      icon: "monitor",
      value: screenInfo.width ? `${screenInfo.width} x ${screenInfo.height}` : "Reading viewport…",
      state: "granted",
    },
    {
      key: "orientation",
      label: "Orientation",
      icon: "rotate",
      value: orientationLabel(screenInfo.orientation, Number(window.orientation ?? NaN)),
      state: "granted",
    },
    {
      key: "theme",
      label: "Appearance",
      icon: darkMode ? "moon" : "sun",
      value: darkMode ? "Dark" : "Light",
      state: "granted",
    },
    {
      key: "network",
      label: "Network type",
      icon: "wifi",
      value: netType ? `${netType.toUpperCase()} connection` : "Not reported by browser",
      state: netType ? "granted" : "unsupported",
    },
    {
      key: "connection",
      label: "Connection",
      icon: "signal",
      value: online ? "Online" : "Offline",
      state: online ? "granted" : "denied",
    },
    {
      key: "location",
      label: "Location",
      icon: "pin",
      value:
        geoState === "granted"
          ? "Shared with this page"
          : geoState === "denied"
            ? "Blocked"
            : geoState === "unsupported"
              ? "Not supported here"
              : "Needs permission",
      state: geoState,
      actionLabel: "Allow",
      request: requestLocation,
    },
    {
      key: "camera",
      label: "Camera",
      icon: "camera",
      value:
        mediaState === "granted"
          ? "Ready"
          : mediaState === "denied"
            ? "Blocked"
            : mediaState === "unsupported"
              ? "Not supported here"
              : "Needs permission",
      state: mediaState,
      actionLabel: "Allow",
      request: requestMedia,
    },
    {
      key: "microphone",
      label: "Microphone",
      icon: "mic",
      value:
        mediaState === "granted"
          ? "Ready"
          : mediaState === "denied"
            ? "Blocked"
            : mediaState === "unsupported"
              ? "Not supported here"
              : "Needs permission",
      state: mediaState,
      actionLabel: "Allow",
      request: requestMedia,
    },
    {
      key: "notifications",
      label: "Notifications",
      icon: "bell",
      value:
        notifState === "granted"
          ? "Allowed"
          : notifState === "denied"
            ? "Blocked"
            : notifState === "unsupported"
              ? "Not supported here"
              : "Needs permission",
      state: notifState,
      actionLabel: "Allow",
      request: requestNotifications,
    },
    {
      key: "vibration",
      label: "Vibration",
      icon: "vibrate",
      value:
        typeof navigator !== "undefined" && "vibrate" in navigator ? "Supported" : "Not supported",
      state: typeof navigator !== "undefined" && "vibrate" in navigator ? "granted" : "unsupported",
    },
    {
      key: "clipboard",
      label: "Clipboard",
      icon: "clipboard",
      value:
        clipState === "granted"
          ? "Readable"
          : clipState === "denied"
            ? "Blocked"
            : clipState === "unsupported"
              ? "Not supported here"
              : "Needs permission",
      state: clipState,
      actionLabel: "Allow",
      request: requestClipboard,
    },
  ];

  return { capabilities, blocked: blockedCapabilities };
}
