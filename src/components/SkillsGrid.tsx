import { TechIcon } from "@/components/TechIcon";
import { portfolio } from "@/data/portfolio";

export function SkillsGrid() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {portfolio.skills.groups.map((group) => (
        <section
          key={group.label}
          className="rounded-[28px] border border-faint bg-white/[0.035] p-6 card"
        >
          <p className="text-sm font-semibold tracking-tight">{group.label}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {group.items.map((item) => (
              <div
                key={item.label}
                className="inline-flex items-center gap-2 rounded-full border border-faint bg-white/5 px-3 py-2 text-sm text-muted"
              >
                {item.icon && <TechIcon name={item.icon} size={16} muted />}
                <span className="text-foreground/85">{item.label}</span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

