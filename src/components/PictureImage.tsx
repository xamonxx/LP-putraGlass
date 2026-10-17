import React from 'react';
import imagesMeta from '../data/images-meta.json';

interface PictureImageProps {
  name: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  sizes?: string;
}

export function PictureImage({
  name,
  alt,
  className,
  style,
  loading = 'lazy',
  priority = false,
  sizes = '(max-width: 600px) 48vw, (max-width: 860px) 50vw, 400px',
}: PictureImageProps) {
  const meta = (imagesMeta as Record<string, {
    originalWidth: number;
    originalHeight: number;
    files: {
      webp: Record<string, string>;
      avif: Record<string, string>;
      fallback: string;
    };
  }>)[name];

  if (!meta) {
    return (
      <img
        src={`/assets/${name}.jpg`}
        alt={alt}
        className={className}
        style={style}
        loading={priority ? 'eager' : loading}
      />
    );
  }

  const widths = ['320', '480', '640', '1024', '1600'];

  const avifSrcSet = widths
    .filter((w) => meta.files.avif[w])
    .map((w) => `${meta.files.avif[w]} ${w}w`)
    .join(', ');

  const webpSrcSet = widths
    .filter((w) => meta.files.webp[w])
    .map((w) => `${meta.files.webp[w]} ${w}w`)
    .join(', ');

  return (
    <picture>
      <source type="image/avif" srcSet={avifSrcSet} sizes={sizes} />
      <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />
      <img
        src={meta.files.fallback}
        alt={alt}
        width={meta.originalWidth}
        height={meta.originalHeight}
        className={className}
        style={style}
        loading={priority ? 'eager' : loading}
        decoding={priority ? 'sync' : 'async'}
      />
    </picture>
  );
}
