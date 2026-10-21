import { QuoteLink } from './QuoteLink';
import styles from './Showroom.module.css';
const STEPS = [
  ['Ceritakan kebutuhan Anda', 'Kirim model, ukuran dinding, dan kota tujuan. Foto ruangan membantu kami memahami kebutuhan Anda.'],
  ['Terima penawarannya', 'Admin mengonfirmasi pilihan, harga akhir, dan pengiriman. Produksi dimulai setelah DP 50%.'],
  ['Dikerjakan di workshop', 'Cermin dibuat per pesanan di Citatah. Produksi 1–5 hari kerja setelah DP; jadwal dikonfirmasi admin.'],
  ['Disiapkan untuk ruang Anda', 'Pelunasan dilakukan sebelum dikirim. Pilih pengiriman atau ambil sendiri di workshop.'],
];
export function HowToOrderSection({ asPage = false }: { asPage?: boolean }) { const Title = asPage ? 'h1' : 'h2'; return <section id="cara-pesan" className={`${styles.section} ${styles.order}`}><div className="wrap"><div className={styles.sectionHead}><div><span className="eyebrow">Dari ide, menjadi nyata</span><Title className={styles.title}>Mulai dengan<br/>sebuah percakapan.</Title></div><QuoteLink className="text-link" source="cara_pesan_konsultasi">Konsultasi & penawaran ↗</QuoteLink></div><div className={styles.steps}>{STEPS.map(([title, text], i) => <article key={title} className={styles.step}><span>0{i + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>; }