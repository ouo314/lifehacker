/*
import { useEffect, useState } from "react";
import type Database from "@tauri-apps/plugin-sql";
import { demoStore } from "@/lib/demoStore";
type nameType = 'todos'|'calendars'|'pain_points';
export const useDatabase = <T>(dataName: nameType) => {
    const [db, setDb] = useState<Database | null>(null);
    
    useEffect(() => {
        import('@tauri-apps/plugin-sql')
            .then(m => m.default.load('sqlite:lifehacker.db'))
            .then(d => setDb(d))
            .catch(() => { setDb(null) });
    }, []);

    const getStore =()=>{
        switch (dataName) {
            case "todos":
                return demoStore.todos                
            case "calendars":
                return demoStore.calendarEvents;
            case "pain_points":
                return demoStore.painPoints;
        
            default:
                throw new Error(`Unknown dataName: ${dataName}`);
        }
    }

    const getAll = async (): Promise<T[]> => {
        if (db) {
            return await db.select<T[]>(`SELECT * FROM ${dataName} `)
        }
        else {
            const store=getStore();
            return store.all() as T[];
        }
    }

    const add = async (data: Omit<T, 'id'>) => {
        if (db) {
            const columns = Object.keys(data).join(',');
            const placeholders = Object.keys(data)
                .map((_, index) => `$${index + 1}`)
                .join(',');
            const values = Object.values(data);

            return await db.execute(
                `INSERT INTO ${dataName} (${columns}) VALUES (${placeholders})`,
                values
            );
        } else {
            const store=getStore();
            store.add(data);
        }

    };

    const update = async (data: Partial<Omit<T, 'id'>>, id: string | number) => {
        const values = Object.values(data);
        if (db) {
            const setClause = Object.keys(data).map((key, index) =>
                `${key}=$${index + 2}`).join(',')

            return await db.execute(
                `UPDATE ${dataName} SET 
        ${setClause} 
        WHERE id=$1`,
                [id, ...values])
        } else {
            demoStore[dataName].update(values);
        }

        const remove = async (id: string) => {
            if (db) {
                return await db.execute(`DELETE FROM ${dataName} WHERE id=$1`, id)
            } else {
                demoStore[dataName].remove(id);
            }

        }

    };
    return { getAll, add, update, remove }

};
*/