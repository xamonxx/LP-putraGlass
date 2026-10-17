'use client';

import React, { useState } from 'react';
import { FAQ_LIST } from '../lib/constants';

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="faq" style={{ background: '#F3F5F8', color: '#1B2233', padding: '96px 0' }}>
      <div className="wrap">
        <h2 className="h2 disp" style={{ margin: 0, color: '#253254' }}>
          pertanyaan umum.
        </h2>
        <p style={{ margin: '18px 0 0', maxWidth: '36em', fontSize: '18px', lineHeight: 1.6, color: '#4A5468' }}>
          Hal-hal yang sering ditanyakan pembeli sebelum memesan cermin custom.
        </p>

        <div className="faq-container" style={{ maxWidth: '820px', display: 'flex', flexDirection: 'column' }}>
          {FAQ_LIST.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '14px',
                  border: '1.5px solid #DCE3ED',
                  overflow: 'hidden',
                  transition: 'border-color 200ms ease',
                }}
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                  className="faq-btn"
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '20px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: '#253254',
                    fontFamily: 'inherit',
                  }}
                >
                  <span className="disp" style={{ fontSize: '18px', lineHeight: 1.3 }}>
                    {faq.tanya}
                  </span>
                  <span
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 200ms ease',
                      flexShrink: 0,
                      color: '#275087',
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </button>

                {isOpen && (
                  <div
                    className="faq-answer"
                    style={{
                      lineHeight: 1.65,
                      color: '#4A5468',
                      borderTop: '1px solid #F1F4F8',
                      paddingTop: '16px',
                    }}
                  >
                    {faq.jawab}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
