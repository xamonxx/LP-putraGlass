import Link from 'next/link';
import { HeaderNav } from '../components/HeaderNav';
import { FooterSection } from '../components/FooterSection';
export default function NotFound() { return <><HeaderNav/><main id="main-content" className="wrap" style={{ paddingBlock: 100 }}><span className="eyebrow">404 / Putra Glass</span><h1>Halaman belum ditemukan.</h1><p>Mari kembali melihat koleksi cermin yang tersedia.</p><Link href="/katalog" className="button-primary">Kembali ke katalog →</Link></main><FooterSection/></>; }
