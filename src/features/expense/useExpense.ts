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

    const getAll = async () => {
        if (db) {
            return await db.select<Expense[]>(`SELECT * FROM expense`);
        } else {
            return demoStore.expense.all();
        }
    }
    const add = async (data: Expense) => {
        if (db) {
            const columns = Object.keys(data).join(',');
            const placeholders = Object.keys(data)
                .map((_, index) => `$${index + 1}`)
                .join(',');
            const values = Object.values(data);
            await db.execute(
                `INSERT INTO expense (${columns}) VALUES (${placeholders})`,
                values
            );
        } else {
            demoStore.expense.add(data);
        }

    };
    const update = async (data: Partial<Omit<Expense, 'id'>>, id: number) => {
        const values = Object.values(data);
        if (db) {
            const setClause = Object.keys(data).map((key, index) =>
                `${key}=$${index + 2}`).join(',')

            return await db.execute(
                `UPDATE expense SET 
                ${setClause} 
                WHERE id=$1`,
                [id, ...values])
        } else {
            demoStore.expense.update(data, id);
        }
    };
    const remove = async (id: number) => {
        if (db) {
            return await db.execute(`DELETE FROM expense WHERE id=?`, [id])
        } else {
            demoStore.expense.remove(id);
        }

    }
    return { getAll, add, update, remove };
};
