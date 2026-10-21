import catalog from '../data/products.json';
import images from '../data/images-meta.json';

export type Shape = 'capsul' | 'rectangle' | 'oval' | 'round' | 'leaf' | 'halfmoon';
export interface ModelDescriptor {
  tier: 'A' | 'B' | 'C' | 'D';
  kind: 'parametric' | 'photo' | 'glb';
  note: string;
}
export interface Product {
  id: string; slug: string; name: string; category: string; image: string; description: string;
  shape: Shape; dimensions: { width: number; height: number } | null;
  verifiedPrice: number | null; availabilityStatus: 'unknown' | 'available' | 'unavailable';
  verifiedSourceUrl: string | null; lastVerifiedAt: string | null;
  supportedFeatures: string[]; source: string; model: ModelDescriptor;
}
export const PRODUCTS = catalog as Product[];
export const getProduct = (id: string) => PRODUCTS.find(p => p.id === id || p.slug === id);
export const getProductImage = (product: Product) => (images as Record<string, { files: { fallback: string } }>)[product.image]?.files.fallback ?? `/assets/${product.image}.jpg`;
export const SHAPE_NAMES: Record<Shape, string> = { capsul: 'Capsul', rectangle: 'Rectangle', oval: 'Oval', round: 'Round', leaf: 'Leaf', halfmoon: 'Half Moon' };
export const canModel = (shape: Shape) => ['capsul', 'rectangle', 'oval', 'round'].includes(shape);
export const VISUALIZATION_LABEL = 'Simulasi visual — detail akhir dikonfirmasi saat konsultasi.';
