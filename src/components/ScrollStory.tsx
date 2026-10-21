'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'motion/react';
import { PictureImage } from './PictureImage';
import Link from 'next/link';
import { ScrollToButton } from './ScrollToButton';
import { LIGHT_STORY, WORKSHOP_STORY, type StoryChapter } from '../data/stories';
import { trackEvent } from '../lib/tracking';
import styles from './ScrollStory.module.css';

function Chapter({ chapter, index, progress, pinned, active, id }: { chapter: StoryChapter; index: number; progress: MotionValue<number>; pinned: boolean; active: number; id: string }) {
  const start = index / 4; const end = (index + 1) / 4;
  const opacity = useTransform(progress, [Math.max(0, start - .035), start, end - .035, end], index === 0 ? [1, 1, 1, 0] : index === 3 ? [0, 1, 1, 1] : [0, 1, 1, 0]);
  const y = useTransform(progress, [start, end], [12, -12]);
  const scale = useTransform(progress, [start, end], [1, 1.045]);
  const ambient = useTransform(progress, [.5, .58, .66, .75], ['rgba(255,192,120,.12)', 'rgba(255,226,174,.18)', 'rgba(221,235,255,.16)', 'rgba(221,235,255,.14)']);
  const clipPath = useTransform(progress, [start, Math.min(1, start + .045)], ['inset(0 3% 0 3%)', 'inset(0 0% 0 0%)']);
  return <motion.article id={`${id}-${chapter.id}`} data-chapter={index} className={styles.chapter} style={pinned ? { opacity, y } : undefined} aria-hidden={pinned && active !== index ? true : undefined} inert={pinned && active !== index}>
    <motion.div className={styles.visual} style={pinned ? { scale, clipPath } : undefined}>
      <span className={styles.visualIndex} aria-hidden="true">0{index + 1}</span>
      <figure><PictureImage name={chapter.asset} alt={chapter.alt} sizes="(min-width:1024px) 58vw, 100vw"/><figcaption><span>Catatan visual</span>{chapter.caption}</figcaption></figure>
      {id === 'cerita-cahaya' && index === 2 && <motion.div className={styles.ambient} style={pinned ? { backgroundColor: ambient } : undefined}/>} 
    </motion.div>
    <div className={styles.copy}>
      <div className={styles.chapterMeta}><span className={styles.number}>0{index + 1}</span><span>{chapter.id.replaceAll('-', ' ')}</span></div>
      <h3>{chapter.title}</h3><p>{chapter.text}</p>{chapter.cta && <Link className="text-link" href={chapter.cta.href}>{chapter.cta.label} ↗</Link>}
    </div>
  </motion.article>;
}
export function ScrollStory({ kind, standalone = false }: { kind: 'light' | 'workshop'; standalone?: boolean }) {
  const track = useRef<HTMLElement>(null);
  const [pinned, setPinned] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(85);
  const [active, setActive] = useState(0);
  const viewed = useRef(new Set<number>());
  const chapters = kind === 'light' ? LIGHT_STORY : WORKSHOP_STORY;
  const id = kind === 'light' ? 'cerita-cahaya' : 'workshop';
  const { scrollYProgress } = useScroll({ target: track, offset: [`start ${headerHeight}px`, 'end end'], trackContentSize: true });
  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const recordChapter = useCallback((index: number) => {
    try {
      if (localStorage.getItem('pg_cookie_consent') !== 'granted' || viewed.current.has(index)) return;
      const key = `pg_story_${id}_${index}`;
      if (sessionStorage.getItem(key) === '1') return;
      sessionStorage.setItem(key, '1'); viewed.current.add(index);
      trackEvent('story_chapter_view', { story: id, chapter: chapters[index].id });
    } catch { /* Optional analytics must not affect the story. */ }
  }, [id, chapters]);
  useEffect(() => {
    if (pinned || !track.current) return;
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) recordChapter(Number((entry.target as HTMLElement).dataset.chapter));
    }), { threshold: .35 });
    track.current.querySelectorAll('[data-chapter]').forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, [pinned, recordChapter]);
  useEffect(() => {
    const media = window.matchMedia('(min-width:1024px) and (min-height:700px) and (prefers-reduced-motion:no-preference)');
    const update = () => setPinned(media.matches);
    update(); media.addEventListener('change', update);
    const header = document.querySelector('header');
    const measure = () => setHeaderHeight(header?.getBoundingClientRect().height ?? 85);
    const observer = new ResizeObserver(measure);
    if (header) observer.observe(header);
    measure();
    return () => { media.removeEventListener('change', update); observer.disconnect(); };
  }, []);
  useMotionValueEvent(scrollYProgress, 'change', value => {
    if (!pinned) return;
    const index = Math.min(3, Math.max(0, Math.floor(value * 4)));
    setActive(current => current === index ? current : index);
    if (value > 0 && value < 1) recordChapter(index);
  });
  const goTo = useCallback((index: number, behavior: ScrollBehavior = 'smooth') => {
    const element = track.current;
    if (!element) return;
    const start = element.getBoundingClientRect().top + window.scrollY - headerHeight;
    const travel = element.offsetHeight - (window.innerHeight - headerHeight);
    window.scrollTo({ top: start + Math.max(0, travel) * (index / 4 + .08), behavior });
  }, [headerHeight]);
  useEffect(() => {
    if (!pinned) return;
    const restore = () => {
      const hash = window.location.hash.slice(1);
      const index = chapters.findIndex(chapter => hash === `${id}-${chapter.id}`);
      if (index >= 0) goTo(index, 'instant');
      else if (hash === id && track.current) window.scrollTo({ top: track.current.getBoundingClientRect().top + window.scrollY - headerHeight, behavior: 'instant' });
    };
    const frame = requestAnimationFrame(restore);
    window.addEventListener('hashchange', restore);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('hashchange', restore); };
  }, [pinned, chapters, goTo, headerHeight, id]);
  return <section ref={track} id={id} className={`${styles.story} ${kind === 'workshop' ? styles.workshop : styles.light}`} data-pinned={pinned} data-active-chapter={active} aria-labelledby={`${id}-title`}>
    <div className={styles.stage}>
      <div className={styles.top}><div className={styles.storyTitle}><span aria-hidden="true">01—04</span><h2 id={`${id}-title`}>{kind === 'light' ? 'Cahaya yang membentuk ruang' : 'Dibuat dengan perhatian pada setiap detail'}</h2></div><>{standalone ? <Link className={styles.skip} href="/cara-pesan">Cara pesan →</Link> : <ScrollToButton className={styles.skip} target={kind === 'light' ? 'model' : 'cara-pesan'}>Lewati cerita ↓</ScrollToButton>}</></div>
      <div className={styles.scene}>{chapters.map((chapter, index) => <Chapter key={chapter.id} chapter={chapter} index={index} progress={scrollYProgress} pinned={pinned} active={active} id={id}/>)}</div>
      <div className={styles.bottom}><ol className={styles.chapters} aria-label="Bab cerita">{chapters.map((chapter, index) => <li key={chapter.id}><button type="button" aria-current={active === index ? 'step' : undefined} onClick={() => goTo(index)}><span>0{index + 1}</span><span>{chapter.id.replaceAll('-', ' ')}</span></button></li>)}</ol><div className={styles.progress} aria-hidden="true"><motion.div className={styles.fill} style={{ scaleX: progress }}/></div></div>
    </div>
  </section>;
}
