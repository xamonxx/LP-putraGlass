# Product provenance and completeness

Catalog source: src/data/products.json. Responsive assets: src/data/images-meta.json. Owner approved using repository assets on 20 October 2026. Local PRD identifies catalog renders and workshop/installation photographs received on 18 October. Marketplace access was blocked; no Tokopedia product page, price, stock, or dimensions were independently verified. No remote product image hotlinks.

| Product | Image key | Visualization | Verified dimensions / price / listing |
|---|---|---|---|
| Capsul | model-capsul | Tier C parametric | Unavailable |
| Rectangle | model-rectangle | Tier C parametric | Unavailable |
| Leaf | model-leaf | Tier D photograph/render | Unavailable |
| Half Moon | model-halfmoon | Tier D photograph/render | Unavailable |

Oval and Round are existing custom-configuration shapes, not invented marketplace listings. Their sketch and Tier C geometry do not imply a photographed stock item. Customer-entered sizes are design requests. LED/control/antifog selectors describe existing custom requirements, not verified combinations for each marketplace product.

Story assets: pasang-cafe / pasang-hotel are local installation documentation, without invented customer identity; model-capsul / model-rectangle / custom-octagon are catalog renders. workshop-poles / proses-led / workshop-led document workshop stages. Antifog assets remain labeled illustrative renders. Products currently have one source image each; additional gallery photographs were not invented.

## Import

`npm run catalog:validate` validates schema and every referenced local image. `npm run catalog:import -- owner-catalog.json` is a dry run. Add `--write` to import the complete supplied array and optimize new assets. Start from the checked-in products.json structure. Optional assetPath resolves relative to owner JSON. Required source documents reuse authorization and provenance; fields not known must remain null/unknown. Facts need lastVerifiedAt (YYYY-MM-DD). URL validation only permits listings in the designated Tokopedia store; it does not perform remote verification.

Import validates all entries and decodes source images before output, generates local WebP/AVIF at 320/480/640/1024/1600 widths without upscaling, hashes original bytes for deterministic names and deduplication, and updates responsive metadata plus catalog. Existing variants are reused where available. Build-time catalog edits require rebuilding static routes. GLB and Tier A/B onboarding is deliberately rejected by this importer until a reviewed model loader/data mapping is added.

Still needed: owner-confirmed listing URLs, dimensions per variant, approved complete galleries, availability/pricing dates if public offers are desired, authentic approved reviews, final warranty terms, high-resolution official logo, and CAD/GLB or rear/side measurements for higher modeling fidelity.
