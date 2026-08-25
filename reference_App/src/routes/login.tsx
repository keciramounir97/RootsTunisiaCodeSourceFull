import { createFileRoute, Link } from "@tanstack/react-router";
import carthage from "../assets/slider-carthage.jpg";
import { Logo } from "../components/site/Logo";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — Roots Tunisia" },
      {
        name: "description",
        content: "Sign in to your Roots Tunisia account to continue your Tunisian family research.",
      },
      { property: "og:title", content: "Login — Roots Tunisia" },
      { property: "og:description", content: "Access your Tunisian family trees and archives." },
    ],
  }),
  component: Login,
});

function Login() {
  return (
    <div className="grid min-h-[80vh] lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img
          src={carthage}
          alt="Ruins of Carthage overlooking the Mediterranean"
          width={1600}
          height={1000}
          className="h-full w-full object-cover"
        />
        <div className="hero-scrim absolute inset-0" />
        <div className="absolute bottom-12 left-12 max-w-sm">
          <p className="eyebrow">Roots Tunisia</p>
          <p className="mt-3 font-display text-3xl text-parchment">
            Your lineage is waiting in the registers.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center px-6 py-16">
        <form
          className="w-full max-w-md"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <Logo />
          <h1 className="display-lg mt-8 text-foreground">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to continue building your Tunisian family tree.
          </p>
          <div className="mt-8 grid gap-5">
            <label className="grid gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                Email
              </span>
              <input
                type="email"
                required
                className="rounded-sm border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-gold"
                placeholder="you@example.tn"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                Password
              </span>
              <input
                type="password"
                required
                className="rounded-sm border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-gold"
                placeholder="••••••••"
              />
            </label>
            <button type="submit" className="btn-base btn-red w-full">
              Sign in
            </button>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            No account yet?{" "}
            <Link to="/signup" className="font-semibold text-gold hover:underline">
              Join Roots Tunisia
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
