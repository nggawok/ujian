
# Starter Website Ujian CBT (GitHub Pages)

Website ujian **Computer-Based Test (CBT)** statis yang bisa di-host **gratis** di GitHub Pages. 
Cocok untuk latihan, kuis harian, placement test sederhana, atau ujian internal berisiko rendah.

> ⚠️ **Catatan Penting**: Ini adalah situs statis (tanpa server/backend). Kunci jawaban berada di sisi klien sehingga **tidak cocok untuk ujian berisiko tinggi**. Hasil peserta disimpan di **browser (localStorage)** peserta dan dapat diunduh sebagai CSV. Jika Anda butuh rekap terpusat, gunakan layanan pihak ketiga (mis. Formspree/Google Apps Script) atau beralih ke solusi ber-backend.

## Fitur
- Halaman depan + form identitas (Nama & ID Peserta) sebelum mulai ujian.
- Bank soal dalam format **JSON**.
- Acak urutan soal & opsi jawaban.
- Batasi jumlah soal yang ditampilkan (sampling) & durasi ujian (timer).
- Navigasi soal (Sebelumnya/ Berikutnya) + indikator progress.
- Penilaian otomatis, umpan balik skor & kunci jawaban opsional.
- Simpan hasil di localStorage; unduh hasil percobaan sebagai **CSV**.
- Desain responsif (mobile-friendly).

## Cara Pakai (Deploy ke GitHub Pages)
1. **Buat repository** di GitHub (misal: `cbt-ujian`).
2. **Upload** semua berkas di folder ini ke repo tersebut (root repo).
3. Masuk ke **Settings → Pages**:
   - **Build and deployment**: Source = `Deploy from a branch`.
   - Branch = `main` (root). Simpan.
4. Tunggu 1–2 menit sampai situs aktif di URL: `https://<username>.github.io/cbt-ujian/`.

## Kustomisasi
- **Judul ujian, durasi, jumlah soal, showAnswer** → atur di `cbt-config.json`.
- **Soal**: edit `data/questions.json`. Format contoh ada di file tersebut.
- **Tampilan**: ubah `assets/css/style.css`.
- **Branding**: ganti favicon/logo di `assets/img` (buat sendiri foldernya) dan referensikan di `index.html`.

## Struktur Folder
```
assets/
  css/style.css
  js/app.js
  js/exam.js
  js/results.js
data/
  questions.json
index.html
exam.html
results.html
cbt-config.json
.nojekyll
```

## Format Soal (`data/questions.json`)
```json
[
  {
    "id": "q1",
    "type": "single",
    "question": "Contoh pertanyaan?",
    "options": ["A", "B", "C", "D"],
    "answer": 1,            // index jawaban benar (0-based)
    "explanation": "Penjelasan opsional."
  }
]
```

## Catatan Keamanan
- Hindari menaruh ujian penting/bernilai tinggi karena kunci jawaban dapat diinspeksi.
- Untuk kebutuhan serius, gunakan **Power Pages + backend**, **LMS**, atau **platform CBT khusus**.

---
Lisensi: MIT
