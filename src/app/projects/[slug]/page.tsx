import { portfolio } from "@/data/portfolio";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";

export function generateStaticParams() {
  return portfolio.projects.items.map((p) => ({ slug: p.slug }));
}

export default function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = portfolio.projects.items.find((p) => p.slug === params.slug);
  if (!project) return notFound();

  const live = (project.links as { live?: string }).live;
  const caseStudy = (project.links as { caseStudy?: string }).caseStudy;
  const repo = (project.links as { repo?: string }).repo;

  return (
    <main className="min-h-[calc(100vh-72px)]">
      <section className="py-12 sm:py-16">
        <div className="container">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/#projects"
              className="rounded-full border border-faint bg-white/5 px-4 py-2 text-sm text-muted hover:bg-white/10 hover:text-foreground focus-visible:focus-ring"
            >
              ← Back
            </Link>
            <p className="font-mono text-xs tracking-[0.22em] text-muted">
              PROJECT / {project.slug.toUpperCase()}
            </p>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <Reveal variant="clip">
              <div>
                <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.02]">
                  {project.title}
                </h1>
                <p className="mt-5 text-base sm:text-lg leading-7 text-muted">
                  {project.longform?.summary ?? project.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {project.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-faint bg-white/5 px-3 py-1.5 text-sm text-muted"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.05} variant="fadeUp">
              <div className="rounded-[28px] border border-faint bg-white/[0.035] p-6 card">
                <p className="text-sm font-semibold tracking-tight">Links</p>
                <div className="mt-4 grid gap-2">
                  {live && (
                    <a
                      href={live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-2xl border border-faint bg-white/5 px-4 py-3 text-sm text-muted hover:bg-white/10 hover:text-foreground focus-visible:focus-ring"
                    >
                      Live ↗
                    </a>
                  )}
                  {repo && (
                    <a
                      href={repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-2xl border border-faint bg-white/5 px-4 py-3 text-sm text-muted hover:bg-white/10 hover:text-foreground focus-visible:focus-ring"
                    >
                      GitHub ↗
                    </a>
                  )}
                  {caseStudy && (
                    <a
                      href={caseStudy}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-2xl border border-faint bg-white/5 px-4 py-3 text-sm text-muted hover:bg-white/10 hover:text-foreground focus-visible:focus-ring"
                    >
                      Case study ↗
                    </a>
                  )}
                </div>

                {!live && !repo && !caseStudy && (
                  <p className="mt-4 text-sm text-muted">
                    Links will be added soon.
                  </p>
                )}
              </div>
            </Reveal>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            <Reveal delay={0.02} variant="fadeUp">
              <article className="rounded-[28px] border border-faint bg-white/[0.035] p-6 card">
                <p className="font-mono text-[11px] tracking-[0.22em] text-muted">
                  PROBLEM / GOAL
                </p>
                <p className="mt-4 text-sm leading-6 text-muted">
                  {project.detail?.problemOrGoal ??
                    (project.longform?.sections?.[0]?.body ?? project.description)}
                </p>
              </article>
            </Reveal>

            <Reveal delay={0.06} variant="fadeUp">
              <article className="rounded-[28px] border border-faint bg-white/[0.035] p-6 card">
                <p className="font-mono text-[11px] tracking-[0.22em] text-muted">
                  WHAT I BUILT
                </p>
                <ul className="mt-4 space-y-2 text-sm text-muted">
                  {(project.detail?.whatIBuilt ?? []).map((x) => (
                    <li key={x} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-white/35" />
                      <span>{x}</span>
                    </li>
                  ))}
                  {!project.detail?.whatIBuilt?.length && (
                    <li className="text-sm text-muted">
                      Details will be expanded soon.
                    </li>
                  )}
                </ul>
              </article>
            </Reveal>

            <Reveal delay={0.10} variant="fadeUp">
              <article className="rounded-[28px] border border-faint bg-white/[0.035] p-6 card">
                <p className="font-mono text-[11px] tracking-[0.22em] text-muted">
                  TECHNICAL HIGHLIGHTS
                </p>
                <ul className="mt-4 space-y-2 text-sm text-muted">
                  {(project.detail?.technicalDecisions ?? project.highlights ?? []).map(
                    (x) => (
                      <li key={x} className="flex gap-3">
                        <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[rgba(165,90,255,0.55)]" />
                        <span>{x}</span>
                      </li>
                    )
                  )}
                </ul>
              </article>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}

