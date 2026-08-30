import React, { useEffect, useRef } from 'react';
import { VIEEngine } from './core/engine';
import { VIEDiagnostics } from './diagnostics';
import './styles.css';
interface VIEProviderProps { children: React.ReactNode; debug?: boolean; }
export const VIEProvider: React.FC<VIEProviderProps> = ({ children, debug = false }) => {
  const engineRef = useRef<VIEEngine | null>(null);
  useEffect(() => {
    debug ? VIEDiagnostics.enable() : VIEDiagnostics.disable();
    if (!engineRef.current) engineRef.current = new VIEEngine();
    engineRef.current.start();
    return () => { engineRef.current?.stop(); };
  }, [debug]);
  return <>{children}</>;
};
