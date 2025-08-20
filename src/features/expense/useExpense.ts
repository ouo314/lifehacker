import { useEffect, useState } from 'react';
import type Database from '@tauri-apps/plugin-sql';
import { demoStore } from '../../lib/demoStore';
import type { Expense } from '@/lib/demo';

export const useExpense = () => {

    const [db, setDb] = useState<Database | null>(null);

    useEffect(() => {

        import('@tauri-apps/plugin-sql')
            .then(m => m.default.load('sqlite:lifehacker.db'))
            .then(d => setDb(d))
            .catch(() => { setDb(null) });

    }, []);


    const add = async (data: Expense) => {
        if (db) {
            const columns = Object.keys(data).join(',');
            const placeholders = Object.keys(data)
                .map((_, index) => `$${index + 1}`)
                .join(',');
            const values = Object.values(data);
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
            demoStore.todos.update(todo.id);
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
