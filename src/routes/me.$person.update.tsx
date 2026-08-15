import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Aurora, Card, PhoneFrame, ScreenHeader, SectionLabel, StatusBar } from "@/components/phone";
import {
  DotIcon,
  HeartIcon,
  Icon,
  MoodOkayIcon,
  MusicIcon,
  PinIcon,
  PersonIcon,
  SunIcon,
  ThoughtIcon,
} from "@/components/icons";
import { isPerson, moodOptions, useWorld, PHONE_MODEL, type PersonSlug } from "@/lib/world";

export const Route = createFileRoute("/me/$person/update")({
  loader: ({ params }) => {
    if (!isPerson(params.person)) throw notFound();
    return { person: params.person as PersonSlug };
  },
  head: () => ({
    meta: [
      { title: "Update My Info — Between Us" },
      {
        name: "description",
        content:
          "Decide what shows up on your phone: status, meals, mood, location, current thought and what you're listening to.",
      },
      { property: "og:title", content: "Update My Info — Between Us" },
      {
        property: "og:description",
        content: "Choose what they see when they open your phone.",
      },
    ],
  }),
  component: UpdateInfo,
});

function UpdateInfo() {
  const { person } = Route.useLoaderData();
  const { world, save } = useWorld();
  const me = world[person];
  const navigate = useNavigate();

  const [status, setStatus] = useState(me.status);
  const [mood, setMood] = useState(me.mood);
  const [thought, setThought] = useState(me.thought);
  const [music, setMusic] = useState(me.music);
  const [meals, setMeals] = useState(me.meals);
  const [location, setLocation] = useState(me.location);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setStatus(me.status);
    setMood(me.mood);
    setThought(me.thought);
    setMusic(me.music);
    setMeals(me.meals);
    setLocation(me.location);
  }, [me]);

  const field =
    "mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary";

  function onSave() {
    save(person, { status, mood, thought, music, meals, location });
    setSaved(true);
    window.setTimeout(() => navigate({ to: "/me/$person", params: { person } }), 700);
  }

  return (
    <Aurora>
      <PhoneFrame model={PHONE_MODEL[person]}>
        <StatusBar label="Update" />
        <ScreenHeader title="Update my info" backTo="/me/$person" backParams={{ person }} />

        <div className="space-y-5 px-5 pb-10">
          <Card>
            <SectionLabel>
              <span className="inline-flex items-center gap-1.5">
                <PersonIcon className="h-3.5 w-3.5" /> Profile
              </span>
            </SectionLabel>
            <p className="font-display text-xl tracking-tight">{me.name}</p>
            <label className="mt-3 block text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Status
              <input className={field} value={status} onChange={(e) => setStatus(e.target.value)} />
            </label>
          </Card>

          <Card>
            <SectionLabel>
              <span className="inline-flex items-center gap-1.5">
                <SunIcon className="h-3.5 w-3.5" /> My day
              </span>
            </SectionLabel>
            <div className="space-y-3">
              {meals.map((m, i) => (
                <div key={m.key} className="grid grid-cols-2 gap-2">
                  <label className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Icon name={m.icon} className="h-3.5 w-3.5" /> {m.label}
                    </span>
                    <input
                      className={field}
                      value={m.item}
                      placeholder="What did you eat?"
                      onChange={(e) =>
                        setMeals(meals.map((x, j) => (i === j ? { ...x, item: e.target.value } : x)))
                      }
                    />
                  </label>
                  <label className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    Time
                    <input
                      className={field}
                      value={m.time}
                      placeholder="1:10 PM"
                      onChange={(e) =>
                        setMeals(meals.map((x, j) => (i === j ? { ...x, time: e.target.value } : x)))
                      }
                    />
                  </label>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SectionLabel>
              <span className="inline-flex items-center gap-1.5">
                <MoodOkayIcon className="h-3.5 w-3.5" /> Mood
              </span>
            </SectionLabel>
            <div className="flex flex-wrap gap-2">
              {moodOptions.map((o) => (
                <button
                  key={o.icon}
                  type="button"
                  onClick={() => setMood({ ...mood, icon: o.icon, label: o.label, updated: "just now" })}
                  className={`flex h-11 w-11 items-center justify-center rounded-full transition ${
                    mood.icon === o.icon ? "bg-primary/15 ring-2 ring-primary" : "bg-secondary"
                  }`}
                  aria-label={o.label}
                >
                  <Icon name={o.icon} className="h-5 w-5" />
                </button>
              ))}
            </div>
            <input
              className={field}
              value={mood.note}
              placeholder="Say a little more…"
              onChange={(e) => setMood({ ...mood, note: e.target.value })}
            />
          </Card>

          <Card>
            <SectionLabel>
              <span className="inline-flex items-center gap-1.5">
                <PinIcon className="h-3.5 w-3.5" /> Location
              </span>
            </SectionLabel>
            <div className="grid grid-cols-2 gap-2">
              <input
                className={field}
                value={location.place}
                placeholder="Place"
                onChange={(e) => setLocation({ ...location, place: e.target.value })}
              />
              <input
                className={field}
                value={location.city}
                placeholder="City"
                onChange={(e) => setLocation({ ...location, city: e.target.value })}
              />
            </div>
            <button
              type="button"
              onClick={() =>
                setLocation({ ...location, sharing: !location.sharing, updated: "just now" })
              }
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-secondary py-2 text-sm text-secondary-foreground"
            >
              <DotIcon className={`h-2 w-2 ${location.sharing ? "text-green-500" : "text-muted-foreground/40"}`} />
              {location.sharing ? "Sharing location" : "Share location"}
            </button>
          </Card>

          <Card>
            <SectionLabel>
              <span className="inline-flex items-center gap-1.5">
                <ThoughtIcon className="h-3.5 w-3.5" /> Current thought
              </span>
            </SectionLabel>
            <input className={field} value={thought} onChange={(e) => setThought(e.target.value)} />
          </Card>

          <Card>
            <SectionLabel>
              <span className="inline-flex items-center gap-1.5">
                <MusicIcon className="h-3.5 w-3.5" /> Listening to
              </span>
            </SectionLabel>
            <input
              className={field}
              value={music.song}
              placeholder="Song"
              onChange={(e) => setMusic({ ...music, song: e.target.value })}
            />
            <input
              className={field}
              value={music.artist}
              placeholder="Artist"
              onChange={(e) => setMusic({ ...music, artist: e.target.value })}
            />
          </Card>

          <button
            type="button"
            onClick={onSave}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow-soft"
          >
            {saved ? (
              <>
                Saved <HeartIcon className="h-4 w-4" />
              </>
            ) : (
              "Save changes"
            )}
          </button>
        </div>
      </PhoneFrame>
    </Aurora>
  );
}
