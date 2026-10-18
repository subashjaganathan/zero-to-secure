import { component$, useContext } from '@builder.io/qwik';
import { useLocation, type DocumentHead, type StaticGenerateHandler } from '@builder.io/qwik-city';

import Icon from '~/components/core/icon';
import { ChecklistContext } from '~/store/checklist-context';
import { parseMarkdown } from '~/utils/checklist';
import type { Section } from "~/types/PSC";
import Table from '~/components/psc/checklist-table';
import styles from './section.module.css';
import { useChecklists } from '~/routes/layout';
import { withBase } from '~/utils/base';

export default component$(() => {

  const checklists = useContext(ChecklistContext);

  const loc = useLocation();
  const slug = loc.params.title;

  const section: Section | undefined = (checklists.value)
    .find((item: Section) => item.slug === slug);

  return (
    <article class={styles.page}>
      <nav class={styles.crumbs} aria-label="Breadcrumb">
        <a href={withBase('/')}>Home</a>
        <span class="mx-2" aria-hidden="true">/</span>
        <a href={withBase('/checklist')}>Checklists</a>
        <span class="mx-2" aria-hidden="true">/</span>
        <span class="text-base-content">{section?.title}</span>
      </nav>

      <header class={styles.masthead}>
        <div class={styles.mastheadIcon}>
          <Icon height={22} width={22} icon={section?.icon || 'star'} />
        </div>
        <div class="min-w-0">
          <h1 class={styles.mastheadTitle}>{section?.title}</h1>
          <p class={styles.eyebrow}>{section?.checklist.length} checks</p>
        </div>
      </header>

      <div class={styles.intro} dangerouslySetInnerHTML={parseMarkdown(section?.intro)}></div>

      {section && (<Table section={section} />)}

      {section && section.softwareLinks && (
        <section class="mt-12 pt-8 border-t border-base-300">
          <h2 class="text-lg mb-3">Recommended software</h2>
          <ul class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {section.softwareLinks.map((link, index) => (
            <li key={index}>
              <a class="block rounded-lg border border-base-300 px-4 py-3 hover:bg-base-200 transition-colors" href={link.url}>
                <span class="font-medium">{link.title}</span>
                {link.description && (<span class="block text-sm text-base-content/60 mt-0.5">{link.description}</span>)}
              </a>
            </li>
          ))}
          </ul>
        </section>
      )}
    </article>
  );
});

/*
 * Each section gets its own title, description and canonical URL. Without this
 * all section pages inherited the same generic head and competed with one
 * another in search results.
 */
export const head: DocumentHead = ({ resolveValue, params }) => {
  const sections = resolveValue(useChecklists);
  const section = sections.find((item: Section) => item.slug === params.title);
  return {
    title: `${section?.title || 'Checklist'} · Zero to Secure`,
    meta: [
      {
        name: 'description',
        content: section?.description || 'A digital security and privacy checklist.',
      },
      { property: 'og:title', content: `${section?.title || 'Checklist'} · Zero to Secure` },
      { property: 'og:description', content: section?.description || '' },
    ],
  };
};

// Enumerate every checklist section slug so each page is pre-rendered at build time
export const onStaticGenerate: StaticGenerateHandler = async () => {
  const { readFileSync } = await import('node:fs');
  const { join } = await import('node:path');
  const jsyaml = (await import('js-yaml')).default;
  const filePath = join(process.cwd(), '..', 'personal-security-checklist.yml');
  const sections = jsyaml.load(readFileSync(filePath, 'utf-8')) as Array<{ slug: string }>;
  return {
    params: sections.map((section) => ({ title: section.slug })),
  };
};

