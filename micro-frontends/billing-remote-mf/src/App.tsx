import { useEffect, useState } from 'react';
import './App.css';
import type { Invoice } from './types';
import { fetchInvoices } from './api';
// The shared global store exposed by the host. This MF READS `selectedPatientId`
// (set by the Patient MF) and filters its table to that patient.
import { useGlobalStore } from 'provider_host_mf/store';

const App = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Read the shared selection and the setter (so we can offer a "Show all").
  const selectedPatientId = useGlobalStore((s) => s.selectedPatientId);
  const setSelectedPatientId = useGlobalStore((s) => s.setSelectedPatientId);

  // Load invoices from billing-service once, when the component mounts.
  useEffect(() => {
    fetchInvoices()
      .then(setInvoices)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // When a patient is selected globally, show only their invoices.
  const visible =
    selectedPatientId == null
      ? invoices
      : invoices.filter((inv) => inv.patientId === selectedPatientId);

  return (
    <div className="p-6 text-left">
      <h2 className="mb-4 text-2xl font-bold">Invoices</h2>

      {selectedPatientId != null && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-sm">
          <span>
            Showing invoices for <strong>patient #{selectedPatientId}</strong>
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

      {loading && <p className="opacity-70">Loading invoices…</p>}
      {error && <p className="text-red-400">⚠ {error}</p>}

      {!loading && !error && visible.length === 0 && (
        <p className="opacity-70">No invoices for patient #{selectedPatientId}.</p>
      )}

      {!loading && !error && visible.length > 0 && (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-white/20 text-left">
              <th className="py-2 pr-4">ID</th>
              <th className="py-2 pr-4">Patient</th>
              <th className="py-2 pr-4">Service</th>
              <th className="py-2 pr-4">Amount</th>
              <th className="py-2 pr-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((inv) => (
              <tr key={inv.id} className="border-b border-white/10">
                <td className="py-2 pr-4">{inv.id}</td>
                <td className="py-2 pr-4">{inv.patientId}</td>
                <td className="py-2 pr-4">{inv.serviceName}</td>
                <td className="py-2 pr-4">{inv.amount}</td>
                <td className="py-2 pr-4">{inv.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default App;
