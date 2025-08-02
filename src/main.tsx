import React from "react";
import ReactDOM from "react-dom/client";
import { TodoPage } from "./features/todo/TodoPage";
import Calendar from "./features/calendar/Calendar.tsx";
import PainPage from "./features/pain-point/PainPage.tsx";
import { ModeToggle } from "./components/shared/ModeToggle";
import { useState } from 'react';
import { ThemeProvider } from "./hooks/useTheme";
import './styles/index.css'


function APP() {
  const [section, setSection] = useState('calendar')
  return (
    <div className="bg-background text-foreground grid grid-rows-[auto_1fr_auto] h-screen">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between p-4">
          <nav className="flex gap-2">
            <button
              onClick={() => setSection("todo")}
              className={`px-4 py-2 rounded-md ${section === "todo"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
                }`}
            >
              Todo
            </button>
            <button
              onClick={() => setSection("calendar")}
              className={`px-4 py-2 rounded-md ${section === "calendar"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
                }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setSection("pain")}
              className={`px-4 py-2 rounded-md ${section === "pain"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
                }`}
            >
              Pain Point
            </button>
          </nav>
          <ModeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 overflow-y-auto no-scrollbar">
        {section === "todo" && <TodoPage />}
        {section === "calendar" && <Calendar />}
        {section === "pain" && <PainPage />}
      </main>
    </div>
  )

}
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <APP />
    </ThemeProvider>
  </React.StrictMode>
);
