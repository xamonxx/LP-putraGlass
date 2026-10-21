const shapes = new Set(['capsul', 'rectangle', 'oval', 'round', 'leaf', 'halfmoon']);
const slugs = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
function validateCatalog(rows, metadata) {
  if (!Array.isArray(rows) || !rows.length) throw new Error('Catalog must be a non-empty JSON array.');
  const ids = new Set(), names = new Set();
  for (const item of rows) {
    if (!slugs.test(item.id ?? '') || !slugs.test(item.slug ?? '')) throw new Error('id and slug must be lowercase URL-safe names.');
    if (ids.has(item.id) || names.has(item.slug)) throw new Error(`Duplicate identity: ${item.id}`);
    ids.add(item.id); names.add(item.slug);
    for (const field of ['name', 'description', 'category', 'source']) if (typeof item[field] !== 'string' || !item[field].trim()) throw new Error(`${item.id}: missing ${field}`);
    if (!shapes.has(item.shape)) throw new Error(`${item.id}: unsupported shape`);
    if (!['A', 'B', 'C', 'D'].includes(item.model?.tier) || !['parametric', 'photo', 'glb'].includes(item.model?.kind) || typeof item.model?.note !== 'string') throw new Error(`${item.id}: model provenance required`);
    if (item.model.tier === 'A' || item.model.tier === 'B' || item.model.kind === 'glb') throw new Error(`${item.id}: this importer supports Tier C parametric / Tier D photo only; verified model onboarding needs a reviewed model asset`);
    if (['leaf', 'halfmoon'].includes(item.shape) && item.model.tier !== 'D') throw new Error(`${item.id}: no reviewed 3D geometry available`);
    if (!Array.isArray(item.supportedFeatures) || item.supportedFeatures.some(feature => typeof feature !== 'string')) throw new Error(`${item.id}: invalid supportedFeatures`);
    if (item.dimensions !== null && (!Number.isFinite(item.dimensions?.width) || !Number.isFinite(item.dimensions?.height) || item.dimensions.width <= 0 || item.dimensions.height <= 0)) throw new Error(`${item.id}: invalid dimensions`);
    if (item.verifiedPrice !== null && (!Number.isFinite(item.verifiedPrice) || item.verifiedPrice < 0)) throw new Error(`${item.id}: invalid price`);
    if (!['unknown', 'available', 'unavailable'].includes(item.availabilityStatus)) throw new Error(`${item.id}: invalid availability`);
    if (item.verifiedSourceUrl !== null) {
      const url = new URL(item.verifiedSourceUrl);
      if (url.protocol !== 'https:' || !['www.tokopedia.com', 'tokopedia.com'].includes(url.hostname) || !url.pathname.startsWith('/putra-glass-859/')) throw new Error(`${item.id}: listing must belong to the designated Tokopedia store`);
    }
    if (item.lastVerifiedAt !== null && !/^\d{4}-\d{2}-\d{2}$/.test(item.lastVerifiedAt)) throw new Error(`${item.id}: invalid verification date`);
    if ((item.verifiedSourceUrl || item.verifiedPrice !== null || item.availabilityStatus !== 'unknown' || item.dimensions !== null) && !item.lastVerifiedAt) throw new Error(`${item.id}: facts need an explicit verification date`);
    if (!item.assetPath && !metadata[item.image]) throw new Error(`${item.id}: image is missing from responsive manifest`);
  }
}

module.exports = { validateCatalog };
