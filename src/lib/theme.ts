export type ThemeMode = "dark" | "light";

const THEME_KEY = "zenityx.theme";

export const getStoredTheme = (): ThemeMode => {
  const savedTheme = window.localStorage.getItem(THEME_KEY);
  return savedTheme === "light" ? "light" : "dark";
};

export const applyTheme = (theme: ThemeMode) => {
  document.documentElement.classList.toggle("dark", theme === "dark");
  window.localStorage.setItem(THEME_KEY, theme);
};
