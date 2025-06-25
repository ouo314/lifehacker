import { useEffect, useState } from "react";
import Database from '@tauri-apps/plugin-sql';
import "./App.css";

type todo = { id: number, text: string, status: number };

function todoList() {

  const [todos, setTodos] = useState<todo[]>([]);
  const [input, setInput] = useState("");
  const [db, setDb] = useState<Database | null>(null);

  useEffect(() => {
    async function initDb() {
      try {
        console.log('try loading db');
        const database = await Database.load('sqlite:lifehacker.db');
        console.log('db load success');
        setDb(database);
      } catch (error) {
        console.error('database load error:', error);
      }
    }
    initDb();
  }, []);

  async function refresh() {
    const rows = await db.select<todo[]>("SELECT id, text, status FROM todos ORDER BY id DESC");
    setTodos(rows);
  }

  async function add() {
    await db.execute("INSERT into todos (text) VALUES ($1)", [input]);
    setInput("");
    refresh();
  }

  async function toggle(t: todo) {
    await db.execute("UPDATE todos SET status=$1 WHERE id=$2",
      [t.status ? 0 : 1, t.id]);
    refresh();
  }

  useEffect(() => {
    if (db) refresh();
  }, [db]);

  return (
    <div>
      <h1>Todo List</h1>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === "Enter" && add()}
      />
      <ul>
        {todos.map(t => (
          <li key={t.id} onClick={() => toggle(t)}>
            <input type="checkbox" readOnly checked={!!t.status} />
            <span > {t.text} </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default todoList;
