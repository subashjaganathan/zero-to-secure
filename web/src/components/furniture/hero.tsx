import { component$, useContext } from "@builder.io/qwik";

import Icon from "~/components/core/icon";
import { ChecklistContext } from "~/store/checklist-context";
import type { Section } from "~/types/PSC";
import { withBase } from "~/utils/base";
import styles from "./hero.module.css";

export default component$(() => {
  const checklists = useContext(ChecklistContext);

  const sectionCount = checklists.value.length;
  const itemCount = checklists.value.reduce(
    (total: number, section: Section) => total + section.checklist.length,
    0,
  );
  const essentialCount = checklists.value.reduce(
    (total: number, section: Section) =>
      total + section.checklist.filter((item) => item.priority.toLowerCase() === 'essential').length,
    0,
  );

  const stats = [
    { value: itemCount, label: 'Checks' },
    { value: sectionCount, label: 'Areas' },
    { value: essentialCount, label: 'Essentials' },
  ];

  return (
    <div class="mx-auto xl:max-w-7xl max-w-6xl w-full xl:px-10 mb-10">
      <div class={['relative overflow-hidden lg:rounded-3xl', styles.hero]}>

        {/* Decorative backdrop: a soft grid with two colour washes over it.
            Inline SVG so it ships with the page and needs no network request. */}
        <svg
          class={styles.grid}
          aria-hidden="true"
          width="100%"
          height="100%"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern id="hero-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M48 0H0V48" fill="none" stroke="currentColor" stroke-width="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
        <div class={[styles.glow, styles.glowOne]} aria-hidden="true"></div>
        <div class={[styles.glow, styles.glowTwo]} aria-hidden="true"></div>

        <div class="relative px-6 py-16 sm:py-20 flex flex-col items-center text-center">

          <div class={['mb-6', styles.badge]}>
            <span class={styles.pulse} aria-hidden="true"></span>
            Free · Open source · Nothing leaves your browser
          </div>

          <h1 class="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05]">
            <span class={styles.title}>Zero to Secure</span>
          </h1>

          <p class="mt-5 text-lg sm:text-xl max-w-2xl opacity-80">
            Practical digital security, one step at a time. Work through
            {' '}{itemCount} plain-English checks and see exactly where you stand.
          </p>

          <div class="flex flex-wrap gap-3 justify-center mt-9">
            <a href={withBase("/checklist/getting-started")}>
              <button class={['btn btn-lg border-0 text-white', styles.cta]}>
                <Icon icon="compass" width={20} height={20} />
                Start here
              </button>
            </a>
            <a href={withBase("/checklist")}>
              <button class={['btn btn-lg', styles.ctaGhost]}>
                <Icon icon="all" width={20} height={20} />
                Browse all {sectionCount} areas
              </button>
            </a>
          </div>

          <dl class="flex flex-wrap gap-3 justify-center mt-12 w-full">
            {stats.map((stat) => (
              <div key={stat.label} class={styles.stat}>
                <dt class={styles.statValue}>{stat.value}</dt>
                <dd class="text-xs uppercase tracking-widest opacity-60 mt-1">{stat.label}</dd>
              </div>
            ))}
          </dl>

        </div>
      </div>
    </div>
  );
});
