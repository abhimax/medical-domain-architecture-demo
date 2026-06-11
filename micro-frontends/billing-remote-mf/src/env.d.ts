/// <reference types="@rsbuild/core/types" />

/**
 * Imports the SVG file as a React component.
 * @requires [@rsbuild/plugin-svgr](https://npmjs.com/package/@rsbuild/plugin-svgr)
 */
declare module '*.svg?react' {
  import type React from 'react';
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

/**
 * Federated module exposed by the host (provider_host_mf): the shared global
 * store. Imported by this remote to read/write cross-MF state.
 */
declare module 'provider_host_mf/store' {
  export interface GlobalState {
    selectedPatientId: number | null;
    setSelectedPatientId: (id: number | null) => void;
  }
  type Selector<T> = (state: GlobalState) => T;
  export const useGlobalStore: {
    (): GlobalState;
    <T>(selector: Selector<T>): T;
    getState: () => GlobalState;
    setState: (partial: Partial<GlobalState>) => void;
    subscribe: (listener: (state: GlobalState) => void) => () => void;
  };
}
