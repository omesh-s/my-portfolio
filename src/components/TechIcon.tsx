import {
  siReact,
  siNextdotjs,
  siTypescript,
  siJavascript,
  siTailwindcss,
  siGreensock,
  siFramer,
  siNodedotjs,
  siPython,
  siOpenjdk,
  siCplusplus,
  siC,
  siDotnet,
  siSwift,
  siHtml5,
  siCss,
  siFastapi,
  siFlask,
  siSpringboot,
  siPostgresql,
  siMysql,
  siSqlite,
  siDocker,
  siGit,
  siGithub,
  siLinux,
  siGooglecloud,
  siFigma,
  siTensorflow,
  siScikitlearn,
  siOpencv,
  siJupyter,
} from "simple-icons/icons";

type IconDef = { title: string; path: string; hex: string };

const ICONS: Record<string, IconDef> = {
  react: siReact,
  nextjs: siNextdotjs,
  typescript: siTypescript,
  javascript: siJavascript,
  tailwind: siTailwindcss,
  gsap: siGreensock,
  framermotion: siFramer,
  nodejs: siNodedotjs,

  python: siPython,
  java: siOpenjdk,
  cpp: siCplusplus,
  c: siC,
  csharp: siDotnet,
  swift: siSwift,
  html: siHtml5,
  css: siCss,

  fastapi: siFastapi,
  flask: siFlask,
  spring: siSpringboot,

  postgres: siPostgresql,
  mysql: siMysql,
  sqlite: siSqlite,

  tensorflow: siTensorflow,
  scikitlearn: siScikitlearn,
  opencv: siOpencv,
  jupyter: siJupyter,

  docker: siDocker,
  git: siGit,
  github: siGithub,
  linux: siLinux,
  gcp: siGooglecloud,
  figma: siFigma,
};

export function TechIcon({
  name,
  size = 18,
  muted = false,
}: {
  name: string;
  size?: number;
  muted?: boolean;
}) {
  if (name === "sql") {
    return (
      <span
        aria-hidden="true"
        className="inline-flex h-[18px] items-center rounded-md border border-faint bg-white/5 px-1.5 font-mono text-[10px] tracking-wider text-foreground/80"
      >
        SQL
      </span>
    );
  }
  if (name === "vscode") {
    return (
      <span
        aria-hidden="true"
        className="inline-flex h-[18px] items-center rounded-md border border-faint bg-white/5 px-1.5 font-mono text-[10px] tracking-wider text-foreground/80"
      >
        VS
      </span>
    );
  }
  if (name === "aws") {
    return (
      <span
        aria-hidden="true"
        className="inline-flex h-[18px] items-center rounded-md border border-faint bg-white/5 px-1.5 font-mono text-[10px] tracking-wider text-foreground/80"
      >
        AWS
      </span>
    );
  }
  const icon = ICONS[name];
  if (!icon) return null;
  const fill = muted ? "rgba(231,233,238,0.78)" : `#${icon.hex}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className="shrink-0"
    >
      <path d={icon.path} fill={fill} />
    </svg>
  );
}

