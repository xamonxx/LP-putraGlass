'use client';
import type { ReactNode } from 'react';
export function ScrollToButton({ target, className, children }: { target: string; className?: string; children: ReactNode }) {
  return <button type="button" className={className} onClick={() => {
    const destination = document.getElementById(target);
    if (!destination) return;
    destination.scrollIntoView({ behavior: 'instant', block: 'start' });
    destination.tabIndex = -1;
    destination.focus({ preventScroll: true });
  }}>{children}</button>;
}
