import { PageFrame } from '../../components/PageFrame';
import { ModelSection } from '../../components/ModelSection';
import { SITE_PAGES, pageMetadata } from '../../lib/site-pages';
export const metadata = pageMetadata(SITE_PAGES.catalog);
export default function CatalogPage() { return <PageFrame page={SITE_PAGES.catalog}><ModelSection full/></PageFrame>; }
