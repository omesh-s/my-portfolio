import { portfolio } from "@/data/portfolio";
import { Hero } from "@/components/Hero";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { ButtonLink } from "@/components/ButtonLink";
import { ProjectsExpandable } from "@/components/ProjectsExpandable";
import { SkillsGrid } from "@/components/SkillsGrid";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />

      <main className="flex-1">
        <Hero />

        {/* From About → bottom: continuous translucent readability layer */}
        <div className="relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              // No hero band: this starts after <Hero /> and runs to the bottom.
              // Gentle ramp-in at the top so About doesn't feel like a hard switch.
              maskImage:
                "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 14%, rgba(0,0,0,1) 100%)",
              background:
                "linear-gradient(180deg, rgba(7,8,11,0.00) 0%, rgba(7,8,11,0.30) 18%, rgba(7,8,11,0.48) 100%), radial-gradient(1100px 820px at 28% 18%, rgba(7,8,11,0.05), rgba(7,8,11,0.55) 60%, rgba(7,8,11,0.0) 100%)",
            }}
          />

          <div className="relative z-10">
            <Section
              id="about"
              eyebrow="Signal"
              title={portfolio.about.title}
              className="mt-2"
            >
              <div className="grid gap-10 lg:grid-cols-2">
                <Reveal variant="clip">
                  <div className="space-y-4 text-muted">
                    {portfolio.about.paragraphs.map((p) => (
                      <p key={p} className="leading-7">
                        {p}
                      </p>
                    ))}
                  </div>
                </Reveal>

                <Reveal delay={0.05} variant="fadeUp">
                  <div className="rounded-[28px] border border-faint bg-white/[0.035] p-6 sm:p-7 card">
                    <p className="text-sm font-medium tracking-tight">
                      What I optimize for
                    </p>
                    <ul className="mt-4 space-y-3 text-sm text-muted">
                      {portfolio.about.bullets.map((b) => (
                        <li key={b} className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[rgba(140,180,255,0.75)] shadow-[0_0_20px_rgba(140,180,255,0.25)]" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              </div>
            </Section>

            <Section id="projects" eyebrow="Selected" title={portfolio.projects.title}>
              <Reveal variant="fadeUp">
                <ProjectsExpandable />
              </Reveal>
            </Section>

            <Section id="stack" eyebrow="Tools" title={portfolio.skills.title}>
              <Reveal variant="fadeUp">
                <SkillsGrid />
              </Reveal>
            </Section>

            <Section
              id="experience"
              eyebrow="Trajectory"
              title={portfolio.timeline.title}
            >
              <div className="grid gap-4 lg:grid-cols-2">
                {portfolio.timeline.items.map((item, idx) => (
                  <Reveal key={item.title} delay={idx * 0.05} variant="fadeUp">
                    <div className="rounded-[28px] border border-faint bg-white/[0.035] p-6 sm:p-7 card">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <div>
                          <p className="text-base font-semibold tracking-tight">
                            {item.title}
                          </p>
                          <p className="mt-1 text-sm text-muted">{item.org}</p>
                        </div>
                        <p className="font-mono text-xs tracking-wider text-muted">
                          {item.date}
                        </p>
                      </div>
                      <ul className="mt-5 space-y-2 text-sm text-muted">
                        {item.details.map((d) => (
                          <li key={d} className="flex gap-3">
                            <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[rgba(140,180,255,0.6)]" />
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>
                ))}
              </div>
            </Section>

            <Section id="contact" eyebrow="Reach out" title="Contact">
              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <Reveal variant="clip">
                  <div className="rounded-[28px] border border-faint bg-white/[0.035] p-6 sm:p-7 card">
                    <p className="text-base font-semibold tracking-tight">
                      Let’s build something that feels inevitable.
                    </p>
                    <p className="mt-3 text-sm leading-6 text-muted">
                      If you’re hiring, collaborating, or want feedback on an
                      interface you’re polishing — I’m happy to chat.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <ButtonLink href={`mailto:${portfolio.contact.email}`}>
                        Email me
                      </ButtonLink>
                      {portfolio.contact.calendly ? (
                        <ButtonLink
                          href={portfolio.contact.calendly}
                          variant="ghost"
                          external
                        >
                          Schedule
                        </ButtonLink>
                      ) : (
                        <ButtonLink href="#projects" variant="ghost">
                          See projects
                        </ButtonLink>
                      )}
                    </div>
                  </div>
                </Reveal>

                <Reveal delay={0.05} variant="fadeUp">
                  <div className="rounded-[28px] border border-faint bg-white/[0.035] p-6 sm:p-7 card">
                    <p className="text-sm font-semibold tracking-tight">Socials</p>
                    <div className="mt-4 grid gap-2">
                      {portfolio.socials.map((s) => (
                        <a
                          key={s.label}
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group rounded-2xl border border-faint bg-white/5 px-4 py-3 text-sm text-muted hover:bg-white/10 hover:text-foreground focus-visible:focus-ring"
                        >
                          <span className="font-medium">{s.label}</span>{" "}
                          <span className="font-mono text-xs opacity-70 group-hover:opacity-100">
                            ↗
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                </Reveal>
              </div>
            </Section>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
