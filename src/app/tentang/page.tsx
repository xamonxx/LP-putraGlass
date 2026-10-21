import { PageFrame } from '../../components/PageFrame';
import Link from 'next/link';
import { SITE_PAGES, pageMetadata } from '../../lib/site-pages';
import { ScrollStory } from '../../components/ScrollStory';
import styles from '../../components/Showroom.module.css';

export const metadata = pageMetadata(SITE_PAGES.about);

export default function AboutPage() {
  return (
    <PageFrame page={SITE_PAGES.about}>
      <div className={`wrap ${styles.pageIntro}`}>
        <span className="eyebrow">Tentang Putra Glass</span>
        <h1 className={styles.title}>Dari workshop kami,<br/>untuk ruang Anda.</h1>
        <p>Berawal di Citatah, Bandung Barat. Kami membantu menyesuaikan bentuk, ukuran, dan pilihan cahaya cermin untuk ruang Anda. Detail pesanan dibicarakan langsung dengan workshop sebelum pengerjaan.</p>
      </div>
      <ScrollStory kind="workshop" standalone />
      <div className={`wrap ${styles.pageFollowup}`}>
        <Link className="button-primary" href="/konsultasi">Bicarakan kebutuhan Anda ↗</Link>
        <Link className="text-link" href="/cara-pesan">Lihat cara pesan</Link>
      </div>
    </PageFrame>
  );
}
