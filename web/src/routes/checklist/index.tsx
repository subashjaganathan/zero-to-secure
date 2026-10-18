import { component$, useContext, useSignal, useComputed$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";

import { ChecklistContext } from '~/store/checklist-context';
import { useLocalStorage } from "~/hooks/useLocalStorage";
import { withBase } from '~/utils/base';
import { generatePointId } from '~/utils/checklist';
import Icon from '~/components/core/icon';
import type { Section } from "~/types/PSC";

export default component$(() => {
  const checklists = useContext(ChecklistContext);

  const [completed, setCompleted] = useLocalStorage('PSC_PROGRESS', {});

  const query = useSignal('');

  /**
   * Sections filtered by the search term. A section is kept if its own title
   * matches, or if any of its checklist points or details do, in which case
   * only the matching points are shown.
   */
  const visibleSections = useComputed$(() => {
    const term = query.value.trim().toLowerCase();
    if (!term) return checklists.value;
    return checklists.value.reduce((matches: Section[], section: Section) => {
      const sectionMatches = section.title.toLowerCase().includes(term);
      const items = section.checklist.filter((item) =>
        item.point.toLowerCase().includes(term) ||
        (item.details || '').toLowerCase().includes(term)
      );
      if (sectionMatches || items.length) {
        matches.push({ ...section, checklist: sectionMatches ? section.checklist : items });
      }
      return matches;
    }, []);
  });

  const totalMatches = useComputed$(() =>
    visibleSections.value.reduce((total: number, section: Section) => total + section.checklist.length, 0)
  );

  return (
    <main class="p-8">
      <div class="mx-auto w-full max-w-3xl mb-4">
        <label class="input input-bordered flex items-center gap-2" for="checklist-search">
          <Icon icon="search" width={16} height={16} />
          <input
            id="checklist-search"
            type="search"
            class="grow bg-transparent"
            placeholder="Search all checklist items…"
            value={query.value}
            onInput$={(_, el) => { query.value = el.value; }}
          />
        </label>
        {query.value.trim() && (
          <p class="text-sm opacity-70 mt-2" aria-live="polite">
            {totalMatches.value} matching {totalMatches.value === 1 ? 'item' : 'items'}
            {' '}across {visibleSections.value.length}{' '}
            {visibleSections.value.length === 1 ? 'section' : 'sections'}
          </p>
        )}
      </div>

      <div class="join join-vertical w-full">
        {visibleSections.value.map((section: Section) => (
          <div key={section.slug} class={['collapse collapse-plus bg-base-200 my-4', `border-double border-2 border-${section.color}-400`]}>
            <input type="radio" name="my-accordion-3" aria-label={`Expand ${section.title}`} checked={!!query.value.trim()} />
            <div class={['collapse-title text-xl font-medium']}>
              <h3>{section.title}</h3>
            </div>
            <div class="collapse-content">
              {
                section.checklist.map((item) => {
                  const pointId = generatePointId(section.slug, item.point);
                  return (
                  <div key={pointId} class="flex justify-between">
                    <label class="flex items gap-2" for={`check-${pointId}`}>
                      <input
                        class="checkbox checkbox-sm"
                        id={`check-${pointId}`}
                        type="checkbox"
                        checked={completed.value[pointId] || false}
                        onClick$={() => {
                          const data = completed.value;
                          data[pointId] = !data[pointId];
                          setCompleted(data);
                        }}
                      />
                      <span class="tooltip tooltip-bottom" data-tip={item.details}>{item.point}</span>
                    </label>
                  </div>
                )
              })
              }
              <div class="card-actions justify-end">
                <a href={withBase(`/checklist/${section.slug}`)}>
                  <button class={`btn text-base-100 bg-${section.color}-400 hover:bg-${section.color}-600`}>
                    View Full Checklist ➜
                  </button>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!visibleSections.value.length && (
        <p class="text-center opacity-70 my-8">No checklist items match “{query.value}”.</p>
      )}
    </main>
  );
});

export const head: DocumentHead = {
  title: "All Checklists · Zero to Secure",
  meta: [
    {
      name: "description",
      content: "Browse and search every check across all 15 areas of digital security and privacy.",
    },
  ],
};
