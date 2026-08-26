import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  children?: ReactNode;
}) {
  return (
    <section className="px-3 pt-4 sm:px-5">
      <div className="frame-gold relative mx-auto max-w-7xl overflow-hidden rounded-md">
        <img
          src={image}
          alt={title}
          width={1600}
          height={1000}
          className="h-[46vh] min-h-[300px] w-full object-cover sm:h-[52vh]"
        />
        <div className="hero-scrim absolute inset-0" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <p className="eyebrow text-[var(--gold)] text-shadow-gold tracking-widest font-bold">{eyebrow}</p>
          <h1 className="display-lg mt-3 max-w-3xl text-white font-bold hero-title-shadow text-shadow-glow tracking-wide">{title}</h1>
          <div className="gold-rule mt-4 w-28 mx-auto shadow-lg" />
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-100/95 drop-shadow-md font-medium sm:text-base">
            {subtitle}
          </p>
          {children && <div className="mt-7 flex flex-wrap justify-center gap-3">{children}</div>}
        </div>
      </div>
    </section>
  );
}

export function Section({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`mx-auto max-w-7xl px-5 py-16 sm:py-20 ${className}`}>{children}</section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  center = true,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow && <p className="eyebrow text-shadow-gold tracking-widest">{eyebrow}</p>}
      <h2 className="display-lg mt-3 text-[var(--foreground)] font-display font-semibold tracking-wide drop-shadow-sm">{title}</h2>
      <div className={`gold-rule mt-5 w-24 ${center ? "mx-auto" : ""}`} />
      {intro && <p className="mt-5 text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-base">{intro}</p>}
    </div>
  );
}

export function InfoCard({
  title,
  body,
  meta,
}: {
  title: string;
  body: string;
  meta?: string;
}) {
  return (
    <article className="surface-card group p-6 transition-transform hover:-translate-y-1">
      {meta && <p className="eyebrow">{meta}</p>}
      <h3 className="mt-2 font-display text-xl text-[var(--foreground)]">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-[var(--muted-foreground)]">{body}</p>
    </article>
  );
}
