import { component$ } from "@builder.io/qwik";

export default component$(() => {

  const ghLink = 'https://github.com/subashjaganathan/zero-to-secure';
  const authorLink = 'https://subashjaganathan.github.io';

  return (
  <footer class="mt-16 border-t border-base-300">
    <div class="mx-auto max-w-6xl px-6 py-6 flex flex-wrap gap-x-6 gap-y-2 justify-between text-sm text-base-content/60">
      <p>
        Built &amp; maintained by{' '}
        <a href={authorLink} class="text-base-content hover:text-primary">Subash Jaganathan</a>
      </p>
      <p>
        <a href={ghLink} class="hover:text-primary">Source on GitHub</a>
        <span class="mx-2" aria-hidden="true">·</span>
        MIT licence
      </p>
    </div>
  </footer>
  );
});
