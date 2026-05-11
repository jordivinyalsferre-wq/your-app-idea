import { createFileRoute, redirect } from "@tanstack/react-router";

// Temple is now the home page — redirect any old /temple links
export const Route = createFileRoute("/temple")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
  component: () => null,
});
