# Bellion Bake & Brew — Online Ordering System

Sistem pemesanan online untuk toko roti & kopi **Bellion Bake & Brew** yang dibangun dengan **Laravel 11**, **React (Inertia.js)**, dan **Tailwind CSS**. Menampilkan dashboard multi-role, manajemen pesanan, POS untuk kasir, checkout dengan peta (geocoding ongkir), dan integrasi pembayaran **Midtrans Snap** (dengan callback SSLCommerz legacy).

---

## Fitur Utama

### Multi-Role System
- **Admin**: Kontrol penuh atas produk, kategori, kupon, pesanan, pelanggan, laporan, permintaan kontak, dan pengaturan toko.
- **Staff**: Dashboard, manajemen pesanan, dan **POS (Point of Sale)** lengkap dengan cetak struk.
- **Customer**: Dashboard, riwayat pesanan, detail pesanan, dan manajemen profil.
- **Tamu**: Menelusuri menu, halaman tentang, dan menghubungi toko tanpa login.

### Katalog Produk
- Kategori dengan slug & status aktif
- Produk dengan gambar, slug, stok, dan status aktif
- Kategori produk: roti, kue, kopi, dan minuman lainnya

### Checkout & Pengiriman
- Fulfillment **Delivery** dan **Pickup**
- Input alamat lewat **peta Leaflet (OpenStreetMap)**
- **Perhitungan ongkir otomatis** berdasarkan jarak dari koordinat toko (Nominatim/OSM)
- Pencarian alamat dan perhitungan ongkir dari koordinat
- Voucher diskon (persen/nominal) dengan validasi

### Pembayaran
- **Midtrans Snap** sebagai gateway utama (mode sandbox & produksi)
- Callback SSLCommerz (legacy): success, fail, cancel, IPN
- Repayment untuk pembayaran yang gagal
- Status pesanan & status pembayaran yang di-track real-time

### Admin
- Dashboard dengan statistik (total pesanan, pendapatan, produk, pelanggan)
- Laporan & analitik dengan **ekspor**
- Manajemen produk, kategori, kupon, pesanan, pelanggan (ban/unban)
- Manajemen permintaan kontak
- Pengaturan toko (status buka/tutup, ongkir, dll.)
- Struk pesanan / receipt

### Staff / POS
- POS untuk membuat pesanan langsung (offline checkout)
- Cetak struk (receipt)

---

## Tech Stack

### Backend
- **Laravel 11** (PHP 8.2+)
- **Inertia.js** (SPA tanpa API)
- **MySQL** (database)
- **Midtrans Snap** (payment gateway utama) 

### Frontend
- **React 18** (UI library)
- **Tailwind CSS** (styling)
- **Lucide React** (icons)
- **Recharts** (grafik laporan)
- **React Leaflet** (peta delivery)
- **Vite** (build tool)

---

## Instalasi

### Prasyarat
- **PHP 8.2+**
- **Composer**
- **Node.js 18+** & npm
- **MySQL**
- **Git**

### Langkah

```bash
# 1. Clone repository
git clone <repository-url>
cd "belion project"

# 2. Install dependensi PHP
composer install

# 3. Install dependensi Node
npm install

# 4. Siapkan environment
cp .env.example .env
php artisan key:generate
```

### Konfigurasi `.env`

```env
APP_NAME="Bellion Bake & Brew"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=belion
DB_USERNAME=root
DB_PASSWORD=

# Midtrans (gateway utama)
MIDTRANS_CLIENT_KEY=your_client_key
MIDTRANS_SERVER_KEY=your_server_key
MIDTRANS_IS_PRODUCTION=false


# OpenStreetMap / delivery
OSM_BASE_URL=https://nominatim.openstreetmap.org
OSM_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
STORE_LAT=-6.264933
STORE_LNG=106.874533

# Mail
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_ENCRYPTION=tls
```

### Database & Seed

```bash
php artisan migrate
php artisan db:seed   # kategori, produk, kupon, pengaturan, user contoh
```

### Build Aset & Jalankan

```bash
npm run dev      # development (hot reload)
# atau
npm run build    # production

php artisan serve
```

Buka: `http://localhost:8000`

---

## Akun Default (Seeder)

| Role     | Email                 | Password |
| -------- | --------------------- | -------- |
| Admin    | `admin@example.com`   | `password` |
| Customer | `customer@example.com` | `password` |


---

## Fitur Keamanan

- Proteksi CSRF (kecuali callback payment gateway)
- Middleware role-based (`role:admin,staff,customer`)
- Password di-hash (Bcrypt)
- Query aman via Eloquent
- Auto-escaping XSS via React
- Validasi server-side & client-side

---

## Lisensi

Proyek ini dilisensikan di bawah lisensi **MIT**.
