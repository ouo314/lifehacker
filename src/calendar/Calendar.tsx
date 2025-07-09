import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
import timeGridPlugin from '@fullcalendar/timegrid'
import { useRef } from 'react'
import type { EventResizeDoneArg } from '@fullcalendar/interaction'
import type {
    DateSelectArg,
    EventDropArg,
    EventApi
} from '@fullcalendar/core'
import styles from './Calendar.module.scss'
import { useCalendarEvents, useDatabase } from './calendarHooks'

function Calendar() {

    const { db, isReady } = useDatabase()
    const { addEvent, loadEvents, updateEvent, deleteEvent } = useCalendarEvents(db)
    const calendarRef = useRef<FullCalendar | null>(null)
    async function eventsFunction(
        fetchInfo: {
            startStr: string;
            endStr: string;
            timeZone: string
        }, successCallback: (events: any[]) => void, failCallback: (error: any) => void) {
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

    const handleDateSelect = async (selectInfo: DateSelectArg) => {
        let inputTitle = prompt("enter title") || ""
        if (!inputTitle.trim()) return
        try {
            const eventData = {
                title: inputTitle,
                start: selectInfo.startStr,
                end: selectInfo.endStr,
                allDay: selectInfo.allDay
            }
            await addEvent(eventData)
            calendarRef.current?.getApi().refetchEvents()
            selectInfo.view.calendar.unselect()
        } catch (error) {
            alert("add event error " + (error as Error).message)
        }
    }
    const handleEventResize = async (resizeInfo: EventResizeDoneArg) => {
        if (!isReady) {
            resizeInfo.revert()
            return
        }

        try {
            await updateEvent(resizeInfo.event.id, {
                start: resizeInfo.event.startStr,
                end: resizeInfo.event.endStr
            })
            console.log("event resize success")
        } catch (error) {
            console.error("event resize failed:", error)
            resizeInfo.revert()
        }
    }
    const handleEventDrag = async (dragInfo: EventDropArg) => {
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

    const handleEventClick = async (clickInfo: { event: EventApi }) => {
        if (confirm(`delete "${clickInfo.event.title}" ?`)) {
            try {
                await deleteEvent(clickInfo.event.id)
                calendarRef.current?.getApi().refetchEvents()
            } catch (error) {
                alert("delete failed: " + (error as Error).message)
            }
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
                eventResize={handleEventResize}
                eventClick={handleEventClick}
                locale="zh-tw"
                timeZone="Asia/Taipei"
            />
        </div>

    );

}

export default Calendar;