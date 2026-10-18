import { $, component$, useSignal, useOnWindow, useContext } from "@builder.io/qwik";

import { useLocalStorage } from "~/hooks/useLocalStorage";
import { ChecklistContext } from "~/store/checklist-context";
import type { Section } from '~/types/PSC';
import { generatePointId } from '~/utils/checklist';
import styles from './psc.module.css';

interface Tally { done: number; total: number; }

const LEVELS = [
  { key: 'essential', label: 'Essential', bar: 'bg-success' },
  { key: 'optional', label: 'Optional', bar: 'bg-warning' },
  { key: 'advanced', label: 'Advanced', bar: 'bg-error' },
] as const;

const pct = (t: Tally) => (t.total > 0 ? Math.round((t.done / t.total) * 100) : 0);

/**
 * Client-side progress summary: overall completion plus a bar per priority
 * level. Reads progress from local storage, so it only fills in once the page
 * has loaded in the browser. Ignored items are left out of the totals.
 */
export default component$(() => {
  const checklists = useContext(ChecklistContext);
  const [checkedItems] = useLocalStorage('PSC_PROGRESS', {});
  const [ignoredItems] = useLocalStorage('PSC_IGNORED', {});

  const overall = useSignal<Tally>({ done: 0, total: 0 });
  const levels = useSignal<Partial<Record<string, Tally>>>({});

  useOnWindow('load', $(() => {
    const all: Tally = { done: 0, total: 0 };
    const byLevel: Partial<Record<string, Tally>> = {};
    checklists.value.forEach((section: Section) => {
      section.checklist.forEach((item) => {
        const id = generatePointId(section.slug, item.point);
        if (ignoredItems.value[id]) return;
        const level = item.priority.toLowerCase();
        const tally = (byLevel[level] ??= { done: 0, total: 0 });
        all.total++;
        tally.total++;
        if (checkedItems.value[id]) {
          all.done++;
          tally.done++;
        }
      });
    });
    overall.value = all;
    levels.value = byLevel;
  }));

  const percent = pct(overall.value);

  return (
    <section class="mx-auto max-w-6xl w-full px-4 sm:px-6 mt-10">
      <div class={[styles.panel, styles.progressPanel]}>
        <div>
          <h2 class={styles.panelTitle}>Your progress</h2>
          <p class={styles.bigNumber}>{percent}<span>%</span></p>
          <p class={styles.muted}>
            {overall.value.total
              ? `${overall.value.done} of ${overall.value.total} checks complete`
              : 'Saved only in this browser'}
          </p>
          <div class={[styles.track, 'mt-4']}>
            <span class={[styles.trackFill, 'bg-primary']} style={`width: ${percent}%;`}></span>
          </div>
          {overall.value.total > 0 && overall.value.done === 0 && (
            <p class={[styles.muted, 'mt-4']}>Tick off items in any area below and your progress shows up here.</p>
          )}
        </div>

        <ul class={styles.levels}>
          {LEVELS.map((level) => {
            const tally = levels.value[level.key] ?? { done: 0, total: 0 };
            return (
              <li key={level.key}>
                <div class={styles.levelRow}>
                  <span>{level.label}</span>
                  <span class={styles.muted}>{tally.done} / {tally.total}</span>
                </div>
                <div class={styles.track}>
                  <span class={[styles.trackFill, level.bar]} style={`width: ${pct(tally)}%;`}></span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
});
