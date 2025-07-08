import React from "react";
import ReactDOM from "react-dom/client";
import TodoList from "./todo/TodoList.tsx";
import Calendar from "./calendar/Calendar.tsx";
import Header from "./header/header.tsx";
import PainPoint from "./pain-point/PainPoint.tsx";
import { useState } from 'react';
import './global.scss'
function APP() {
  const [section, setSection] = useState('calendar')
  return (
    <>
      <Header setSection={setSection} />
      {section === 'calendar' && <Calendar />}
      {section === 'pain point' && <PainPoint />}
      <TodoList />
    </>
  )

}
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(

  <React.StrictMode>
    <APP />
  </React.StrictMode>


);
