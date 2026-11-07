import type { ReactNode } from "react";
import { Link } from "react-router-dom";

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
    <section className="px-4 pt-4 sm:px-6 lg:px-8">
      <div className="frame-gold relative mx-auto max-w-[var(--content-max)] overflow-hidden rounded-md min-h-[340px] sm:min-h-[420px] flex items-center justify-center">
        <img
          src={image}
          alt={title}
          width={1600}
          height={1000}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="hero-scrim absolute inset-0" />
        <div className="relative z-10 flex flex-col items-center justify-center px-5 py-12 sm:px-10 sm:py-16 text-center">
          <p className="eyebrow !text-[#f5c857] text-shadow-dark tracking-widest font-bold">{eyebrow}</p>
          <h1 className="display-lg mt-3 max-w-3xl !text-white font-bold hero-title-shadow text-shadow-glow tracking-wide">{title}</h1>
          <div className="gold-rule mt-4 w-28 mx-auto shadow-lg" />
          <p className="mt-4 max-w-2xl text-sm leading-relaxed !text-white drop-shadow-md font-medium sm:text-base">
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
  containerClassName = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`w-full px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16 ${className}`}>
      <div className={`mx-auto max-w-[var(--content-max)] ${containerClassName}`}>{children}</div>
    </section>
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
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl text-start"}>
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
  to,
  actionLabel,
}: {
  title: string;
  body: string;
  meta?: string;
  to?: string;
  actionLabel?: string;
}) {
  const content = (
    <>
      {meta && <p className="eyebrow">{meta}</p>}
      <h3 className="mt-2 font-display text-xl text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors">
        {title}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--muted-foreground)]">{body}</p>
      {to && actionLabel && (
        <div className="mt-4 pt-3 border-t border-[var(--gold)]/20">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[var(--gold)] group-hover:text-[var(--primary)] group-hover:underline transition-colors">
            {actionLabel}
          </span>
        </div>
      )}
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        className="surface-card group flex h-full flex-col p-5 sm:p-6 text-start transition-transform hover:-translate-y-1 hover:border-[var(--gold)]/60"
      >
        {content}
      </Link>
    );
  }

  return (
    <article className="surface-card group flex h-full flex-col p-5 sm:p-6 text-start transition-transform hover:-translate-y-1">
      {content}
    </article>
  );
}
