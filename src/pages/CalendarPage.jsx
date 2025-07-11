import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

export const CalendarPage = () => {
  const [events, setEvents] = useState([]);

  const handleSelectSlot = ({ start }) => {
    alert(`Clicked on ${format(start, 'PP')}`);
    // modal slot
  };

  return (
    <div className="calendar-page">
      <h1 className="calendar-title">Appointment Calendar</h1>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        style={{ height: 600, margin: '50px' }}
        views={['month']}
      />
    </div>
  );
};
