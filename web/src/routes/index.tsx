import { component$ } from '@builder.io/qwik';
import { type DocumentHead } from "@builder.io/qwik-city";

import Hero from "~/components/furniture/hero";
import SectionLinkGrid from "~/components/psc/section-link-grid";
import Progress from "~/components/psc/progress";

export default component$(() => {
  return (
    <>
      <Hero />
      <Progress />
      <SectionLinkGrid />
    </>
  );
});

export const head: DocumentHead = {
  title: "Zero to Secure · Practical Digital Security",
  meta: [
    {
      name: "description",
      content: "Practical digital security, one step at a time. A free, open checklist covering authentication, browsing, devices, networks, AI and more.",
    },
  ],
};
