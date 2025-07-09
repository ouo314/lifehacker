import Database from '@tauri-apps/plugin-sql';
import { useState, useEffect } from 'react';

interface EventData {
    id?: string;
    title: string;
    start: string;
    end: string;
    allDay: boolean;
    description?: string;
    type?: string;
}

interface CalendarEventRow {
    id: string;
    title: string;
    start_date: string;
    end_date: string;
    all_day: number;
    description: string | null;
    type: string;
}

interface CalendarEvent {
    id: string;
    title: string;
    start: string;
    end: string;
    allDay: boolean;
    extendedProps: {
        type: string;
        description: string | null;
    };
}

interface EventUpdates {
    title?: string;
    start?: string;
    end?: string;
    allDay?: boolean;
    description?: string;
    type?: string;
}


interface DatabaseHook {
    db: Database | null;
    isReady: boolean;
}

interface CalendarEventsHook {
    addEvent: (eventData: EventData) => Promise<void>;
    loadEvents: (startStr: string, endStr: string) => Promise<CalendarEvent[]>;
    updateEvent: (eventId: string, updates: EventUpdates) => Promise<boolean>;
    deleteEvent: (id: string) => Promise<boolean>;
}

export const useDatabase = (): DatabaseHook => {
    const [db, setDb] = useState<Database | null>(null);
    const [isReady, setIsReady] = useState<boolean>(false);

    useEffect(() => {
        async function initDb(): Promise<void> {
            try {
                const database = await Database.load('sqlite:lifehacker.db');
                setDb(database);
                setIsReady(true);
                console.log('calendar database load success');
            } catch (error) {
                console.error('calendar database load error:', error);
            }
        }
        initDb();
    }, []);

    return { db, isReady };
};

export function useCalendarEvents(db: Database | null): CalendarEventsHook {
    const addEvent = async (eventData: EventData): Promise<void> => {
        if (!db) throw new Error('database error');

        const id: string = eventData.id || `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        try {
            await db.execute(`
                INSERT INTO calendarEvents 
                (id, title, start_date, end_date, all_day, description, type)
                VALUES ($1, $2, $3, $4, $5, $6, $7)`, [
                id,
                eventData.title,
                eventData.start,
                eventData.end,
                eventData.allDay ? 1 : 0,
                eventData.description || null,
                eventData.type || 'calendar'
            ]);
            console.log("add event success");
        } catch (error) {
            console.error("add event error", error);
            throw error;
        }
    };

    async function loadEvents(startStr: string, endStr: string): Promise<CalendarEvent[]> {
        if (!db) return [];

        try {
            const result = await db.select<CalendarEventRow[]>(`
                SELECT * FROM calendarEvents
                WHERE start_date >= $1 AND start_date < $2
                ORDER BY start_date`,
                [startStr, endStr]
            );

            return result.map((row: CalendarEventRow): CalendarEvent => ({
                id: row.id,
                title: row.title,
                start: row.start_date,
                end: row.end_date,
                allDay: Boolean(row.all_day),
                extendedProps: {
                    type: row.type,
                    description: row.description
                }
            }));
        } catch (error) {
            console.error("event load error:", error);
            return [];
        }
    }

    async function updateEvent(eventId: string, updates: EventUpdates): Promise<boolean> {
        if (!db) throw new Error('database error');

        try {
            const updateFields: string[] = [];
            const values: (string | number)[] = [];

            Object.entries(updates).forEach(([key, value]: [string, any]) => {
                if (key === 'start') {
                    updateFields.push(`start_date=$${values.length + 1}`);
                    values.push(value as string);
                } else if (key === 'end') {
                    updateFields.push(`end_date=$${values.length + 1}`);
                    values.push(value as string);
                } else if (key === 'allDay') {
                    updateFields.push(`all_day=$${values.length + 1}`);
                    values.push(value ? 1 : 0);
                } else {
                    updateFields.push(`${key}=$${values.length + 1}`);
                    values.push(value as string);
                }
            });

            if (updateFields.length > 0) {
                values.push(eventId);

                await db.execute(`
                    UPDATE calendarEvents
                    SET ${updateFields.join(', ')}
                    WHERE id = $${values.length}`,
                    values
                );

                console.log('event update success:', eventId);
                return true;
            }

            return false;
        } catch (error) {
            console.error('event update failed:', error);
            throw error;
        }
    }

    async function deleteEvent(id: string): Promise<boolean> {
        if (!db) throw new Error('database error');

        try {
            await db.execute('DELETE FROM calendarEvents WHERE id = $1', [id]);
            console.log('event delete success:', id);
            return true;
        } catch (error) {
            console.error('event delete failed:', error);
            throw error;
        }
    }

    return { addEvent, loadEvents, updateEvent, deleteEvent };
}
