import Database from '@tauri-apps/plugin-sql';
import { useState, useEffect, useRef } from 'react';

export const useDatabase = () => {
    const [db, setDb] = useState<Database | null>(null);
    const [isReady, setIsReady] = useState(false);
    useEffect(() => {
        async function initDb() {
            try {
                const database = await Database.load('sqlite:lifehacker.db');
                setDb(database);
                setIsReady(true)
                console.log('calendar database load success')
            } catch (error) {
                console.error('calendar database load error:', error);
            }
        }
        initDb();
    }, []);
    return { db, isReady };
}

export function useCalendarEvents(db) {
    const addEvent = async (eventData) => {
        if (!db) throw new Error('database error')
        const id = eventData.id || `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` //簡化
        try {
            await db.execute(`
                INSERT INTO calendarEvents 
                (id,title,start_date,end_date,all_day,description,type)
                VALUES ($1,$2,$3,$4,$5,$6,$7)`, [
                id,
                eventData.title,
                eventData.start,
                eventData.end,
                eventData.allDay ? 1 : 0,
                eventData.description,
                eventData.type || 'calendar'
            ]
            )
            console.log("add event success");
        } catch (error) {
            console.error("add event error", error);
            throw error
        }
    }
    async function loadEvents(startStr, endStr) {
        if (!db) return []
        try {
            const result = await db.select(`
                SELECT * FROM calendarEvents
                WHERE start_date>= $1 AND start_date<$2
                ORDER BY start_date`,
                [startStr, endStr])
            return result.map(row => ({
                id: row.id,
                title: row.title,
                start: row.start_date,
                end: row.end_date,
                allDay: Boolean(row.all_day),
                extendedProps: {
                    type: row.type,
                    description: row.description
                }
            }))
        } catch (error) {
            console.error("event load error:", error)
            return []
        }
    }
    async function updateEvent(eventId, updates) {
        if (!db) throw new Error('database error')
        try {
            const updateFields = []
            const values = []
            Object.entries(updates).forEach(([key, value]) => {
                if (key === 'start') {
                    updateFields.push(`start_date=$${values.length + 1}`)
                    values.push(value)
                } else if (key === 'end') {
                    updateFields.push(`end_date=$${values.length + 1}`)
                    values.push(value)
                } else if (key === 'allDay') {
                    updateFields.push(`all_day=$${values.length + 1}`)
                    values.push(value ? 1 : 0)
                } else {
                    updateFields.push(`${key}=$${values.length + 1}`)
                    values.push(value)
                }
            })
            if (updateFields.length > 0) {
                values.push(eventId)

                await db.execute(`
                    UPDATE calendarEvents
                    SET ${updateFields.join(', ')}
                    WHERE id= $${values.length}`, values)

                console.log('event update success:', eventId)
                return true
            }


        } catch (error) {
            console.error('event update failed:', error)
            throw error
        }
    }

    async function deleteEvent(id) {
        if (!db) throw new Error('database error')
        try {
            await db.execute('DELETE FROM calendarEvents WHERE id=$1', [id])
            console.log('event delete success:', id)
            return true
        } catch (error) {
            console.error('event delete failed:', error)
            throw error
        }
    }
    return { addEvent, loadEvents, updateEvent, deleteEvent }
}