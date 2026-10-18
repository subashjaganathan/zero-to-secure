import { component$, useContext } from '@builder.io/qwik';
import { useLocation, type DocumentHead, type StaticGenerateHandler } from '@builder.io/qwik-city';

import Icon from '~/components/core/icon';
import { ChecklistContext } from '~/store/checklist-context';
import { parseMarkdown } from '~/utils/checklist';
import type { Section } from "~/types/PSC";
import Table from '~/components/psc/checklist-table';
import styles from './section.module.css';
import { useChecklists } from '~/routes/layout';

export default component$(() => {

  const checklists = useContext(ChecklistContext);

  const loc = useLocation();
  const slug = loc.params.title;

  const section: Section | undefined = (checklists.value)
    .find((item: Section) => item.slug === slug);

  return (
    <div class="md:my-8 md:px-16 sm:px-2 rounded-md">
    <article class="bg-back p-8 mx-auto w-full max-w-[1200px] rounded-lg shadow-md">
      {/* Coloured masthead, tinted with the section's own accent so each area
          is visually distinct as you move between them */}
      <header class={[styles.masthead, `bg-${section?.color}-400`]}>
        <span class={[styles.mastheadWash, `bg-${section?.color}-400`]} aria-hidden="true"></span>
        <div class={[styles.mastheadIcon, `text-${section?.color}-400`]}>
          <Icon height={30} width={30} icon={section?.icon || 'star'} />
        </div>
        <div class="min-w-0">
          <p class={styles.eyebrow}>
            {section?.checklist.length} checks · Zero to Secure
          </p>
          <h1 class={['text-4xl sm:text-5xl font-extrabold capitalize', styles.mastheadTitle]}>
            {section?.title}
          </h1>
        </div>
      </header>

      <p class="py-4 text-lg opacity-80" dangerouslySetInnerHTML={parseMarkdown(section?.intro)}></p>

      <div class="overflow-x-auto">
        {section && (<Table section={section} />)}
      </div>

      {section && section.softwareLinks && (
        <>
        <div class="divider my-4">Useful Links</div>
        <h3 class="text-xl my-2">Recommended Software</h3>
          <ul class="list-disc pl-4">
          {section.softwareLinks.map((link, index) => (
            <li key={index}>
              <a class="link link-primary" href={link.url} title={link.description}>{link.title}</a>
            </li>
          ))}
          </ul>
        </>
      )}

    </article>
    </div>
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

