import React from "react";
import ReactDOM from "react-dom/client";
import TodoList from "./TodoList.tsx";
import Calendar from "./Calendar.tsx";
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Calendar />
    <TodoList />
  </React.StrictMode>


);
