import { createFileRoute, notFound } from "@tanstack/react-router";
import { Aurora, PhoneFrame, ScreenHeader, StatusBar } from "@/components/phone";
import {
  ActivityApp,
  CalendarApp,
  CameraApp,
  DeviceApp,
  DiaryApp,
  FoodApp,
  HerDayApp,
  LocationApp,
  MessagesApp,
  MissYouApp,
  MoodApp,
  MusicApp,
  PhotosApp,
  SleepApp,
  SnapApp,
  SurprisesApp,
  appTitles,
} from "@/components/phone-apps";
import {
  isPerson,
  other,
  useWorld,
  PHONE_MODEL,
  type Person,
  type PersonSlug,
} from "@/lib/world";

export const Route = createFileRoute("/phone/$person/$app")({
  loader: ({ params }) => {
    if (!isPerson(params.person) || !(params.app in appTitles)) throw notFound();
    return { person: params.person as PersonSlug, app: params.app };
  },
  head: () => ({
    meta: [
      { title: "Inside Their Phone — Between Us" },
      {
        name: "description",
        content:
          "A little window into their day — photos, snaps, notes, mood, meals, sleep and surprises kept between us.",
      },
      { property: "og:title", content: "Inside Their Phone — Between Us" },
      {
        property: "og:description",
        content: "A little window into their day, kept between us.",
      },
    ],
  }),
  component: AppScreen,
});

const screens: Record<
  string,
  (props: { p: Person; viewer: PersonSlug }) => React.JSX.Element
> = {
  photos: PhotosApp,
  snap: SnapApp,
  messages: MessagesApp,
  location: LocationApp,
  food: FoodApp,
  missyou: MissYouApp,
  music: MusicApp,
  mood: MoodApp,
  diary: DiaryApp,
  surprises: SurprisesApp,
  activity: ActivityApp,
  sleep: SleepApp,
  calendar: CalendarApp,
  herday: HerDayApp,
  device: DeviceApp,
  camera: CameraApp,
};

function AppScreen() {
  const { person, app } = Route.useLoaderData();
  const { world } = useWorld();
  const p = world[person];
  const viewer = other(person);
  const Screen = screens[app];

  const title =
    app === "herday"
      ? `${p.name}'s day`
      : app === "food"
        ? `${p.name}'s day`
        : (appTitles[app] ?? p.name);


  return (
    <Aurora>
      <PhoneFrame model={PHONE_MODEL[person]}>
        <StatusBar label={p.name} />
        <ScreenHeader title={title} backTo="/phone/$person" backParams={{ person }} />
        <div className="animate-soft-rise">
          {Screen ? <Screen p={p} viewer={viewer} /> : null}
        </div>
      </PhoneFrame>
    </Aurora>
  );
}
