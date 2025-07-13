import React, { useState } from 'react';
import doctors from '../data/doctors.json';
import patients from '../data/patients.json';

export const Sidebar = ({ events, currentDate }) => {
  const [doctorFilter, setDoctorFilter] = useState('');
  const [patientFilter, setPatientFilter] = useState('');

  const todayAppointments = events.filter(ev =>
    new Date(ev.start).toDateString() === new Date(currentDate).toDateString()
  );

  const sortedAppointments = [...todayAppointments].sort(
    (a, b) => new Date(a.start) - new Date(b.start)
  );

  const filteredAppointments = sortedAppointments.filter(appt => {
    const [patientName, doctorAndTime] = appt.title.split(' with ');
    const [doctorName] = doctorAndTime.split(' - ');
    return (
      (doctorFilter === '' || doctorName === doctorFilter) &&
      (patientFilter === '' || patientName === patientFilter)
    );
  });

  return (
    <div className="sidebar">
      <div className="sidebar-section total">
        <div className="sidebar-count">{todayAppointments.length}</div>
        <h2 className="sidebar-title total">Appointments Today</h2>
      </div>

      {/* Filter dropdowns */}
      <div className="sidebar-section">
        <label className="text-xs text-gray-600">Filter by Doctor</label>
        <select
          value={doctorFilter}
          onChange={(e) => setDoctorFilter(e.target.value)}
          className="w-full p-2 rounded border border-gray-300 text-black mb-2"
        >
          <option value="">All Doctors</option>
          {doctors.map(d => (
            <option key={d.id} value={d.name}>{d.name}</option>
          ))}
        </select>

        <label className="text-xs text-gray-600">Filter by Patient</label>
        <select
          value={patientFilter}
          onChange={(e) => setPatientFilter(e.target.value)}
          className="w-full p-2 rounded border border-gray-300 text-black"
        >
          <option value="">All Patients</option>
          {patients.map(p => (
            <option key={p.id} value={p.name}>{p.name}</option>
          ))}
        </select>
      </div>

      <div className="sidebar-section upcoming">
        <h2 className="sidebar-title">Upcoming Today</h2>
        {filteredAppointments.length === 0 ? (
          <p className="sidebar-empty">No appointments</p>
        ) : (
          <ul className="sidebar-appointments">
            {filteredAppointments.map((appt) => {
              const [patientName, doctorAndTime] = appt.title.split(' with ');
              const [doctorName] = doctorAndTime.split(' - ');
              const time = new Date(appt.start).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              });
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
