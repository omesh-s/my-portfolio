"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import { motion } from "framer-motion";

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
  external,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
  external?: boolean;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors";
  const variants: Record<typeof variant, string> = {
    primary:
      "bg-foreground text-background hover:bg-[#d9dde6] focus-visible:focus-ring",
    ghost:
      "border border-faint bg-transparent hover:bg-white/5 focus-visible:focus-ring",
  };

  const props = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <motion.div whileHover={{ y: -1 }} whileTap={{ y: 0 }}>
      <Link href={href} {...props} className={cn(base, variants[variant], className)}>
        {children}
      </Link>
    </motion.div>
  );
}

