import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/phone/$person")({
  component: () => <Outlet />,
});
