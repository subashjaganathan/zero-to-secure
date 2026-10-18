import { component$, useContext } from "@builder.io/qwik";

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
    <section class={styles.hero}>
      <div class={styles.inner}>
        <p class={styles.eyebrow}>Personal security &amp; privacy checklist</p>

        <h1 class={styles.title}>Zero to Secure</h1>

        <p class={styles.lede}>
          Practical digital security, one step at a time. Work through {itemCount} plain-English
          checks and see exactly where you stand. Free, open source, and nothing leaves your browser.
        </p>

        <div class={styles.actions}>
          <a href={withBase("/checklist/getting-started")} class="btn btn-primary">
            Start here <span aria-hidden="true">→</span>
          </a>
          <a href={withBase("/checklist")} class={['btn', styles.secondary]}>
            Browse all {sectionCount} areas
          </a>
        </div>

        <dl class={styles.stats}>
          {stats.map((stat) => (
            <div key={stat.label} class={styles.stat}>
              <dt class={styles.statLabel}>{stat.label}</dt>
              <dd class={styles.statValue}>{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
});
