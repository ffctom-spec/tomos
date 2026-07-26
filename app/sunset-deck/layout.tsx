import { ReactNode } from 'react';
import AuthGate from './auth-gate';

export default function SunsetDeckLayout({ children }: { children: ReactNode }) {
  return <AuthGate>{children}</AuthGate>;
}
