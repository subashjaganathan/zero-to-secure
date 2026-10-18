
import { $, component$, useContext } from "@builder.io/qwik";
import Icon from "~/components/core/icon";
import Logo from "~/components/core/logo";
import type { Section } from '~/types/PSC';
import { useTheme } from '~/store/theme-store';
import { ChecklistContext } from '~/store/checklist-context';
import { withBase } from '~/utils/base';


export default component$(() => {

  const data = useContext(ChecklistContext);

  const { theme, setTheme } = useTheme();

  const themes = [
    'dark', 'light', 'night', 'cupcake', 
    'bumblebee', 'corporate', 'synthwave', 'retro', 
    'valentine', 'halloween', 'aqua', 'lofi', 
    'fantasy', 'dracula'
  ];

  /*
   * Every key this app owns. Deleting these individually rather than calling
   * localStorage.clear() matters: the site is served from a GitHub Pages user
   * domain, so its storage is shared with every other project hosted there,
   * and clear() would wipe all of them.
   */
  const STORAGE_KEYS = ['PSC_PROGRESS', 'PSC_IGNORED', 'PSC_CLOSE_WELCOME', 'PSC_THEME', 'PSC_SCHEMA_VERSION'];

  const deleteAllData = $(() => {
    const isConfirmed = confirm('Are you sure you want to delete all local data? This will erase your progress.');
    if (isConfirmed) {
      STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
      location.reload();
    }
  });

  /** Downloads saved progress as JSON, so it can be backed up or moved browsers. */
  const exportData = $(() => {
    const payload: Record<string, unknown> = { exportedAt: new Date().toISOString(), version: 2 };
    STORAGE_KEYS.forEach((key) => {
      const value = localStorage.getItem(key);
      if (value !== null) payload[key] = JSON.parse(value);
    });
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `zero-to-secure-progress-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  });

  /** Restores progress from a previously exported JSON file. */
  const importData = $((event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    file.text().then((text) => {
      try {
        const payload = JSON.parse(text);
        const restored = STORAGE_KEYS.filter((key) => key in payload);
        if (!restored.length) {
          alert('That file does not contain any Zero to Secure progress.');
          return;
        }
        restored.forEach((key) => localStorage.setItem(key, JSON.stringify(payload[key])));
        location.reload();
      } catch {
        alert('Could not read that file. Is it a Zero to Secure export?');
      }
    });
  });

  return (
    <>
      <input id="my-drawer-3" type="checkbox" class="drawer-toggle" /> 
      <div class="navbar bg-base-100">
        <div class="flex-1">
          <div class="flex-none md:hidden">
            <label for="my-drawer-3" aria-label="open sidebar" class="btn btn-square btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </label>
          </div> 
          <a href={withBase("/")} class="btn btn-ghost text-xl flex normal-case">
            <label for="my-drawer-3" aria-label="open sidebar" class="tooltip tooltip-bottom mr-2" data-tip="View all Pages"><Logo size={30} id="nav" /></label>
            <h1 class="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-extrabold whitespace-nowrap">Zero to Secure</h1>
          </a>
        </div>
        <div class="flex-none hidden md:flex">
          <ul class="menu menu-horizontal px-1">
            <li>
              <details>
                <summary>
                  <Icon icon="checklist" width={16} height={16}  />
                  Checklists
                </summary>
                <ul class="p-2 bg-base-100 rounded-t-none z-10">
                  {data.value.map((item: Section, index: number) => (
                    <li key={`checklist-nav-${index}`} class={`hover:bg-${item.color}-600 hover:bg-opacity-15`}>
                      <a href={withBase(`/checklist/${item.slug}`)}>
                      <Icon color={item.color} class="mr-2" icon={item.icon} width={16} height={16}  />
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
            <li>
              <a href="https://github.com/subashjaganathan/zero-to-secure"
                class="tooltip flex tooltip-bottom" data-tip="View / Edit Source & Data">
                <Icon icon="github" width={16} height={16}  />GitHub
              </a>
            </li>
          </ul>
          <div class="tooltip tooltip-bottom" data-tip="Theme">
            <label class="cursor-pointer grid place-items-center">
              <input
                type="checkbox"
                checked={theme.theme === 'dark'}
                onClick$={() => {
                  setTheme(theme.theme === 'dark' ? 'light' : 'dark');
                }}
                class="toggle theme-controller bg-base-content row-start-1 col-start-1 col-span-2"
              />
              <svg class="col-start-1 row-start-1 stroke-base-100 fill-base-100" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>
              <svg class="col-start-2 row-start-1 stroke-base-100 fill-base-100" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            </label>
          </div>
          <li class="list-none px-2">
            <p
              onClick$={() => ((document.getElementById('settings_modal') || {}) as HTMLDialogElement).showModal()}
              class="cursor-pointer tooltip flex tooltip-bottom" data-tip="Settings">
                <Icon icon="settings" width={20} height={20}  />
            </p>
          </li>
        </div>
      </div>

      <div class="drawer-side z-10">
        <label for="my-drawer-3" aria-label="close sidebar" class="drawer-overlay"></label> 
        <ul class="rounded-box menu p-4 w-80 min-h-full bg-base-200">
          <h2 class="flex items-center gap-2 text-base-content font-bold">
            <Logo size={22} id="drawer" />
            Zero to Secure
          </h2>
          <li><a href={withBase("/")}><Icon class="mr-2" icon="homepage" width={16} height={16}  />Home</a></li>
          <li><a href="https://github.com/subashjaganathan/zero-to-secure">
            <Icon class="mr-2" icon="github" width={16} height={16}  />GitHub</a>
          </li>
          <li>
            <a href={withBase("/checklist")}><Icon class="mr-2" icon="all" width={16} height={16} />Checklists</a>
            <ul>
              {data.value.map((item: Section, index: number) => (
              <li key={`checklist-side-${index}`} class={`hover:bg-${item.color}-600 hover:bg-opacity-15`}>
                <a href={withBase(`/checklist/${item.slug}`)}>
                <Icon color={item.color} class="mr-2" icon={item.icon} width={16} height={16}  />
                  {item.title}
                </a>
              </li>
              ))}
            </ul>
          </li>
          <li>
            <button
              class="w-full"
              onClick$={() => {
                // Close the drawer first, or the modal opens behind it
                const drawer = document.getElementById('my-drawer-3') as HTMLInputElement | null;
                if (drawer) drawer.checked = false;
                ((document.getElementById('settings_modal') || {}) as HTMLDialogElement).showModal();
              }}>
              <Icon class="mr-2" icon="settings" width={16} height={16} />Settings
            </button>
          </li>
          <li>
            <a href="https://github.com/subashjaganathan/zero-to-secure/blob/main/CONTRIBUTING.md">
              <Icon class="mr-2" icon="about" width={16} height={16} />Contributing
            </a>
          </li>
          <li>
            <a href="https://github.com/subashjaganathan/zero-to-secure/blob/main/LICENSE">
              <Icon class="mr-2" icon="articles" width={16} height={16} />License
            </a>
          </li>
        </ul>
      </div>

      <dialog id="settings_modal" class="modal">
        <div class="modal-box">
          <h3 class="font-bold text-lg mb-2">Settings</h3>
          <div class="modal-action justify-start w-full flex flex-col gap-4">
              <div class="flex items-between w-full justify-between">
                <label for="theme" class="label">Theme</label>
                <select 
                  id="theme" 
                  class="select select-bordered w-full max-w-xs"
                  onChange$={(event) => setTheme((event.target as HTMLSelectElement).value) }
                  >
                  <option disabled selected>Theme</option>
                  {themes.map((someTheme) => (
                    <option
                      key={someTheme}
                      value={someTheme}
                      selected={someTheme === theme.theme}
                      >
                      {someTheme.charAt(0).toUpperCase() + someTheme.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div class="flex items-between w-full justify-between">
                <label class="label">Backup</label>
                <div class="flex gap-2">
                  <button class="btn btn-sm" onClick$={exportData}>Export</button>
                  <label class="btn btn-sm" for="import-progress">Import</label>
                  <input
                    id="import-progress"
                    type="file"
                    accept="application/json,.json"
                    class="hidden"
                    onChange$={importData}
                  />
                </div>
              </div>
              <div class="flex items-between w-full justify-between">
                <label class="label">Data</label>
                <button class="btn btn-error btn-sm" onClick$={deleteAllData}>Delete All</button>
              </div>
              <button
                class="btn my-1 mx-auto"
                onClick$={() => ((document.getElementById('settings_modal') || {}) as HTMLDialogElement).close()}
              >Close</button>
            </div>
        </div>
      </dialog>
    </>
  );
});
