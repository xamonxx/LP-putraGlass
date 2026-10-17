import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { hitungPenawaran } from '../../src/lib/pricing/pricing';
import { defaultPriceBookV1 } from '../../src/lib/pricing/default-price-book';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Panggil fungsi Kalkulator aplikasi CS secara langsung (bukan rumus tiruan)
const penawaran = hitungPenawaran({
  items: [
    {
      bentuk_kode: 'rectangle',
      panjang_mm: 800,
      lebar_mm: 600,
      lampu: '3_warna',
      kontrol: 'touchscreen',
      antifog: true,
      qty: 1,
    },
  ],
  segmen: 'B2C',
  user_role: 'admin',
}, defaultPriceBookV1);

const hargaItem = penawaran.items[0].harga_satuan_item;

// 2. Validasi mutlak: kalau hasilnya bukan 1.040.000, batalkan build
if (hargaItem !== 1_040_000) {
  console.error(`FATAL: Kalkulator aplikasi CS menghasilkan ${hargaItem}, bukan 1.040.000!`);
  process.exit(1);
}

const hargaFormatted = `Rp${hargaItem.toLocaleString('id-ID')}`;
const teks = `Gambaran harga: Rectangle 60 × 80 cm, LED 3 warna, touchscreen, antifog ${hargaFormatted} belum ongkir.`;

const outDir = path.resolve(__dirname, '../src/data');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(
  path.join(outDir, 'gambaran-harga.json'),
  JSON.stringify({ teks, angka: hargaItem, formatted: hargaFormatted }, null, 2),
  'utf8'
);

console.log('✓ gambaran-harga.json berhasil dihitung via kalkulator CS:', teks);
