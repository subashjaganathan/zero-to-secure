import { component$ } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';

import Icon from '~/components/core/icon';
import { withBase } from '~/utils/base';

export default component$(() => {
  return (
    <div class="flex flex-col items-center justify-center text-center px-6 py-24">
      <p class="text-7xl font-extrabold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
        404
      </p>
      <h1 class="text-2xl font-bold mt-2">Page not found</h1>
      <p class="opacity-70 mt-2 max-w-md">
        That checklist doesn't exist. It may have been renamed or moved.
      </p>
      <div class="flex flex-wrap gap-3 justify-center mt-8">
        <a href={withBase('/')}>
          <button class="btn btn-primary">
            <Icon icon="homepage" width={18} height={18} />
            Back to home
          </button>
        </a>
        <a href={withBase('/checklist')}>
          <button class="btn btn-outline">
            <Icon icon="all" width={18} height={18} />
            Browse all checklists
          </button>
        </a>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Page not found · Zero to Secure',
};
