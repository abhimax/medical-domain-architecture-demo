import { Link, Outlet } from 'react-router-dom';
import { Stethoscope, X } from 'lucide-react';
// The host also reads the shared store, proving state flows both ways: the
// Patient remote writes the selection, and this host shell reflects it.
import { useGlobalStore } from '../store/globalStore';

// App shell: a top bar (clicking the logo returns to the dashboard) and the
// active route rendered into <Outlet />.
const Layout = () => {
  const selectedPatientId = useGlobalStore((s) => s.selectedPatientId);
  const setSelectedPatientId = useGlobalStore((s) => s.setSelectedPatientId);

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10 bg-white/5 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-4">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <Stethoscope className="h-6 w-6 text-cyan-400" />
            <span>Medical Domain Console</span>
          </Link>
          {selectedPatientId != null && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 py-1 pr-1.5 pl-3 text-sm">
              Patient #{selectedPatientId}
              <button
                type="button"
                onClick={() => setSelectedPatientId(null)}
                aria-label="Clear selected patient"
                className="inline-flex h-5 w-5 items-center justify-center rounded-full hover:bg-white/15"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
