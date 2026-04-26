"use client";

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

let registered = false;

export function ensureGsap() {
  if (registered) return gsap;
  if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
  return gsap;
}

export { ScrollTrigger };

