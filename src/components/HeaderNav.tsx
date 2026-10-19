'use client';

import type { LeadSourceCode } from '../lib/tracking';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { buildWhatsAppLink, getStoredLeadSource, trackLeadClick } from '../lib/tracking';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './HeaderNav.module.css';

const NAV_ITEMS = [
  { label: 'Model', href: '#model' },
  { label: 'Rancang', href: '#rancang' },
  { label: 'Cara pesan', href: '#cara-pesan' },
  { label: 'Workshop', href: '#workshop' },
  { label: 'FAQ', href: '#faq' },
];

const WA_MSG = 'Halo Putra Glass, saya mau tanya cermin LED.';

export function HeaderNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const [leadCode, setLeadCode] = useState<LeadSourceCode>('LP-LANGSUNG');
  useEffect(() => {
    setLeadCode(getStoredLeadSource());
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      window.addEventListener('keydown', handleEscapeKey);
      return () => window.removeEventListener('keydown', handleEscapeKey);
    }
  }, [isMenuOpen]);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuItemClick = () => {
    setIsMenuOpen(false);
  };

  const handleWhatsAppClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.href = buildWhatsAppLink(WA_MSG, leadCode);
    trackLeadClick('header_nav');
  };

  const waUrl = buildWhatsAppLink(WA_MSG, leadCode);

  return (
    <header
      ref={headerRef}
      className={styles.header}
      data-scrolled={isScrolled}
    >
      <div className={styles.container}>
        {/* Logo */}
        <Link
          href="/"
          className={styles.logo}
          aria-label="Putra Glass Beranda"
        >
          <svg
            width="44"
            height="24"
            viewBox="0 0 44 24"
            aria-hidden="true"
            className={styles.logoSvg}
          >
            <rect
              x="5"
              y="5"
              width="14"
              height="14"
              transform="rotate(45 12 12)"
              fill="var(--slate)"
            />
            <rect
              x="15"
              y="5"
              width="14"
              height="14"
              transform="rotate(45 22 12)"
              fill="var(--navy)"
              stroke="rgba(255,255,255,.45)"
              strokeWidth="1"
            />
            <rect
              x="25"
              y="5"
              width="14"
              height="14"
              transform="rotate(45 32 12)"
              fill="var(--slate-light)"
            />
          </svg>
          <span className={styles.brandText}>PUTRA GLASS</span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className={styles.navDesktop}
          aria-label="Menu utama"
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={styles.navLink}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWhatsAppClick}
          className={styles.ctaPrimary}
        >
          Chat WhatsApp
        </a>

        {/* Mobile Menu Button */}
        <button
          className={styles.menuButton}
          onClick={handleMenuToggle}
          aria-expanded={isMenuOpen}
          aria-label="Menu navigasi"
          aria-controls="mobile-menu"
        >
          <span className={styles.hamburger} aria-hidden="true" />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className={styles.mobileMenuBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.nav
              id="mobile-menu"
              className={styles.mobileMenu}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1],
              }}
              onClick={(e) => e.stopPropagation()}
              role="navigation"
              aria-label="Menu navigasi mobile"
            >
              <div className={styles.mobileMenuHeader}>
                <button
                  className={styles.closeButton}
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Tutup menu"
                >
                  ✕
                </button>
              </div>

              <div className={styles.mobileMenuContent}>
                {NAV_ITEMS.map((item, idx) => (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    className={styles.mobileNavLink}
                    onClick={handleMenuItemClick}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: idx * 0.05,
                      duration: 0.3,
                    }}
                  >
                    {item.label}
                  </motion.a>
                ))}
              </div>

              <motion.a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  handleWhatsAppClick(e as React.MouseEvent<HTMLAnchorElement>);
                  handleMenuItemClick();
                }}
                className={styles.mobileCtaPrimary}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: NAV_ITEMS.length * 0.05,
                  duration: 0.3,
                }}
              >
                Chat WhatsApp
              </motion.a>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
