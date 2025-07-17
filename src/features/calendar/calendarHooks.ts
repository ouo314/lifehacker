import { useEffect, useState } from 'react';
import type Database from '@tauri-apps/plugin-sql';
import { isTauri } from '../../lib/env';
import { demoStore } from '../../lib/demoStore';
import type { EventData, CalendarEvent } from '../../lib/demo';

/* ① 取得 DB 連線（Tauri）或直接標記就緒（Web） */
export const useDatabase = () => {
    const [db, setDb] = useState<Database | null>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (isTauri()) {
            import('@tauri-apps/plugin-sql')
                .then(m => m.default.load('sqlite:lifehacker.db'))
                .then(d => { setDb(d); setReady(true); })
                .catch(console.error);
        } else { setReady(true); }
    }, []);

    return { db, isReady: ready };
};

/* ② 行事曆 CRUD，依環境切換資料來源 */
export const useCalendarEvents = (db: Database | null) => {
    const loadEvents = async (start: string, end: string): Promise<CalendarEvent[]> =>
        isTauri() && db
            ? (await db.select<CalendarEvent[]>(
                `SELECT id,title,start_date AS start,end_date AS end,
                  all_day AS "allDay",description,type
           FROM calendarEvents WHERE start_date >= $1 AND start_date < $2
           ORDER BY start_date`, [start, end]
            )).map(r => ({
                ...r,
                allDay: Boolean((r as any).allDay),
                extendedProps: { description: (r as any).description, type: (r as any).type },
            }))
            : demoStore.calendarEvents.range(start, end);

    const addEvent = async (e: EventData) =>
        isTauri() && db
            ? db.execute(
                `INSERT INTO calendarEvents
           (id,title,start_date,end_date,all_day,description,type)
           VALUES ($1,$2,$3,$4,$5,$6,$7)`,
                [
                    e.id ?? `event_${Date.now()}`, e.title, e.start, e.end,
                    e.allDay ? 1 : 0, e.description ?? null, e.type ?? 'calendar',
                ])
            : demoStore.calendarEvents.add(e);

    const updateEvent = async (id: string, u: Partial<EventData>) =>
        isTauri() && db
            ? (() => {
                const f: string[] = [], v: any[] = [];
                Object.entries(u).forEach(([k, val]) => {
                    f.push(`${k === 'allDay' ? 'all_day' : k}=$${v.length + 1}`);
                    v.push(k === 'allDay' ? (val ? 1 : 0) : val);
                });
                v.push(id);
                return db.execute(`UPDATE calendarEvents SET ${f.join(',')} WHERE id=$${v.length}`, v);
            })()
            : demoStore.calendarEvents.update(id, u as any);

    const deleteEvent = async (id: string) =>
        isTauri() && db
            ? db.execute('DELETE FROM calendarEvents WHERE id=$1', [id])
            : demoStore.calendarEvents.remove(id);

    return { loadEvents, addEvent, updateEvent, deleteEvent };
};
