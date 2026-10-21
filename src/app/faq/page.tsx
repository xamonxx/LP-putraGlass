import { PageFrame } from '../../components/PageFrame';
import { FaqSection } from '../../components/FaqSection';
import { FaqSchema } from '../../components/FaqSchema';
import { SITE_PAGES, pageMetadata } from '../../lib/site-pages';
export const metadata = pageMetadata(SITE_PAGES.faq);
export default function FaqPage() {
  return <PageFrame page={SITE_PAGES.faq}><FaqSection asPage/><FaqSchema/></PageFrame>;
}
