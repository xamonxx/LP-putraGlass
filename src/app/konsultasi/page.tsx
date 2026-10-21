import { PageFrame } from '../../components/PageFrame';
import { LeadFormSection } from '../../components/LeadFormSection';
import { SITE_PAGES, pageMetadata } from '../../lib/site-pages';
export const metadata = pageMetadata(SITE_PAGES.consultation);
export default function ConsultationPage() {
  return <PageFrame page={SITE_PAGES.consultation}><LeadFormSection asPage/></PageFrame>;
}
