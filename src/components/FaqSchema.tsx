import { FAQ_ITEMS } from '../data/faq';
export function FaqSchema() {
  const faq = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ_ITEMS.map(item => ({ '@type': 'Question', name: item.pertanyaan, acceptedAnswer: { '@type': 'Answer', text: item.jawaban } })) };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq).replace(/</g, '\\u003c') }}/>;
}
