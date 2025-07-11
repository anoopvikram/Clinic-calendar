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
          </div>
        </form>
      </div>
    </div>
  );
};
