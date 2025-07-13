import React, { useState, useEffect } from 'react';
import patients from '../data/patients.json';
import doctors from '../data/doctors.json';

export const AppointmentFormModal = ({ 
  isOpen, 
  onClose, 
  selectedDate, 
  onSave, 
  editingEvent, 
  events, 
  setEvents 
}) => {
  const [patient, setPatient] = useState('');
  const [doctor, setDoctor] = useState('');
  const [time, setTime] = useState('');
  const [showList, setShowList] = useState(false);  //  state to toggle view list

  useEffect(() => {
    if (editingEvent) {
      const [patientName, doctorAndTime] = editingEvent.title.split(' with ');
      const [doctorName] = doctorAndTime.split(' - ');
      setPatient(patientName);
      setDoctor(doctorName);
      setTime(editingEvent.start.toTimeString().slice(0, 5));
    } else {
      setPatient('');
      setDoctor('');
      setTime('');
    }
  }, [editingEvent, selectedDate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedAppointment = {
      id: editingEvent ? editingEvent.id : undefined,
      title: `${patient} with ${doctor} - ${time}`,
      start: new Date(`${selectedDate}T${time}`),
      end: new Date(`${selectedDate}T${time}`),
    };

    onSave(updatedAppointment);
    onClose();
  };

  const handleDelete = () => {
    const updatedEvents = events.filter(ev => ev.id !== editingEvent.id);
    setEvents(updatedEvents);
    localStorage.setItem('appointments', JSON.stringify(updatedEvents));
    onClose();
  };

  if (!isOpen) return null;

  // Filter appointments for selected date
  const appointmentsOnSelectedDate = events.filter(ev =>
    new Date(ev.start).toDateString() === new Date(selectedDate).toDateString()
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">
          {editingEvent ? 'Edit Appointment' : 'Add Appointment'}
        </h2>

        <form onSubmit={handleSubmit} className="appointment-form">
          <select
            value={patient}
            onChange={(e) => setPatient(e.target.value)}
            required
            className="form-input"
          >
            <option value="">Select Patient</option>
            {patients.map((p) => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
          </select>

          <select
            value={doctor}
            onChange={(e) => setDoctor(e.target.value)}
            required
            className="form-input"
          >
            <option value="">Select Doctor</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.name}>{d.name}</option>
            ))}
          </select>

          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            className="form-input"
          />

          <div className="form-actions">
            <button type="submit" className="form-save-btn">Save</button>
            <button type="button" onClick={onClose} className="form-cancel-btn">Cancel</button>
            {editingEvent && (
              <button
                type="button"
                onClick={handleDelete}
                className="form-delete-btn"
              >
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowList(!showList)}
              className="form-cancel-btn"
            >
              {showList ? 'Hide' : 'View'}
            </button>
          </div>
        </form>

        {/* Appointment List Section */}
        {showList && (
          <div className="mt-4">
            <h3 className="modal-title">Appointments on {selectedDate}</h3>
            {appointmentsOnSelectedDate.length === 0 ? (
              <p className="text-sm text-gray-600">No appointments scheduled.</p>
            ) : (
              <div className="space-y-2 mt-2 text-gray-600 max-h-64 overflow-y-auto pr-2">
              {appointmentsOnSelectedDate.map((appt) => {
                const [patientName, doctorAndTime] = appt.title.split(' with ');
                const [doctorName, time] = doctorAndTime.split(' - ');
                return (
                  <div key={appt.id} className="border border-gray-300 rounded-xl p-3 bg-slate-50 shadow">
                    <div><strong>Patient:</strong> {patientName}</div>
                    <div><strong>Doctor:</strong> {doctorName}</div>
                    <div><strong>Time:</strong> {time}</div>
                  </div>
                );
              })}
            </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
