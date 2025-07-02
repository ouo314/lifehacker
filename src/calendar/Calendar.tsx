import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
import timeGridPlugin from '@fullcalendar/timegrid'
import { useRef } from 'react';
import styles from './Calendar.module.scss'
import { useCalendarEvents, useDatabase } from './calendarHooks'

function Calendar() {

    const { db, isReady } = useDatabase()
    const { addEvent, loadEvents, updateEvent, deleteEvent } = useCalendarEvents(db)
    const calendarRef = useRef()
    async function eventsFunction(fetchInfo, successCallback, failCallback) {
        if (!isReady || !db) {
            failCallback("database isn't ready")
            return
        }
        try {
            console.log("loading events:", {
                start: fetchInfo.startStr,
                end: fetchInfo.endStr,
                time: fetchInfo.timeZone
            })
            const events = await loadEvents(fetchInfo.startStr, fetchInfo.endStr)
            console.log(`load ${events.length} events`)
            successCallback(events)
        } catch (error) {
            console.log("event load error: ", error)
            failCallback(error)
        }
    }

    const handleDateSelect = async (selectInfo) => {
        let title = prompt("enter title")
        try {
            const eventData = {
                title,
                start: selectInfo.startStr,
                end: selectInfo.endStr,
                allDay: selectInfo.allDay
            }
            await addEvent(eventData)
            calendarRef.current?.getApi().refetchEvents()
            selectInfo.view.calendar.unselect()
        } catch (error) {
            alert("add event error " + error.message)
        }
    }

    const handleEventDrag = async (dragInfo) => {
        if (!isReady) {
            dragInfo.revert()
            return
        }

        try {
            await updateEvent(dragInfo.event.id,
                {
                    start: dragInfo.event.startStr,
                    end: dragInfo.event.endStr
                }
            )
            console.log("event update success")
        } catch (error) {
            console.error("event update failed:", error)
            dragInfo.revert()
            throw error
        }
    }

    return (
        <div className={styles.calendar}>
            <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView='dayGridMonth'
                events={eventsFunction}
                editable={true}
                selectable={true}
                select={handleDateSelect}
                droppable={true}
                eventDrop={handleEventDrag}
                eventResize={handleEventDrag}
                locale="zh-tw"
                timeZone="Asia/Taipei"
            />
        </div>

    );

}

export default Calendar;