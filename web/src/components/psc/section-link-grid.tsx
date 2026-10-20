import { $, component$, useContext, useOnWindow, useSignal } from "@builder.io/qwik";

import { useLocalStorage } from "~/hooks/useLocalStorage";
import { ChecklistContext } from '~/store/checklist-context';
import type { Checklist, Section } from '~/types/PSC';
import Icon from '~/components/core/icon';
import { withBase } from '~/utils/base';
import { generatePointId } from '~/utils/checklist';
import styles from './psc.module.css';

export default component$(() => {

  /*
   * Read the sections from context rather than taking them as a prop. The
   * array used to be passed in and then captured by the load handler below,
   * where Qwik resumed it as a signal rather than an array, throwing
   * "sections.map is not a function" on every visit to the homepage.
   */
  const checklists = useContext(ChecklistContext);

  // Percentage complete and number of items done, per section
  const completions = useSignal<number[]>();
  const done = useSignal<number[]>();

  const [checked] = useLocalStorage('PSC_PROGRESS', {});
  const [ignored] = useLocalStorage('PSC_IGNORED', {});

  // On load (in browser only), work out completion for each section,
  // disregarding ignored items
  useOnWindow('load', $(() => {
    const id = (section: Section, item: Checklist) => generatePointId(section.slug, item.point);
    completions.value = checklists.value.map((section: Section) => {
      const total = section.checklist.filter((item) => !ignored.value[id(section, item)]).length;
      const count = section.checklist.filter((item) => checked.value[id(section, item)]).length;
      return total > 0 ? Math.round((count / total) * 100) : 0;
    });
    done.value = checklists.value.map((section: Section) =>
      section.checklist.filter((item) => checked.value[id(section, item)]).length
    );
  }));

  return (
    <section class="mx-auto max-w-6xl w-full px-4 sm:px-6 mt-12">
      <div class="flex items-baseline justify-between mb-4">
        <h2 class={styles.panelTitle}>Areas</h2>
        <a href={withBase('/checklist')} class="text-sm text-base-content/60 hover:text-primary">View all checks →</a>
      </div>
      <div class={[styles.container, 'grid gap-4']}>
        {checklists.value.map((section: Section, index: number) => {
          const percent = completions.value?.[index] || 0;
          const doneCount = done.value?.[index] || 0;
          return (
          <a key={section.slug} href={withBase(`/checklist/${section.slug}`)} class={styles.card} style={`--i: ${index};`}>
            <div class={styles.cardTop}>
              <span class={styles.iconChip}>
                <Icon icon={section.icon || 'star'} width={18} height={18} />
              </span>
              <span class={styles.cardCount}>
                {doneCount ? `${doneCount} / ${section.checklist.length}` : `${section.checklist.length} checks`}
              </span>
            </div>
            <h3 class={styles.cardTitle}>{section.title}</h3>
            <p class={styles.cardDescription}>{section.description}</p>
            <div class={[styles.track, 'mt-auto']} aria-label={`${percent}% complete`}>
              <span class={[styles.trackFill, 'bg-primary']} style={`width: ${percent}%;`}></span>
            </div>
          </a>
          );
        })}
      </div>
    </section>
  );
});
