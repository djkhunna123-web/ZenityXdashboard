import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { applyTheme, getStoredTheme, ThemeMode } from "@/lib/theme";

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<ThemeMode>(() => getStoredTheme());

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"))}
      className="p-2 rounded-xl bg-secondary/50 backdrop-blur-sm border border-border/50 text-muted-foreground hover:text-foreground transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </motion.button>
  );
};
