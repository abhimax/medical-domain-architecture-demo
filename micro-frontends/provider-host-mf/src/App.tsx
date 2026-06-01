import { lazy, Suspense } from 'react';
import './App.css';

// Lazy-loaded from the remotes over Module Federation.
const PatientApp = lazy(() => import('patient_remote_mf/App'));
const AppointmentApp = lazy(() => import('appointment_remote_mf/App'));
const BillingApp = lazy(() => import('billing_remote_mf/App'));

const App = () => {
  return (
    <div className="content">
      <h1>Provider Host MF</h1>
      <p>Start building amazing things with Rsbuild.</p>

      <section>
        <h2>Patient (remote)</h2>
        <Suspense fallback={<p>Loading patient module…</p>}>
          <PatientApp />
        </Suspense>
      </section>

      <section>
        <h2>Appointment (remote)</h2>
        <Suspense fallback={<p>Loading appointment module…</p>}>
          <AppointmentApp />
        </Suspense>
      </section>

      <section>
        <h2>Billing (remote)</h2>
        <Suspense fallback={<p>Loading billing module…</p>}>
          <BillingApp />
        </Suspense>
      </section>
    </div>
  );
};

export default App;
