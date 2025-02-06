'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Themes = "dark" | "";

export type ThemeType = {
  theme: Themes;
};

export const defaultTheme: ThemeType = {
  theme: "dark",
};

interface ThemeContextType {
  toggleTheme: () => void;
  getTheme: () => "dark" | "light";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Themes>(defaultTheme.theme);

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "" : "dark"));
  };

  const getTheme = () => {
    return theme === "dark" ? theme : "light";
  };

  return (
    <ThemeContext.Provider value={{ toggleTheme, getTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
