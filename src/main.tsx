import React from "react";
import ReactDOM from "react-dom/client";
import TodoList from "./todo/TodoList.tsx";
import Calendar from "./calendar/Calendar.tsx";
import Header from "./header/header.tsx";
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(



  <React.StrictMode>
    <Header />
    <Calendar />
    <TodoList />
  </React.StrictMode>


);
