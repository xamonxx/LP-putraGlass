'use client';
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { PRODUCTS } from '../lib/products';
import styles from './CatalogSelect.module.css';

export function CatalogSelect({ value, onChange }: { value: string | null; onChange: (id: string) => void }) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const selected = PRODUCTS.findIndex(product => product.id === value);
  const [active, setActive] = useState(0);
  const search = useRef({ text: '', time: 0 });
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [open]);
  useEffect(() => {
    if (open) document.getElementById(`${id}-option-${active}`)?.scrollIntoView({ block: 'nearest' });
  }, [open, active, id]);
  const choose = (index: number) => { onChange(PRODUCTS[index].id); setOpen(false); };
  const keyboard = (event: KeyboardEvent<HTMLButtonElement>) => {
    const { key } = event;
    if (key === 'Tab') { setOpen(false); return; }
    if (key === 'Escape') { if (open) { event.preventDefault(); event.stopPropagation(); setOpen(false); } return; }
    if (['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', ' '].includes(key)) {
      event.preventDefault();
      if ((key === 'Enter' || key === ' ') && open) { choose(active); return; }
      const initial = selected >= 0 ? selected : 0;
      setActive(key === 'Home' ? 0 : key === 'End' ? PRODUCTS.length - 1 : !open ? initial : key === 'ArrowDown' ? (active + 1) % PRODUCTS.length : key === 'ArrowUp' ? (active - 1 + PRODUCTS.length) % PRODUCTS.length : active);
      setOpen(true); return;
    }
    if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const now = Date.now();
      search.current = { text: (now - search.current.time < 700 ? search.current.text : '') + key.toLowerCase(), time: now };
      const match = PRODUCTS.findIndex(product => product.name.toLowerCase().replace(/^cermin led /, '').startsWith(search.current.text) || product.name.toLowerCase().startsWith(search.current.text));
      if (match >= 0) { setActive(match); setOpen(true); }
    }
  };
  return <div ref={root} className={styles.root} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false); }}>
    <label id={`${id}-label`} htmlFor={`${id}-trigger`} className={styles.label}>Mulai dari koleksi</label>
    <button id={`${id}-trigger`} type="button" role="combobox" aria-labelledby={`${id}-label`} aria-haspopup="listbox" aria-expanded={open} aria-controls={open ? `${id}-list` : undefined} aria-activedescendant={open ? `${id}-option-${active}` : undefined} className={styles.trigger} onKeyDown={keyboard} onClick={() => { setActive(selected >= 0 ? selected : 0); setOpen(current => !current); }}>
      <span>{selected >= 0 ? PRODUCTS[selected].name : 'Bentuk custom'}</span><svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m5 8 5 5 5-5"/></svg>
    </button>
    {open && <ul id={`${id}-list`} role="listbox" aria-labelledby={`${id}-label`} className={styles.list}>
      {PRODUCTS.map((product, index) => <li id={`${id}-option-${index}`} key={product.id} role="option" aria-selected={selected === index} data-active={active === index} className={styles.option} onMouseDown={event => event.preventDefault()} onClick={() => choose(index)} onPointerMove={() => setActive(index)}>
        <span>{product.name}</span><span aria-hidden="true">{selected === index ? '✓' : ''}</span>
      </li>)}
    </ul>}
  </div>;
}
