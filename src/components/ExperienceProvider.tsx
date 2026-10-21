'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { MotionConfig } from 'motion/react';
import { getProduct, type Shape } from '../lib/products';

export interface ConfiguratorState {
  productId: string | null; shape: Shape; width: string; height: string;
  led: '3_warna' | '1_warna'; control: 'touchscreen' | 'sensor_baterai';
  antifog: boolean; city: string; color: 'hangat' | 'natural' | 'putih'; power: boolean; preview: 'photo' | '3d' | 'room';
}
const DEFAULT: ConfiguratorState = { productId: 'capsul', shape: 'capsul', width: '60', height: '80', led: '3_warna', control: 'touchscreen', antifog: true, city: '', color: 'hangat', power: true, preview: 'photo' };
type ContextValue = { config: ConfiguratorState; update: (patch: Partial<ConfiguratorState>) => void; selectProduct: (id: string) => void };
const Context = createContext<ContextValue | null>(null);
export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState(DEFAULT);
  const update = (patch: Partial<ConfiguratorState>) => setConfig(current => ({ ...current, ...patch }));
  const selectProduct = (id: string) => {
    const product = getProduct(id);
    if (product) setConfig(current => ({ ...current, productId: product.id, shape: product.shape }));
  };
  useEffect(() => {
    document.documentElement.dataset.hydrated = 'true';
    return () => { delete document.documentElement.dataset.hydrated; };
  }, []);
  return <MotionConfig reducedMotion="user" transition={{ duration: .45, ease: [.22, 1, .36, 1] }}><Context.Provider value={{ config, update, selectProduct }}>{children}</Context.Provider></MotionConfig>;
}
export function useExperience() {
  const context = useContext(Context);
  if (!context) throw new Error('ExperienceProvider is required');
  return context;
}
