import { useEffect, useState } from 'react';
import './App.css';
import type { Patient } from './types';
import { fetchPatients } from './api';
// The shared global store exposed by the host. This MF WRITES `selectedPatientId`
// — the Appointment and Billing MFs read it and filter to the chosen patient.
import { useGlobalStore } from 'provider_host_mf/store';

const App = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Read + write the shared selection. Clicking a row publishes it globally.
  const selectedPatientId = useGlobalStore((s) => s.selectedPatientId);
  const setSelectedPatientId = useGlobalStore((s) => s.setSelectedPatientId);

  // Load patients from patient-service once, when the component mounts.
  useEffect(() => {
    fetchPatients()
      .then(setPatients)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Click a row to select that patient; click the selected row again to clear.
  const selectPatient = (id: number) =>
    setSelectedPatientId(selectedPatientId === id ? null : id);

  return (
    <div className="p-6 text-left">
      <h2 className="mb-2 text-2xl font-bold">Patients</h2>
      <p className="mb-4 text-sm opacity-60">
        Click a patient to focus the Appointment and Billing micro-frontends on
        them — shared via the global store.
      </p>

      {loading && <p className="opacity-70">Loading patients…</p>}
      {error && <p className="text-red-400">⚠ {error}</p>}

      {!loading && !error && (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-white/20 text-left">
              <th className="py-2 pr-4">ID</th>
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Age</th>
              <th className="py-2 pr-4">Gender</th>
              <th className="py-2 pr-4">Phone</th>
              <th className="py-2 pr-4">Condition</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => {
              const isSelected = p.id === selectedPatientId;
              return (
                <tr
                  key={p.id}
                  onClick={() => selectPatient(p.id)}
                  className={`cursor-pointer border-b border-white/10 transition ${
                    isSelected
                      ? 'bg-cyan-500/15 ring-1 ring-cyan-500/40'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <td className="py-2 pr-4">{p.id}</td>
                  <td className="py-2 pr-4">{p.name}</td>
                  <td className="py-2 pr-4">{p.age}</td>
                  <td className="py-2 pr-4">{p.gender}</td>
                  <td className="py-2 pr-4">{p.phone}</td>
                  <td className="py-2 pr-4">{p.condition}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default App;
