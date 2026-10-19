# Worker penerima lead — Putra Glass

Landing page ini static export (`output: 'export'`), jadi tidak punya server sendiri.
Worker ini yang menerima POST dari `LeadFormSection`, memvalidasi ulang isinya,
menahan spam per IP, menyimpan lead ke KV, lalu mengirim notifikasi ke Telegram
admin (opsional).

Worker bersifat **opsional**. Kalau `NEXT_PUBLIC_LEAD_ENDPOINT` di landing page
dibiarkan kosong, form tetap jalan penuh: lead mengalir lewat deep link WhatsApp
saja, tanpa satu pun request ke worker ini.

## Yang dibutuhkan

- Akun Cloudflare (paket gratis cukup)
- `npx wrangler@latest` (tidak perlu dipasang global)
- Semua perintah di bawah dijalankan dari folder ini: `workers/lead`

## 1. Login

```bash
npx wrangler login
```

## 2. Buat KV namespace

```bash
npx wrangler kv namespace create LEADS_KV
npx wrangler kv namespace create LEADS_KV --preview
```

Dua perintah itu mencetak `id` dan `preview_id`. Salin keduanya ke
`wrangler.toml`, menggantikan `GANTI_DENGAN_ID_KV_PRODUKSI` dan
`GANTI_DENGAN_ID_KV_PREVIEW`.

## 3. Isi origin yang diizinkan

Di `wrangler.toml`, bagian `[vars]`:

```toml
ALLOWED_ORIGIN = "https://putraglass.id,https://www.putraglass.id"
```

Dipisah koma, tanpa garis miring di akhir. Request dari origin di luar daftar ini
dibalas `403 origin_tidak_diizinkan`. Tambahkan `http://localhost:3000` kalau mau
mengetes dari dev server.

## 4. Notifikasi Telegram (opsional)

Lewati langkah ini kalau belum butuh notifikasi.

1. Buat bot lewat [@BotFather](https://t.me/BotFather), salin tokennya.
2. Kirim satu pesan ke bot itu, lalu buka
   `https://api.telegram.org/bot<TOKEN>/getUpdates` untuk membaca `chat.id`.
3. Simpan keduanya sebagai secret:

```bash
npx wrangler secret put TELEGRAM_BOT_TOKEN
npx wrangler secret put TELEGRAM_CHAT_ID
```

Kalau salah satu secret tidak ada, worker tetap jalan normal — hanya tidak
mengirim notifikasi.

## 5. Deploy

```bash
npx wrangler deploy
```

Wrangler mencetak URL worker, misalnya:

```
https://putraglass-lead.NAMA-AKUN.workers.dev
```

## 6. Sambungkan ke landing page

Buat file `.env.local` di root proyek landing (`Landing-pages_glass/.env.local`):

```
NEXT_PUBLIC_LEAD_ENDPOINT=https://putraglass-lead.NAMA-AKUN.workers.dev
```

Lalu build ulang situsnya:

```bash
npm run build
```

Variabel `NEXT_PUBLIC_*` ikut terbakar ke bundel saat build, jadi **situs wajib
di-build ulang** setiap kali nilainya berubah. Kosongkan kembali variabel itu
untuk mematikan pengiriman ke worker.

## Kontrak API

`POST /` dengan `Content-Type: application/json`:

```json
{
  "nama": "Rina",
  "whatsapp": "081237533173",
  "model": "Capsul",
  "panjangCm": 80,
  "lebarCm": 60,
  "catatan": "Pakai antifog",
  "lead_code": "LP-META",
  "varian": { "cta_style": "urgensi" },
  "utm": { "utm_source": "facebook" }
}
```

Balasan sukses:

```json
{ "ok": true, "key": "lead:1760000000000:1a2b3c4d", "whatsapp": "6281237533173" }
```

Kode kesalahan:

| Status | `error` | Arti |
| --- | --- | --- |
| 403 | `origin_tidak_diizinkan` | Origin tidak ada di `ALLOWED_ORIGIN` |
| 400 | `json_rusak` | Body bukan JSON yang sah |
| 422 | `nama_tidak_valid`, `whatsapp_tidak_valid`, `model_kosong`, `ukuran_tidak_valid` | Payload ditolak validasi |
| 429 | `terlalu_sering` | Lebih dari 5 submit per IP dalam 10 menit |
| 405 | `metode_tidak_didukung` | Bukan POST/OPTIONS |
| 500 | `kv_belum_terpasang`, `gagal_simpan` | Binding KV salah atau KV menolak tulisan |

Nomor WhatsApp selalu dinormalisasi ke format `62xxxxxxxxxx` sebelum disimpan.

## Membaca lead yang masuk

```bash
npx wrangler kv key list --binding LEADS_KV --prefix "lead:"
npx wrangler kv key get --binding LEADS_KV "lead:1760000000000:1a2b3c4d"
```

Lead disimpan dengan TTL 1 tahun. Kunci `rl:<ip>` adalah penghitung rate limit
dan kedaluwarsa sendiri setelah 10 menit.

## Catatan

- Folder `workers/` ada di luar `src/` dan di-`exclude` dari `tsconfig.json`
  situs, jadi tidak ikut ter-compile saat `npm run build`.
- Worker tidak memakai dependency npm sama sekali — hanya API bawaan Workers.
