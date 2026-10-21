import Link from 'next/link';
import { PageFrame } from '../../components/PageFrame';
import { HowToOrderSection } from '../../components/HowToOrderSection';
import { SITE_PAGES, pageMetadata } from '../../lib/site-pages';
import styles from '../../components/Showroom.module.css';
export const metadata = pageMetadata(SITE_PAGES.order);
export default function OrderPage() {
  return <PageFrame page={SITE_PAGES.order}><HowToOrderSection asPage/><div className={`wrap ${styles.pageFollowup}`}><p>Siapkan bentuk, perkiraan ukuran dan kota tujuan Anda. Admin membantu mengonfirmasi detail dan penawarannya.</p><Link className="button-primary" href="/konsultasi">Mulai konsultasi →</Link><Link className="text-link" href="/faq">Baca pertanyaan umum →</Link></div></PageFrame>;
}
