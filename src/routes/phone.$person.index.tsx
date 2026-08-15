import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Aurora, DeviceStatus, PhoneFrame } from "@/components/phone";
import { AppIcon } from "@/components/phone-apps";
import { CameraIcon, DotIcon, HeartIcon, Icon } from "@/components/icons";
import { markPhoneOpen } from "@/lib/db";
import { isPerson, phoneApps, useWorld, PHONE_MODEL, type PersonSlug } from "@/lib/world";

export const Route = createFileRoute("/phone/$person/")({
  loader: ({ params }) => {
    if (!isPerson(params.person)) throw notFound();
    return { person: params.person as PersonSlug };
  },
  head: () => ({
    meta: [
      { title: "Their Phone — Between Us" },
      {
        name: "description",
        content:
          "Step inside their little digital phone: snaps, messages, mood, food, music, diary and today's timeline.",
      },
      { property: "og:title", content: "Their Phone — Between Us" },
      {
        property: "og:description",
        content: "I wonder what their world looks like right now…",
      },
    ],
  }),
  component: PhoneHome,
});

const DOCK_SLUGS = ["messages", "camera", "missyou", "photos"] as const;

function PhoneHome() {
  const { person } = Route.useLoaderData();
  const { world } = useWorld();
  const p = world[person];
  const viewer = person === "krishna" ? "Varshini" : "Krishna";
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 5 ? "Night owl" : h < 12 ? "Morning" : h < 17 ? "Afternoon" : "Evening");
  }, []);

  useEffect(() => {
    void markPhoneOpen(person).catch(() => {
      /* online tracking is best-effort */
    });
  }, [person]);

  const dockApps = DOCK_SLUGS.map((slug) => phoneApps.find((a) => a.slug === slug)).filter(
    (a) => a !== undefined,
  );

  return (
    <Aurora>
      <PhoneFrame model={PHONE_MODEL[person]}>
        <div className="bg-wallpaper flex min-h-full flex-col pb-8">
          <div className="sticky top-0 z-30">
            <DeviceStatus tone="light" />
          </div>

          <div className="px-5 pt-4">
            <div className="rounded-3xl border border-white/25 bg-white/15 p-4 shadow-soft backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20">
                  <Icon name={p.icon} className="h-6 w-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-xl tracking-tight text-white text-shadow-soft">
                    {greeting}, {p.name}
                  </h2>
                  <p className="flex items-center gap-1.5 text-xs text-white/80">
                    <DotIcon className="h-2 w-2 text-emerald-300" /> Active {p.activeAgo} ·{" "}
                    {p.status}
                  </p>
                </div>
                <HeartIcon className="h-5 w-5 shrink-0 text-white/90" />
              </div>
              <Link
                to="/phone/$person/$app"
                params={{ person, app: "camera" }}
                className="mt-3 flex items-center justify-center gap-2 rounded-2xl bg-white/20 py-3 text-sm font-semibold text-white transition hover:bg-white/30"
              >
                <CameraIcon className="h-4 w-4" /> New snap
              </Link>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-4 gap-y-5 px-4">
            {phoneApps.map((a) => (
              <Link
                key={a.slug}
                to="/phone/$person/$app"
                params={{ person, app: a.slug }}
                className="flex flex-col items-center gap-1"
              >
                <AppIcon slug={a.slug} icon={a.icon} size="h-12 w-12" />
                <span className="text-[0.58rem] font-medium text-white text-shadow-soft">
                  {a.label}
                </span>
              </Link>
            ))}
          </div>

          <Link
            to="/phone/$person/$app"
            params={{ person, app: "herday" }}
            className="mx-5 mt-5 flex items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/15 py-3 text-center font-display text-base tracking-tight text-white shadow-soft backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/25"
          >
            <HeartIcon className="h-4 w-4" /> {p.name}&apos;s Day
          </Link>

          <div className="mt-auto px-3 pt-5">
            <div className="flex items-center justify-around rounded-[1.75rem] border border-white/20 bg-white/20 px-4 py-2.5 backdrop-blur-2xl">
              {dockApps.map((a) => (
                <Link
                  key={a.slug}
                  to="/phone/$person/$app"
                  params={{ person, app: a.slug }}
                  aria-label={a.label}
                >
                  <AppIcon slug={a.slug} icon={a.icon} size="h-12 w-12" />
                </Link>
              ))}
            </div>
          </div>

          <p className="mt-2.5 flex items-center justify-center gap-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-white/70">
            <HeartIcon className="h-3 w-3" /> {viewer}
          </p>
        </div>
      </PhoneFrame>
    </Aurora>
  );
}
