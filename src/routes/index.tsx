import { createFileRoute, Link } from "@tanstack/react-router";
import { Aurora, PhoneFrame } from "@/components/phone";
import { HeartIcon, InfinityIcon } from "@/components/icons";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Between Us — Our Little World" },
      {
        name: "description",
        content:
          "Between Us: two phones connected by love. Step into each other's day — mood, meals, messages, music and little surprises.",
      },
      { property: "og:title", content: "Between Us — Our Little World" },
      {
        property: "og:description",
        content: "Two phones connected by love. Krishna and Varshini, always connected.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <Aurora>
      <PhoneFrame>
        <div className="bg-wallpaper flex min-h-full flex-col items-center px-5 pb-10 pt-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-[1.4rem] bg-gradient-to-br from-primary to-chart-4 shadow-soft">
            <HeartIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="mt-4 font-display text-3xl tracking-tight text-white text-shadow-soft">
            Our Little World
          </h1>
          <p className="mt-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-white/75">
            Krishna <HeartIcon className="inline h-3 w-3 text-white" /> Varshini
          </p>

          <div className="mt-9 w-full space-y-3">
            <Link
              to="/me/$person"
              params={{ person: "krishna" }}
              className="animate-soft-rise flex items-center gap-3 rounded-3xl border border-white/25 bg-white/15 p-4 text-left shadow-soft backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/25"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/20">
                <HeartIcon className="h-5 w-5 text-white" />
              </span>
              <span>
                <span className="block font-display text-xl tracking-tight text-white">
                  Krishna
                </span>
                <span className="block text-xs text-white/80">Enter my world</span>
              </span>
            </Link>
            <Link
              to="/me/$person"
              params={{ person: "varshini" }}
              className="animate-soft-rise flex items-center gap-3 rounded-3xl border border-white/25 bg-white/15 p-4 text-left shadow-soft backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/25"
              style={{ animationDelay: "0.12s" }}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/20">
                <HeartIcon className="h-5 w-5 text-white" />
              </span>
              <span>
                <span className="block font-display text-xl tracking-tight text-white">
                  Varshini
                </span>
                <span className="block text-xs text-white/80">Enter her world</span>
              </span>
            </Link>
          </div>

          <p className="mt-10 flex items-center justify-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-white/70">
            Always connected <InfinityIcon className="h-4 w-4" />
          </p>
        </div>
      </PhoneFrame>
    </Aurora>
  );
}
