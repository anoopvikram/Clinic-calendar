import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import '../index.css';
import { AppointmentFormModal } from '../components/AppointmentFormModal';
import { Sidebar } from '../components/Sidebar';

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
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [editingEvent, setEditingEvent] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

    const CustomToolbar = ({ label }) => (
        <div className="rbc-toolbar">
            <span className="rbc-toolbar-label">{label}</span>
        </div>
    );

  const handleSelectSlot = ({ start }) => {
    if (start.getMonth() !== currentMonth) return; // block selection
    setSelectedDate(format(start, 'yyyy-MM-dd'));
    setModalOpen(true);
    };


  const handleSaveAppointment = (appointment) => {
    if (appointment.id) {
        // edit mode
        const updatedEvents = events.map(ev =>
        ev.id === appointment.id ? appointment : ev
        );
        setEvents(updatedEvents);
        localStorage.setItem('appointments', JSON.stringify(updatedEvents));
    } else {
        // add mode
        const newAppointment = { ...appointment, id: Date.now() };
        const updatedEvents = [...events, newAppointment];
        setEvents(updatedEvents);
        localStorage.setItem('appointments', JSON.stringify(updatedEvents));
    }
  };

    const handleNavigate = (date) => {
        setCurrentMonth(date.getMonth());
    };


    const handleSelectEvent = (event) => {
        setSelectedDate(format(event.start, 'yyyy-MM-dd'));
        setEditingEvent(event);
        setModalOpen(true);
    };

    const dayPropGetter = (date) => {
        const isCurrentMonth = date.getMonth() === currentMonth;
        if (!isCurrentMonth) {
            return {
            className: 'adjacent-month-day',
            style: {
                backgroundColor: '#f0f0f0',
                pointerEvents: 'none',
                color: '#999',
            },
            };
        }
        return {};
    };



  return (
    <div className="calendar-page">
      <div className='calendar-container'>
        <Sidebar events={events} currentDate={new Date()} />
        
        <Calendar
            popup
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            dayPropGetter={dayPropGetter}
            onNavigate={handleNavigate}
            components={{
                toolbar: CustomToolbar
            }}
            style={{ height: 600, margin: '50px' }}
            views={['month']}
        />

        <AppointmentFormModal
            isOpen={modalOpen}
            onClose={() => {
                setModalOpen(false);
                setEditingEvent(null);
            }}
            selectedDate={selectedDate}
            onSave={handleSaveAppointment}
            editingEvent={editingEvent}
            events={events}
            setEvents={setEvents}
        />
    </div>
    </div>
  );
};
