import React from "react";
import ReactDOM from "react-dom/client";
import TodoList from "./todo/TodoList.tsx";
import Calendar from "./calendar/Calendar.tsx";
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Calendar />
    <TodoList />
  </React.StrictMode>


);
