import { $, component$, useStore, useSignal } from "@builder.io/qwik";
import { useCSSTransition } from "qwik-transition";

import Icon from "~/components/core/icon";
import type { Section, Checklist } from '../../types/PSC';
import { useLocalStorage } from "~/hooks/useLocalStorage";
import { generatePointId, parseMarkdown } from "~/utils/checklist";
import styles from './psc.module.css';


/*
 * Kept at module scope so it is serializable: resetFilters runs inside a $()
 * closure, which can capture a plain object but not a factory function.
 */
const DEFAULT_FILTERS = {
  show: 'all', // 'all', 'remaining', 'completed'
  levels: {
    essential: true,
    optional: true,
    advanced: true,
  },
};

export default component$((props: { section: Section }) => {

  const [completed, setCompleted] = useLocalStorage('PSC_PROGRESS', {});
  const [ignored, setIgnored] = useLocalStorage('PSC_IGNORED', {});

  const showFilters = useSignal(false);
  const { stage } = useCSSTransition(showFilters, { timeout: 300 });

  const sortState = useStore({ column: '', ascending: true });

  const checklist = useSignal<Checklist[]>(props.section.checklist);

  const originalFilters = { ...DEFAULT_FILTERS, levels: { ...DEFAULT_FILTERS.levels } };

  // A fresh copy, so mutating the filters never rewrites the defaults
  const filterState = useStore(
    { ...DEFAULT_FILTERS, levels: { ...DEFAULT_FILTERS.levels } },
    { deep: true },
  );

  const generateId = (title: string) => generatePointId(props.section.slug, title);

  const isIgnored = (pointId: string) => {
    return ignored.value[pointId] || false;
  };
  

  const isChecked = (pointId: string) => {
    if (isIgnored(pointId)) return false;
    return completed.value[pointId] || false;
  };

  const filteredChecklist = checklist.value.filter((item) => {
    const itemId = generateId(item.point);
    const itemCompleted = isChecked(itemId);
    const itemIgnored = isIgnored(itemId);
    const itemLevel = item.priority;

    // Filter by completion status
    if (filterState.show === 'remaining' && (itemCompleted || itemIgnored)) return false;
    if (filterState.show === 'completed' && !itemCompleted) return false;

    // Filter by level. An unrecognised priority shows the row rather than
    // silently hiding an item the user can then never tick off.
    const levels: Record<string, boolean | undefined> = filterState.levels;
    return levels[itemLevel.toLocaleLowerCase()] ?? true;
  });

  const sortChecklist = (a: Checklist, b: Checklist) => {
    const getValue = (item: Checklist) => {
      switch (sortState.column) {
        case 'done':
          if (isIgnored(generateId(item.point))) {
            return 2;
          }
          return isChecked(generateId(item.point)) ? 0 : 1;
        case 'advice':
          return item.point;
        case 'level':
          return ['essential', 'optional', 'advanced'].indexOf(item.priority.toLowerCase());
        default:
          return 0;
      }
    };
    const valueA = getValue(a);
    const valueB = getValue(b);

    if (valueA === valueB) {
      return 0;
    } else if (sortState.ascending) {
      return valueA < valueB ? -1 : 1;
    } else {
      return valueA > valueB ? -1 : 1;
    }
  };

  const handleSort = $((column: string) => {
    if (sortState.column === column) { // Reverse direction if same column
      sortState.ascending = !sortState.ascending;
    } else { // Sort table by column
      sortState.column = column;
      sortState.ascending = true; // Default to ascending
    }
  });

  const resetFilters = $(() => {
    checklist.value = props.section.checklist;
    sortState.column = '';
    sortState.ascending = true;
    filterState.levels = { ...DEFAULT_FILTERS.levels };
    filterState.show = DEFAULT_FILTERS.show;
  });

  const calculateProgress = (): { done: number, total: number, percent: number, disabled: number} => {
    let done = 0;
    let disabled = 0;
    let total = 0;

    props.section.checklist.forEach((item) => {
      const itemId = generateId(item.point);
      if (isIgnored(itemId)) {
        disabled += 1;
      } else if (isChecked(itemId)) {
        done += 1;
        total += 1;
      } else {
        total += 1;
      }
    });

    const percent = total > 0 ? Math.round((done / total) * 100) : 0;
    return { done, total: props.section.checklist.length, percent, disabled };
  };

  const { done, total, percent, disabled } = calculateProgress();

  return (
    <>

    <div class="flex flex-wrap justify-between items-end gap-4 pb-4">
      <div class="min-w-[14rem] flex-1 max-w-sm">
        <p class="text-sm text-base-content/70 mb-2 tabular-nums">
          <span class="font-semibold text-base-content">{percent}%</span>
          {' '}· {done} of {total} done{disabled ? `, ${disabled} ignored` : ''}
        </p>
        <div class={styles.track}>
          <span class={[styles.trackFill, 'bg-primary']} style={`width: ${percent}%;`}></span>
        </div>
      </div>

      <div class="flex flex-wrap gap-2 justify-end">
        {(sortState.column || JSON.stringify(filterState) !== JSON.stringify(originalFilters)) && (
          <button class="btn btn-sm btn-ghost border border-base-300 font-normal" onClick$={resetFilters}>
            <Icon width={18} height={16} icon="clear"/>
            Reset Filters
          </button>
        )}
        <button class="btn btn-sm btn-ghost border border-base-300 font-normal" onClick$={() => { showFilters.value = !showFilters.value; }}>
          <Icon width={18} height={16} icon="filters"/>
          {showFilters.value ? 'Hide' : 'Show'} Filters
        </button>
      </div>
    </div>

    {showFilters.value && (
      <div class="flex flex-wrap justify-between gap-2 border border-base-300 rounded-lg px-4 py-1 mb-4 transition-all"
        style={{ opacity: stage.value === "enterTo" ? 1 : 0, height: stage.value === "enterTo" ? 'auto' : 0 }}> 
        {/* Filter by completion */}
        <div class="flex justify-end items-center gap-1">
          <p class="font-bold text-sm">Show</p>
          <label onClick$={() => (filterState.show = 'all')}
            class="p-2 rounded hover:bg-base-200 transition-all cursor-pointer flex gap-2">
            <span class="text-sm">All</span> 
            <input type="radio" name="show" class="radio radio-sm radio-primary" checked />
          </label>
          <label onClick$={() => (filterState.show = 'remaining')}
            class="p-2 rounded hover:bg-base-200 transition-all cursor-pointer flex gap-2">
            <span class="text-sm">Remaining</span> 
            <input type="radio" name="show" class="radio radio-sm radio-primary" />
          </label>
          <label onClick$={() => (filterState.show = 'completed')}
            class="p-2 rounded hover:bg-base-200 transition-all cursor-pointer flex gap-2">
            <span class="text-sm">Completed</span> 
            <input type="radio" name="show" class="radio radio-sm radio-primary" />
          </label>
        </div>
        {/* Filter by level */}
        <div class="flex justify-end items-center gap-1">
          <p class="font-bold text-sm">Filter</p>
          <label class="p-2 rounded hover:bg-base-200 transition-all cursor-pointer flex gap-2">
            <span class="text-sm">Essential</span> 
            <input
              type="checkbox"
              checked={filterState.levels.essential}
              onChange$={() => (filterState.levels.essential = !filterState.levels.essential)}
              class="checkbox checkbox-sm checkbox-primary"
            />
          </label>
          <label class="p-2 rounded hover:bg-base-200 transition-all cursor-pointer flex gap-2">
            <span class="text-sm">Optional</span> 
            <input
              type="checkbox"
              checked={filterState.levels.optional}
              onChange$={() => (filterState.levels.optional = !filterState.levels.optional)}
              class="checkbox checkbox-sm checkbox-primary"
            />
          </label>
          <label
            class="p-2 rounded hover:bg-base-200 transition-all cursor-pointer flex gap-2">
            <span class="text-sm">Advanced</span> 
            <input
              type="checkbox"
              checked={filterState.levels.advanced}
              class="checkbox checkbox-sm checkbox-primary"
              onChange$={() => (filterState.levels.advanced = !filterState.levels.advanced)}
            />
          </label>
        </div>
      </div>
    )}

    <table class={`table ${styles.checklistTable}`}>
      <thead>
        <tr>
          { [
            { id: 'done', text: 'Done?'},
            { id: 'advice', text: 'Advice' },
            { id: 'level', text: 'Level' }
          ].map((item) => (
            <th
              key={item.id}
              class="cursor-pointer"
              onClick$={() => handleSort(item.id)}
            >
              <span class="flex items-center gap-0.5 hover:text-primary transition">
                <Icon width={12} height={14} icon="sort" />
                {item.text}
              </span>
            </th>
          ))}
          <th>Details</th>
        </tr>
      </thead>
      <tbody>
        {filteredChecklist.sort(sortChecklist).map((item, index) => {
          const itemId = generateId(item.point);
          const isItemCompleted = isChecked(itemId);
          const isItemIgnored = isIgnored(itemId);
          return (
            <tr key={index} class={[
              'hover:bg-base-200/60 transition-colors',
              isItemCompleted ? styles.rowDone : '',
              isItemIgnored ? styles.rowIgnored : '',
              ]}>
              <td class="text-center">
                <input
                  type="checkbox"
                  class="checkbox checkbox-sm checkbox-primary rounded"
                  id={`done-${itemId}`}
                  checked={isChecked(itemId)}
                  disabled={isIgnored(itemId)}
                  onClick$={() => {
                    const data = completed.value;
                    data[itemId] = !data[itemId];
                    setCompleted(data);
                  }}
                />
                <label for={`ignore-${itemId}`} class="text-xs block text-base-content/60 mt-3 mb-1">Ignore</label>
                <input
                  type="checkbox"
                  id={`ignore-${itemId}`}
                  class="toggle toggle-xs"
                  checked={isIgnored(itemId)}
                  onClick$={() => {
                    const ignoredData = ignored.value;
                    ignoredData[itemId] = !ignoredData[itemId];
                    setIgnored(ignoredData);

                    const completedData = completed.value;
                    completedData[itemId] = false;
                    setCompleted(completedData);
                  }}
                />
              </td>
              <td>
                <label
                  for={`done-${itemId}`}
                  class={`text-[0.95rem] font-medium leading-snug ${isIgnored(itemId) ? 'line-through' : 'cursor-pointer'}`}>
                  {item.point}
                </label>
              </td>
              <td>
                <span class={[styles.level, styles[item.priority.toLowerCase()]]}>
                  {item.priority.charAt(0).toUpperCase() + item.priority.slice(1).toLowerCase()}
                </span>
              </td>
              <td class={styles.checklistItemDescription} dangerouslySetInnerHTML={parseMarkdown(item.details)}></td>
            </tr>
          )}
        )}
      </tbody>
    </table>
    </>
  );
});
