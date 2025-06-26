import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
import timeGridPlugin from '@fullcalendar/timegrid'
import { formatDate } from '@fullcalendar/core'
import { useState } from 'react';
import styles from './Calendar.module.scss'

function renderEventContent(eventInfo) {
    return (
        <>
            <b>{eventInfo.timeText}</b>
            <i>{eventInfo.event.title}</i>
        </>

    )
}

function Calendar() {

    const [events, setEvents] = useState([])

    const handleDateSelect = (selectInfo) => {
        let title = prompt("enter title")
        let calendarApi = selectInfo.view.calendar
        calendarApi.unselect()
        calendarApi.addEvent({
            id: Date.now(),
            title,
            start: selectInfo.startStr,
            end: selectInfo.endStr,
            allDay: selectInfo.allDay
        })
    }
    return (
        <div className={styles.calendar}>
            <FullCalendar

                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView='dayGridMonth'
                events={events}
                selectable={true}
                select={handleDateSelect}
                eventContent={renderEventContent}
            />
        </div>


    );


}

export default Calendar;