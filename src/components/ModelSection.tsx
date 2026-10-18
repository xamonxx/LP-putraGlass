import React from 'react';
import { PictureImage } from './PictureImage';

export function ModelSection() {
  return (
    <section id="model" style={{ background: '#F3F5F8', color: '#1B2233', padding: '96px 0' }}>
      <div className="wrap">
        <h2 className="h2 disp" style={{ margin: 0, color: '#253254' }}>
          custom atau model jadi?
        </h2>
        <p style={{ margin: '18px 0 0', maxWidth: '36em', fontSize: '18px', lineHeight: 1.6, color: '#4A5468' }}>
          Pilih custom kalau ukuran dindingmu tidak standar. Pilih model jadi kalau mau cepat dari katalog.
        </p>

        <div className="two model-two" style={{ marginTop: '56px' }}>
          {/* Jalur Custom */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <h3 className="disp" style={{ margin: 0, fontSize: '30px', color: '#253254' }}>
              custom
            </h3>
            <p style={{ margin: 0, fontSize: '16px', lineHeight: 1.6, color: '#4A5468', maxWidth: '28em' }}>
              Ukuran dan bentuk bebas. Untuk kamar mandi, kamar tidur, ruang tamu, toko, atau dinding dengan ukuran tidak standar.
            </p>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '15px', lineHeight: 1.8, color: '#1B2233' }}>
              <li>LED 3 warna atau LED 1 warna</li>
              <li>Touchscreen, atau sensor tangan dengan baterai</li>
              <li>Antifog bisa ditambahkan</li>
            </ul>
            <a href="#rancang" style={{ fontSize: '16px', fontWeight: 600, color: '#275087' }}>
              Rancang ukuran custom
            </a>
            <div style={{ marginTop: '14px', width: '100%' }}>
              <PictureImage
                name="custom-octagon"
                alt="Cermin LED bentuk oktagon dengan bingkai cahaya, memantulkan sofa dan dekorasi ruang tamu"
                sizes="(max-width: 860px) 100vw, 560px"
                style={{
                  width: '100%',
                  height: 'auto',
                  aspectRatio: '4 / 3',
                  objectFit: 'cover',
                  borderRadius: '16px',
                  boxShadow: '0 16px 40px rgba(20, 28, 51, 0.08)',
                  display: 'block',
                }}
              />
            </div>
          </div>

          {/* Jalur Model Jadi */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <h3 className="disp" style={{ margin: 0, fontSize: '30px', color: '#253254' }}>
              model jadi
            </h3>
            <p style={{ margin: 0, fontSize: '16px', lineHeight: 1.6, color: '#4A5468', maxWidth: '34em' }}>
              Bentuk dan ukuran katalog, seri sandblast atau tanpa sandblast. Pilih touchscreen, sensor tangan, atau baterai cas Type-C.
            </p>
            <a href="#rancang" style={{ fontSize: '16px', fontWeight: 600, color: '#275087' }}>
              Lihat semua bentuk katalog
            </a>
            <div className="shapes" style={{ marginTop: '14px' }}>
              <figure style={{ margin: 0 }}>
                <PictureImage
                  name="model-capsul"
                  alt="Cermin LED bentuk capsul"
                  sizes="(max-width: 860px) 50vw, 300px"
                  style={{ width: '100%', height: 'auto', aspectRatio: '1 / 1', objectFit: 'cover', borderRadius: '12px', display: 'block' }}
                />
                <figcaption style={{ marginTop: '10px', fontSize: '15px', fontWeight: 600, color: '#253254' }}>
                  capsul
                </figcaption>
              </figure>
              <figure style={{ margin: 0 }}>
                <PictureImage
                  name="model-leaf"
                  alt="Cermin LED bentuk leaf"
                  sizes="(max-width: 860px) 50vw, 300px"
                  style={{ width: '100%', height: 'auto', aspectRatio: '1 / 1', objectFit: 'cover', borderRadius: '12px', display: 'block' }}
                />
                <figcaption style={{ marginTop: '10px', fontSize: '15px', fontWeight: 600, color: '#253254' }}>
                  leaf
                </figcaption>
              </figure>
              <figure style={{ margin: 0 }}>
                <PictureImage
                  name="model-halfmoon"
                  alt="Cermin LED bentuk half moon"
                  sizes="(max-width: 860px) 50vw, 300px"
                  style={{ width: '100%', height: 'auto', aspectRatio: '1 / 1', objectFit: 'cover', borderRadius: '12px', display: 'block' }}
                />
                <figcaption style={{ marginTop: '10px', fontSize: '15px', fontWeight: 600, color: '#253254' }}>
                  half moon
                </figcaption>
              </figure>
              <figure style={{ margin: 0 }}>
                <PictureImage
                  name="model-rectangle"
                  alt="Cermin LED bentuk rectangle"
                  sizes="(max-width: 860px) 50vw, 300px"
                  style={{ width: '100%', height: 'auto', aspectRatio: '1 / 1', objectFit: 'cover', borderRadius: '12px', display: 'block' }}
                />
                <figcaption style={{ marginTop: '10px', fontSize: '15px', fontWeight: 600, color: '#253254' }}>
                  rectangle
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
