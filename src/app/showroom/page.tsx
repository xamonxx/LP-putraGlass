import { PageFrame } from '../../components/PageFrame';
import { ConfiguratorSection } from '../../components/ConfiguratorSection';
import { HotspotDetailSection } from '../../components/HotspotDetailSection';
import { AntifogDemoSection } from '../../components/AntifogDemoSection';
import { SITE_PAGES, pageMetadata } from '../../lib/site-pages';
export const metadata = pageMetadata(SITE_PAGES.showroom);
export default function ShowroomPage() {
  return <PageFrame page={SITE_PAGES.showroom}><ConfiguratorSection asPage/><HotspotDetailSection/><AntifogDemoSection/></PageFrame>;
}
