import { useEffect, useState } from "react";
import Database from "@tauri-apps/plugin-sql";

type Todo = {
  id: number;
  text: string;
  status: number;
};

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [db, setDb] = useState<Database | null>(null);

  useEffect(() => {
    async function initDb() {
      try {
        const database = await Database.load("sqlite:lifehacker.db");
        setDb(database);
      } catch (error) {
        console.error("database load error:", error);
      }
    }
    initDb();
  }, []);

  const refresh = async () => {
    if (!db) return;
    const rows = await db.select<Todo[]>(
      "SELECT id, text, status FROM todos WHERE type='todo' ORDER BY id ASC"
    );
    setTodos(rows);
  };

  const add = async (text: string) => {
    if (!db || !text.trim()) return;
    await db.execute("INSERT INTO todos (text,type) VALUES ($1,'todo')", [text]);
    refresh();
  };

  const toggle = async (todo: Todo) => {
    if (!db) return;
    await db.execute("UPDATE todos SET status=$1 WHERE id=$2", [
      todo.status ? 0 : 1,
      todo.id,
    ]);
    refresh();
  };

  useEffect(() => {
    if (db) refresh();
  }, [db]);

  return { todos, add, toggle, refresh };
};
