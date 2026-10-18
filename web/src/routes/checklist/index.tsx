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
    <div class="mx-auto w-full max-w-4xl px-6 pt-10">
      <h1 class="text-3xl font-bold tracking-tight">All checklists</h1>
      <p class="text-base-content/60 mt-2 mb-6">Search every check, or open an area to tick items off.</p>
      <div class="mb-4">
        <label class="input input-bordered border-base-300 flex items-center gap-2" for="checklist-search">
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

      <div class="w-full border-t border-base-300">
        {visibleSections.value.map((section: Section) => (
          <div key={section.slug} class="collapse collapse-arrow rounded-none border-b border-base-300">
            <input type="radio" name="my-accordion-3" aria-label={`Expand ${section.title}`} checked={!!query.value.trim()} />
            <div class="collapse-title flex items-center gap-3 pl-1 pr-12">
              <Icon icon={section.icon || 'star'} width={16} height={16} class="opacity-70" />
              <h2 class="text-base font-semibold">{section.title}</h2>
              <span class="text-sm text-base-content/60 ml-auto tabular-nums">{section.checklist.length}</span>
            </div>
            <div class="collapse-content px-1">
              {
                section.checklist.map((item) => {
                  const pointId = generatePointId(section.slug, item.point);
                  return (
                  <div key={pointId} class="py-1.5">
                    <label class="flex items-start gap-3 cursor-pointer" for={`check-${pointId}`}>
                      <input
                        class="checkbox checkbox-sm checkbox-primary rounded mt-0.5"
                        id={`check-${pointId}`}
                        type="checkbox"
                        checked={completed.value[pointId] || false}
                        onClick$={() => {
                          const data = completed.value;
                          data[pointId] = !data[pointId];
                          setCompleted(data);
                        }}
                      />
                      <span class="text-sm">{item.point}</span>
                    </label>
                  </div>
                )
              })
              }
              <div class="pt-3 pb-2">
                <a href={withBase(`/checklist/${section.slug}`)} class="btn btn-sm btn-primary">
                  Open {section.title} →
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!visibleSections.value.length && (
        <p class="text-center opacity-70 my-8">No checklist items match “{query.value}”.</p>
      )}
    </div>
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
