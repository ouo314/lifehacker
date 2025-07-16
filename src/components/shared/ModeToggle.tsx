import { useTheme } from "../../hooks/useTheme";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md border border-input bg-background hover:bg-muted"
    >
      {theme === "light" ? "🌙" : theme === "dark" ? "🌓" : "☀️"}
    </button>
  );
}
