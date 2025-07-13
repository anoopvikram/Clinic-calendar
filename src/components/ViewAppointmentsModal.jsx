import React from 'react';

export const ViewAppointmentsModal = ({ isOpen, onClose, events }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">All Appointments</h2>

        {events.length === 0 ? (
          <p>No appointments scheduled.</p>
        ) : (
          <ul className="space-y-2">
            {events.map((appt) => {
              const [patientName, doctorAndTime] = appt.title.split(' with ');
              const [doctorName, time] = doctorAndTime.split(' - ');

              return (
                <li key={appt.id} className="p-2 border rounded bg-green-50">
                  <div><strong>Patient:</strong> {patientName}</div>
                  <div><strong>Doctor:</strong> {doctorName}</div>
                  <div><strong>Time:</strong> {time}</div>
                  <div><strong>Date:</strong> {new Date(appt.start).toLocaleDateString()}</div>
                </li>
              );
            })}
          </ul>
        )}

        <div className="form-actions pt-3">
          <button onClick={onClose} className="form-cancel-btn">Close</button>
        </div>
      </div>
    </div>
  );
};
