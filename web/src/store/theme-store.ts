import { useStore, useOnWindow, $ } from '@builder.io/qwik';

import { useLocalStorage } from '~/hooks/useLocalStorage';

const STORAGE_KEY = 'PSC_THEME';

/** New visitors get the light theme; dark stays one click away in the nav. */
const getDefaultTheme = (): string => 'light';

const applyTheme = (theme: string) => {
  document.documentElement.setAttribute('data-theme', theme);
  document.body.setAttribute('data-theme', theme);
};

export const useTheme = () => {
  const [theme, saveTheme] = useLocalStorage(STORAGE_KEY, '');
  const state = useStore({ theme: theme.value });

  useOnWindow('load', $(() => {
    // Only light and dark exist now; older saved themes fall back to the OS preference
    const storedTheme = theme.value === 'light' || theme.value === 'dark' ? theme.value : getDefaultTheme();
    state.theme = storedTheme;
    applyTheme(storedTheme);
  }));

  const setTheme = $((newTheme: string) => {
    saveTheme(newTheme);
    state.theme = newTheme;
    applyTheme(newTheme);
  });

  return { theme: state, setTheme };
};

