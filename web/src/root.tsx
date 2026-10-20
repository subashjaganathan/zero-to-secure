import { component$, useStyles$ } from "@builder.io/qwik";
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";
import { withBase } from "./utils/base";

import tailwind from './styles/tailwind.css?inline';

import "./styles/global.css";

export default component$(() => {

  useStyles$(tailwind);
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Don't remove the `<head>` and `<body>` elements.
   */

  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <link rel="manifest" href={withBase("/manifest.json")} />
        <RouterHead />
        {/*
          Applies the saved theme before first paint. Without this, the theme
          store only runs on window load, so every page flashed the hardcoded
          dark theme first. New visitors get the light theme.
        */}
        <script dangerouslySetInnerHTML={`(function(){try{var t=JSON.parse(localStorage.getItem('PSC_THEME'));if(t!=='light'&&t!=='dark'){t='light';}document.documentElement.setAttribute('data-theme',t);document.addEventListener('DOMContentLoaded',function(){document.body.setAttribute('data-theme',t);});}catch(e){}})();`} />
        <ServiceWorkerRegister />
      </head>
      <body class="flex flex-col justify-between min-h-screen">
        <RouterOutlet />
      </body>
    </QwikCityProvider>
  );
});
