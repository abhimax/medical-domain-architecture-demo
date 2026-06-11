import { useEffect, useState } from 'react';
import './App.css';
import type { Appointment } from './types';
import { fetchAppointments } from './api';
// The shared global store exposed by the host. This MF READS `selectedPatientId`
// (set by the Patient MF) and filters its table to that patient.
import { useGlobalStore } from 'provider_host_mf/store';

const App = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Read the shared selection and the setter (so we can offer a "Show all").
  const selectedPatientId = useGlobalStore((s) => s.selectedPatientId);
  const setSelectedPatientId = useGlobalStore((s) => s.setSelectedPatientId);

  // Load appointments from appointment-service once, when the component mounts.
  useEffect(() => {
    fetchAppointments()
      .then(setAppointments)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // When a patient is selected globally, show only their appointments.
  const visible =
    selectedPatientId == null
      ? appointments
      : appointments.filter((a) => a.patientId === selectedPatientId);

  return (
    <div className="p-6 text-left">
      <h2 className="mb-4 text-2xl font-bold">Appointments</h2>

      {selectedPatientId != null && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-sm">
          <span>
            Showing appointments for <strong>patient #{selectedPatientId}</strong>
          </span>
          <button
            type="button"
            onClick={() => setSelectedPatientId(null)}
            className="font-medium text-cyan-300 hover:underline"
          >
            Show all
          </button>
        </div>
      )}

      {loading && <p className="opacity-70">Loading appointments…</p>}
      {error && <p className="text-red-400">⚠ {error}</p>}

      {!loading && !error && visible.length === 0 && (
        <p className="opacity-70">No appointments for patient #{selectedPatientId}.</p>
      )}

      {!loading && !error && visible.length > 0 && (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-white/20 text-left">
              <th className="py-2 pr-4">ID</th>
              <th className="py-2 pr-4">Patient</th>
              <th className="py-2 pr-4">Doctor</th>
              <th className="py-2 pr-4">Department</th>
              <th className="py-2 pr-4">Date</th>
              <th className="py-2 pr-4">Time</th>
              <th className="py-2 pr-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((a) => (
              <tr key={a.id} className="border-b border-white/10">
                <td className="py-2 pr-4">{a.id}</td>
                <td className="py-2 pr-4">{a.patientId}</td>
                <td className="py-2 pr-4">{a.doctorName}</td>
                <td className="py-2 pr-4">{a.department}</td>
                <td className="py-2 pr-4">{a.date}</td>
                <td className="py-2 pr-4">{a.time}</td>
                <td className="py-2 pr-4">{a.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default App;
