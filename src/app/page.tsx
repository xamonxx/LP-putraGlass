import { HeaderNav } from '../components/HeaderNav';
import { HeroSection } from '../components/HeroSection';
import { ScrollStory } from '../components/ScrollStory';
import { ModelSection } from '../components/ModelSection';
import { ConfiguratorSection } from '../components/ConfiguratorSection';
import { HotspotDetailSection } from '../components/HotspotDetailSection';
import { AntifogDemoSection } from '../components/AntifogDemoSection';
import { HowToOrderSection } from '../components/HowToOrderSection';
import { LeadFormSection } from '../components/LeadFormSection';
import { FaqSection } from '../components/FaqSection';
import { FooterSection } from '../components/FooterSection';
import { FaqSchema } from '../components/FaqSchema';

export default function LandingPage() {
  return (
    <div className="pg">
      <HeaderNav overlay />
      <main id="main-content">
        <HeroSection />
        <ScrollStory kind="light" />
        <ModelSection />
        <ConfiguratorSection />
        <HotspotDetailSection />
        <AntifogDemoSection />
        <ScrollStory kind="workshop" />
        <HowToOrderSection />
        <LeadFormSection />
        <FaqSection />
      </main>
      <FooterSection />
      <FaqSchema />
    </div>
  );
}
