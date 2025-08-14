import { useEffect, useState } from "react";
import type Database from "@tauri-apps/plugin-sql";

export const useDatabase = () => {
    const [db, setDb] = useState<Database | null>(null);
    const [ready, setReady] = useState(false);
    useEffect(() => {
        const initDatabase = async () => {
            try {

                import('@tauri-apps/plugin-sql')
                    .then(m => m.default.load('sqlite:lifehacker.db'))
                    .then(d => { setDb(d); setReady(true); })
                    .catch(() => {
                        setDb(null);
                        setReady(true);
                    });
                setReady(true);
            } catch (error) {
                console.error('database error: ', error);
                setReady(true);
            }
        };
        initDatabase();


    }, []);

    return { db, isReady: ready };
};
