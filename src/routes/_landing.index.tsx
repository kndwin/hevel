import { Button } from "@/shared/browser/ui/button";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_landing/")({
  component: () => <LandingPage />,
});

import { Link } from "@tanstack/react-router";

function LandingPage() {
  return (
    <section className="w-full py-6 sm:py-12 md:py-24 lg:py-32 xl:py-48 text-center">
      <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl/none">
        Find your next tech job
      </h1>
      <p className="mt-4 max-w-[700px] mx-auto text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
        Keep track of your job applications, interviews, and offers in one
        place.
      </p>
      <Button size="lg" asChild className="mt-8">
        <Link to="/onboard">Get Started</Link>
      </Button>
    </section>
  );
}
