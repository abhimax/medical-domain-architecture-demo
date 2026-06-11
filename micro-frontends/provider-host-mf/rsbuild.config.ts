import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: 'provider_host_mf',
      // The host is also a producer: it emits a manifest so remotes can load
      // the shared theme store and toggle button from it.
      filename: 'remoteEntry.js',
      remotes: {
        // Loads each remote's manifest at runtime. The host stays decoupled —
        // a remote can be rebuilt/redeployed without rebuilding the host.
        patient_remote_mf:
          'patient_remote_mf@http://localhost:3001/mf-manifest.json',
        appointment_remote_mf:
          'appointment_remote_mf@http://localhost:3002/mf-manifest.json',
        billing_remote_mf:
          'billing_remote_mf@http://localhost:3003/mf-manifest.json',
      },
      exposes: {
        // Global shared state lives in the host and is consumed by every remote.
        './store': './src/store/globalStore.ts',
      },
      shared: {
        react: { singleton: true, requiredVersion: false },
        'react-dom': { singleton: true, requiredVersion: false },
        // Singleton so there is exactly one zustand runtime backing the
        // single shared store instance across all micro-frontends.
        zustand: { singleton: true, requiredVersion: false },
      },
    }),
  ],
  server: {
    port: 3000,
  },
});
