import { create, type StoreApi, type UseBoundStore } from 'zustand';

// Global state shared across every micro-frontend. The store is created ONCE
// here in the host and exposed over Module Federation (see rsbuild.config.ts)
// as `provider_host_mf/store`. Every app imports this same hook, so they all
// read and write a single store instance — change it anywhere, every
// micro-frontend re-renders.
export interface GlobalState {
  // Which patient the user is focused on. WRITTEN by the Patient MF when a row
  // is clicked, and READ by the Appointment & Billing MFs (and the host header)
  // to scope what they show. `null` means "no patient selected — show all".
  selectedPatientId: number | null;
  setSelectedPatientId: (id: number | null) => void;
}

const createGlobalStore = () =>
  create<GlobalState>((set) => ({
    selectedPatientId: null,
    setSelectedPatientId: (id) => set({ selectedPatientId: id }),
  }));

// Module Federation can evaluate this module more than once: the host bundles
// its own copy (Layout imports from it directly), while the remotes load the
// federated, exposed copy. Without a guard each copy would call create() and
// own a SEPARATE store, so state written in one app would not be visible in
// another. Caching the single instance on globalThis collapses every copy onto
// one store, which is what makes the sharing actually work.
const globalRef = globalThis as typeof globalThis & {
  __medicalGlobalStore__?: UseBoundStore<StoreApi<GlobalState>>;
};

export const useGlobalStore: UseBoundStore<StoreApi<GlobalState>> =
  (globalRef.__medicalGlobalStore__ ??= createGlobalStore());
