import React from 'react';

export const Sidebar = ({ events, currentDate }) => {
  // Filter today's appointments
  const todayAppointments = events.filter(ev =>
    new Date(ev.start).toDateString() === new Date(currentDate).toDateString()
  );

  // Sort by time
  const sortedAppointments = [...todayAppointments].sort(
    (a, b) => new Date(a.start) - new Date(b.start)
  );

  return (
    <div className="sidebar">
      <div className="sidebar-section total">
        <div className="sidebar-count">{todayAppointments.length}</div>
        <h2 className="sidebar-title total">Appointments Today</h2>
      </div>

      <div className="sidebar-section upcoming">
        <h2 className="sidebar-title">Upcoming Today</h2>
        {sortedAppointments.length === 0 ? (
          <p className="sidebar-empty">No appointments</p>
        ) : (
          <ul className="sidebar-appointments">
            {sortedAppointments.map((appt) => {
              const [patientName, doctorAndTime] = appt.title.split(' with ');
              const [doctorName] = doctorAndTime.split(' - ');
              const time = new Date(appt.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              return (
                <li key={appt.id} className="sidebar-appointment">
                  <div className="appointment-time">{time}</div>
                  <div className="appointment-patient">{patientName}</div>
                  <div className="appointment-doctor">Dr. {doctorName}</div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};
