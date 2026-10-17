/**
 * Script untuk men-generate landing/public/harga.json saat build.
 * Hanya mengekstrak harga publik (tarif m2 B2C, basic, kelipatan, harga minimum, add-on).
 * HARGA NET, ONGKIR NET, DAN BATAS POTONGAN TIDAK BOLEH MASUK KE FILE INI.
 */

const fs = require('fs');
const path = require('path');

const publicPriceBook = {
  versi: 1,
  tarif_m2: {
    premium_b2c: 1750000,
    basic_m2: 1550000
  },
  pembulatan: {
    cermin_kelipatan: 5000,
    harga_minimum_custom: 650000
  },
  batas_produksi: {
    min_dimensi_cm: 30,
    max_dimensi_cm: 200
  },
  add_on: {
    touchscreen: 0,
    sensor_baterai: 250000,
    antifog: 200000
  }
};

// Validasi ketat: pastikan tidak ada data rahasia
const forbiddenKeys = ['net', 'ongkir_net', 'potongan', 'batas_admin', 'margin', 'owner', 'rahasia'];
const jsonString = JSON.stringify(publicPriceBook);

for (const key of forbiddenKeys) {
  if (jsonString.toLowerCase().includes(key)) {
    throw new Error(`KEAMANAN GAGAL: Terdeteksi kata terlarang '${key}' dalam data harga publik landing page!`);
  }
}

const outPath = path.resolve(__dirname, '../public/harga.json');
fs.writeFileSync(outPath, JSON.stringify(publicPriceBook, null, 2), 'utf8');
console.log('✓ landing/public/harga.json berhasil di-generate secara aman di:', outPath);
