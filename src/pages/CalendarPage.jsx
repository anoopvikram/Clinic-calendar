import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import '../index.css';
import { AppointmentFormModal } from '../components/AppointmentFormModal';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import doctors from '../data/doctors.json';
import patients from '../data/patients.json';

const locales = { 'en-US': enUS };

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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [doctorFilter, setDoctorFilter] = useState('');
  const [patientFilter, setPatientFilter] = useState('');

  // Resize listener
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mobile wheel / touch day scroll
  useEffect(() => {
    if (!isMobile) return;

    let lastTouchY = 0;
    let lastChangeTime = Date.now();

    const threshold = 50;
    const throttleDelay = 300;

    const isInsideCalendar = (el) => el.closest('.rbc-calendar');

    const handleWheel = (e) => {
      if (isInsideCalendar(e.target)) return;
      const now = Date.now();
      if (now - lastChangeTime < throttleDelay) return;

      if (e.deltaY > threshold) {
        setCurrentDate((prev) => new Date(prev.setDate(prev.getDate() + 1)));
        lastChangeTime = now;
      } else if (e.deltaY < -threshold) {
        setCurrentDate((prev) => new Date(prev.setDate(prev.getDate() - 1)));
        lastChangeTime = now;
      }
    };

    const handleTouchStart = (e) => {
      lastTouchY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      if (isInsideCalendar(e.target)) return;
      const now = Date.now();
      if (now - lastChangeTime < throttleDelay) return;

      const currentY = e.touches[0].clientY;
      const deltaY = currentY - lastTouchY;

      if (deltaY > threshold) {
        setCurrentDate((prev) => new Date(prev.setDate(prev.getDate() - 1)));
        lastChangeTime = now;
      } else if (deltaY < -threshold) {
        setCurrentDate((prev) => new Date(prev.setDate(prev.getDate() + 1)));
        lastChangeTime = now;
      }

      lastTouchY = currentY;
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isMobile]);

  const CustomToolbar = ({ label }) => (
    <div className="rbc-toolbar">
      <span className="rbc-toolbar-label">{label}</span>
    </div>
  );

  const handleSelectSlot = ({ start }) => {
    if (start.getMonth() !== currentMonth) return;
    setSelectedDate(format(start, 'yyyy-MM-dd'));
    setModalOpen(true);
  };

  const handleSaveAppointment = (appointment) => {
    if (appointment.id) {
      const updatedEvents = events.map((ev) =>
        ev.id === appointment.id ? appointment : ev
      );
      setEvents(updatedEvents);
      localStorage.setItem('appointments', JSON.stringify(updatedEvents));
    } else {
      const newAppointment = { ...appointment, id: Date.now() };
      const updatedEvents = [...events, newAppointment];
      setEvents(updatedEvents);
      localStorage.setItem('appointments', JSON.stringify(updatedEvents));
    }
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

  // Filter appointments
  const filteredEvents = events.filter((ev) => {
    const [patientName, doctorAndTime] = ev.title.split(' with ');
    const [doctorName] = doctorAndTime.split(' - ');
    return (
      (doctorFilter === '' || doctorName === doctorFilter) &&
      (patientFilter === '' || patientName === patientFilter)
    );
  });

  return (
    <div className="calendar-page">
      <Navbar />

      {isMobile && (
        <div className="date-picker-container">
          <input
            type="date"
            value={format(currentDate, 'yyyy-MM-dd')}
            onChange={(e) => {
              const date = new Date(e.target.value);
              setCurrentDate(date);
              setCurrentMonth(date.getMonth());
            }}
            className="date-picker"
          />
        </div>
      )}

      {/* Filters */}
      <div className="md:flex gap-4 items-center justify-center mt-2 hidden md:ml-50">
        <select
          value={doctorFilter}
          onChange={(e) => setDoctorFilter(e.target.value)}
          className="bg-white text-sky-700 px-4 py-1.5 rounded-full font-semibold"
        >
          <option value="">All Doctors</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.name}>
              {d.name}
            </option>
          ))}
        </select>

        <select
          value={patientFilter}
          onChange={(e) => setPatientFilter(e.target.value)}
          className="bg-white text-sky-700 px-4 py-1.5 rounded-full font-semibold"
        >
          <option value="">All Patients</option>
          {patients.map((p) => (
            <option key={p.id} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>

        <button
          onClick={() => {
            setDoctorFilter('');
            setPatientFilter('');
          }}
          className="bg-sky-700 text-white px-4 py-1.5 rounded-full font-semibold"
        >
          Clear Filters
        </button>
      </div>

      <div className="calendar-container -mt-9">
        <Sidebar events={events} currentDate={new Date()} />

        <Calendar
          popup
          localizer={localizer}
          events={filteredEvents}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          dayPropGetter={dayPropGetter}
          components={{ toolbar: CustomToolbar }}
          date={currentDate}
          onNavigate={(date) => {
            setCurrentDate(date);
            setCurrentMonth(date.getMonth());
          }}
          views={isMobile ? ['day'] : ['month']}
          view={isMobile ? 'day' : undefined}
          style={{ height: 600, margin: '50px' }}
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
