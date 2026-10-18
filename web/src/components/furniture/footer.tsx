import { component$ } from "@builder.io/qwik";

export default component$(() => {

  const ghLink = 'https://github.com/subashjaganathan/zero-to-secure';
  const authorLink = 'https://subashjaganathan.github.io';

  return (
  <footer class="footer footer-center px-4 py-3 mt-4 text-base-content bg-base-200 bg-opacity-25">
    <aside>
      <p>
        Built &amp; maintained by{' '}
        <a href={authorLink} class="link link-primary font-semibold">Subash Jaganathan</a>
        <span class="opacity-70"> · DFIR Expert</span> ·
        View source on <a href={ghLink} class="link link-primary">GitHub</a>
      </p>
    </aside>
  </footer>
  );
});
