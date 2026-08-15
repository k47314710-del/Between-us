import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Aurora, PhoneFrame, ScreenHeader, StatusBar } from "@/components/phone";
import { Icon, InfinityIcon, PencilIcon } from "@/components/icons";
import { isPerson, other, useWorld, PHONE_MODEL, type PersonSlug } from "@/lib/world";

export const Route = createFileRoute("/me/$person")({
  loader: ({ params }) => {
    if (!isPerson(params.person)) throw notFound();
    return { person: params.person as PersonSlug };
  },
  head: () => ({
    meta: [
      { title: "My Control Room — Between Us" },
      {
        name: "description",
        content: "Your side of Between Us: open their phone, or update what they see on yours.",
      },
      { property: "og:title", content: "My Control Room — Between Us" },
      {
        property: "og:description",
        content: "Open their phone, or update what they see when they open yours.",
      },
    ],
  }),
  component: ControlRoom,
});

function ControlRoom() {
  const { person } = Route.useLoaderData();
  const { world } = useWorld();
  const me = world[person];
  const them = world[other(person)];

  return (
    <Aurora>
      <PhoneFrame model={PHONE_MODEL[person]}>
        <StatusBar label={me.name} />
        <ScreenHeader title={me.name} backTo="/" />

        <div className="px-5 pb-8">
          <div className="flex flex-col items-center py-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent shadow-soft">
              <Icon name={me.icon} className="h-9 w-9 text-primary" />
            </div>
            <h2 className="mt-4 font-display text-2xl tracking-tight">{me.name}</h2>
            <p className="text-sm text-muted-foreground">{me.status}</p>
          </div>

          <Link
            to="/phone/$person"
            params={{ person: them.slug }}
            className="block rounded-3xl border border-primary/30 bg-card p-6 text-center shadow-soft transition hover:-translate-y-0.5 hover:shadow-phone"
          >
            <Icon name={them.icon} className="mx-auto h-8 w-8 text-primary" />
            <span className="mt-3 block font-display text-xl tracking-tight">{them.name}</span>
            <span className="mt-1 block text-sm text-muted-foreground">
              Open {them.name}&apos;s phone
            </span>
            <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
              <span className="h-2 w-2 rounded-full bg-primary" /> Active {them.activeAgo}
            </span>
          </Link>

          <Link
            to="/me/$person/update"
            params={{ person: me.slug }}
            className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-primary-foreground shadow-soft transition hover:-translate-y-0.5"
          >
            <PencilIcon className="h-4 w-4" /> Update my info
          </Link>

          <p className="mt-8 flex items-center justify-center gap-1.5 text-center text-xs uppercase tracking-[0.28em] text-muted-foreground">
            Always connected <InfinityIcon className="h-4 w-4" />
          </p>
        </div>
      </PhoneFrame>
    </Aurora>
  );
}
