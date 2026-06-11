import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: 'billing_remote_mf',
      // The manifest the host loads to discover this remote's exposes.
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App.tsx',
      },
      remotes: {
        // Consume the host's exposed global state (zustand store) and the
        // shared theme toggle button.
        provider_host_mf:
          'provider_host_mf@http://localhost:3000/mf-manifest.json',
      },
      shared: {
        react: { singleton: true, requiredVersion: false },
        'react-dom': { singleton: true, requiredVersion: false },
      },
    }),
  ],
  server: {
    port: 3003,
  },
});
