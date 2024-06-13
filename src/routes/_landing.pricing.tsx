import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_landing/pricing")({
  component: () => <PricingPage />,
});

function PricingPage() {
  return (
    <div className="w-full py-12 lg:py-16 xl:py-20">
      <div className="container grid max-[900px] px-4 md:px-6 items-center gap-6">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            One-time payment. Unlimited innovation.
          </h2>
          <p className="mx-auto max-w-[600px] text-stone-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Choose the perfect plan for your team. All plans include unlimited
            projects and bandwidth. Pay once and enjoy continuous deployment.
          </p>
        </div>
        <div className="grid gap-6 md:gap-12 lg:grid-cols-2">
          <div className="flex flex-col justify-between space-y-4 border border-stone-200 rounded-lg p-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Free</h3>
              <p className="text-stone-500 dark:text-gray-400">
                No payment required
              </p>
            </div>
            <ul className="grid gap-2">
              <li>Single user access</li>
              <li>Limited features</li>
              <li>Basic support</li>
            </ul>
            <Link
              className="inline-flex h-10 items-center justify-center rounded-md border bg-white text-sm font-medium shadow-sm transition-colors hover:bg-stone-100 hover:text-stone-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stone-950 disabled:pointer-events-none disabled:opacity-50 dark:border-stone-800 dark:bg-stone-950 dark:hover:bg-stone-950 dark:hover:text-stone-50 dark:focus-visible:ring-stone-300"
              href="#"
            >
              Get Started
            </Link>
          </div>
          <div className="flex flex-col justify-between space-y-4 border border-stone-200 rounded-lg p-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-stone-900 dark:text-gray-50">
                Pro
              </h3>
              <p className="text-stone-500 dark:text-gray-400">
                $299 one-time payment
              </p>
            </div>
            <ul className="grid gap-2">
              <li>Unlimited team members</li>
              <li>10 concurrent builds</li>
              <li>100GB file storage</li>
            </ul>
            <Link
              className="inline-flex h-10 items-center justify-center rounded-md bg-stone-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
              href="#"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
