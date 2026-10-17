'use client';

import { useEffect } from 'react';
import { initUtmTracking, trackPageView } from '../lib/tracking';

export function ClientInit() {
  useEffect(() => {
    initUtmTracking();
    trackPageView();
  }, []);

  return null;
}
