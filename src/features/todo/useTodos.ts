import { useEffect, useState } from 'react';
import type Database from '@tauri-apps/plugin-sql';
import { demoStore } from '../../lib/demoStore';

export type Todo = { id: number; text: string; status: number };

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [db, setDb] = useState<Database | null>(null);

  useEffect(() => {

    import('@tauri-apps/plugin-sql')
      .then(m => m.default.load('sqlite:lifehacker.db'))
      .then(d => setDb(d))
      .catch(() => { setDb(null) });

  }, []);
  const refresh = async () => {
    if (db) {
      const rows = await db.select<Todo[]>(
        'SELECT id,text,status FROM todos ORDER BY id ASC'
      );
      setTodos(rows);
    } else {
      setTodos(demoStore.todos.all());
    }
  };

  const add = async (text: string) => {
    if (!text.trim()) return;
    if (db) {
      await db.execute(
        "INSERT INTO todos (text,type) VALUES ($1,'todo')",
        [text]
      );
    } else {
      demoStore.todos.add(text);
    }
    refresh();
  };

  const toggle = async (todo: Todo) => {
    if (db) {
      await db.execute('UPDATE todos SET status=$1 WHERE id=$2', [
        todo.status ? 0 : 1,
        todo.id,
      ]);
    } else {
      demoStore.todos.toggle(todo.id);
    }
    refresh();
  };

  const remove = async (todo: Todo) => {
    if (db) {
      await db.execute('DELETE FROM todos WHERE id=?', [todo.id])
    } else {
      demoStore.todos.remove(todo.id);
    }
    refresh();
  }

  useEffect(() => {
    refresh();
  }, [db]);

  return { todos, add, toggle, remove };
};
