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
  sizes = '100vw',
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
      // eslint-disable-next-line @next/next/no-img-element -- ekspor statis: optimasi gambar dibuat sendiri (AVIF/WebP + srcset)
      <img
        src={`/assets/${name}.jpg`}
        alt={alt}
        className={className}
        style={style}
        loading={priority ? 'eager' : loading}
      />
    );
  }

  const sourceWidths = (format: 'avif' | 'webp') => Object.keys(meta.files[format])
    .filter((width) => width !== 'default' && /^\d+$/.test(width))
    .sort((a, b) => Number(a) - Number(b));

  const avifSrcSet = sourceWidths('avif')
    .map((w) => `${meta.files.avif[w]} ${w}w`)
    .join(', ');

  const webpSrcSet = sourceWidths('webp')
    .map((w) => `${meta.files.webp[w]} ${w}w`)
    .join(', ');

  return (
    <picture>
      <source type="image/avif" srcSet={avifSrcSet} sizes={sizes} />
      <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />
      {/* eslint-disable-next-line @next/next/no-img-element -- ekspor statis, srcset dibuat sendiri */}
      <img
        src={meta.files.fallback}
        alt={alt}
        width={meta.originalWidth}
        height={meta.originalHeight}
        className={className}
        style={{
          width: '100%',
          height: 'auto',
          ...style,
        }}
        loading={priority ? 'eager' : loading}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : undefined}
      />
    </picture>
  );
}
