import { cn } from "@/lib/cn";

export function Section({
  id,
  eyebrow,
  title,
  children,
  className,
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("py-16 sm:py-20", className)}>
      <div className="container">
        {(eyebrow || title) && (
          <header className="mb-8 sm:mb-10">
            {eyebrow && (
              <p className="text-xs tracking-[0.28em] uppercase text-muted">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight">
                {title}
              </h2>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}

