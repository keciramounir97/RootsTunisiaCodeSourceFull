import { createFileRoute, Link } from "@tanstack/react-router";
import kairouan from "../assets/slider-kairouan.jpg";
import { Logo } from "../components/site/Logo";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Join Roots Tunisia — Create Your Free Account" },
      {
        name: "description",
        content:
          "Create a free Roots Tunisia account to build your family tree, upload documents and photographs, and explore Tunisian archives.",
      },
      { property: "og:title", content: "Join Roots Tunisia" },
      {
        property: "og:description",
        content: "Start your Tunisian family tree free — records, photographs and oral history in one place.",
      },
    ],
  }),
  component: Signup,
});

function Signup() {
  return (
    <div className="grid min-h-[80vh] lg:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-16">
        <form
          className="w-full max-w-md"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <Logo />
          <h1 className="display-lg mt-8 text-foreground">Join Roots Tunisia</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Free forever for your first family tree. No card required.
          </p>
          <div className="mt-8 grid gap-5">
            <label className="grid gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                Full name
              </span>
              <input
                required
                className="rounded-sm border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-gold"
                placeholder="Mohamed Ben Ayed"
              />
            </label>
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
                Family region
              </span>
              <input
                className="rounded-sm border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-gold"
                placeholder="Tunis, Sfax, Djerba…"
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
            <button type="submit" className="btn-base btn-gold w-full">
              Create my account
            </button>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Already a member?{" "}
            <Link to="/login" className="font-semibold text-gold hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
      <div className="relative hidden lg:block">
        <img
          src={kairouan}
          alt="Courtyard of the Great Mosque of Kairouan at sunset"
          width={1600}
          height={1000}
          className="h-full w-full object-cover"
        />
        <div className="hero-scrim absolute inset-0" />
        <div className="absolute bottom-12 left-12 max-w-sm">
          <p className="eyebrow">جذور تونس</p>
          <p className="mt-3 font-display text-3xl text-parchment">
            Every name you save is a generation kept.
          </p>
        </div>
      </div>
    </div>
  );
}
