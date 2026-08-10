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

## Struktur Proyek

```
belion project/
├── app/
│   ├── Features/                    # Arsitektur berbasis fitur
│   │   ├── Admin/                   # Fitur admin (Controllers, Models, routes.php)
│   │   ├── Auth/                    # Login, register, reset password
│   │   ├── Contact/                 # Contact messages
│   │   ├── Customer/                # Dashboard, pesanan, profil customer
│   │   ├── Home/                    # Halaman depan
│   │   ├── Menu/                    # Katalog & produk
│   │   ├── Orders/                  # Checkout, kupon, pembayaran (Midtrans/SSLCommerz)
│   │   ├── Staff/                   # Dashboard, pesanan, POS
│   │   └── About/                   # Tentang, privacy, terms, cookie policy
│   ├── Helpers/                     # currency.php, date.php, order.php
│   ├── Http/                        # Controller base & middleware (role)
│   ├── Mail/                        # Template email
│   ├── Models/                      # User (dengan role admin/staff/customer)
│   ├── Policies/
│   ├── Providers/
│   └── Services/
│       └── DeliveryFeeService.php   # Perhitungan ongkir berdasarkan koordinat
├── bootstrap/
├── config/
│   └── services.php                 # Konfigurasi OSM/Nominatim & koordinat toko
├── database/
│   ├── migrations/
│   └── seeders/                     # Category, Product, Coupon, Setting, User
├── lang/id/                         # Bahasa aplikasi (Indonesia)
├── public/
│   ├── build/                       # Aset hasil build Vite
│   └── upload/                      # Upload produk, dll.
├── resources/
│   ├── js/
│   │   ├── Components/              # Komponen React reusable
│   │   ├── Features/                # Halaman Inertia per fitur
│   │   ├── Layouts/                 # AdminLayout, StaffLayout, CustomerLayout, PublicLayout
│   │   └── Utils/
│   └── views/
├── routes/
│   └── web.php                      # Route utama (menyertakan routes fitur)
├── .env                             # Konfigurasi lingkungan (tidak di-commit)
├── composer.json
├── package.json
└── vite.config.js
```

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

# SSLCommerz (legacy)
SSLCOMMERZ_STORE_ID=your_store_id
SSLCOMMERZ_STORE_PASSWORD=your_password
SSLCOMMERZ_SANDBOX=true

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

## Route Utama

### Publik
```
GET  /                      Home
GET  /menu                  Menu / katalog produk
GET  /about                 Tentang kami
GET  /contact               Halaman kontak
POST /contact               Kirim pesan kontak
GET  /privacy-policy        Kebijakan privasi
GET  /terms-and-conditions  Syarat & ketentuan
GET  /cookie-policy         Kebijakan cookie
```

### Auth
```
GET/POST  /login            Login
GET/POST  /register         Daftar
POST      /logout           Logout
GET/POST  /forgot-password  Reset password (request)
GET/POST  /reset-password   Reset password (submit)
```

### Customer (login, role: customer)
```
GET  /checkout                          Checkout
POST /checkout                          Buat pesanan
POST /checkout/search-address           Cari alamat (geocoding)
POST /checkout/calculate-delivery-fee-from-coordinates   Hitung ongkir
POST /checkout/validate-coupon          Validasi kupon
GET  /checkout/success/{order}          Sukses
GET  /checkout/status/{order}           Status
POST /order/repay/{order}               Bayar ulang
GET  /customer/dashboard                Dashboard customer
GET  /customer/orders                   Riwayat pesanan
GET  /customer/orders/{order}           Detail pesanan
GET/PUT /customer/profile               Profil & password
```

### Staff (login, role: staff)
```
GET   /staff/dashboard                  Dashboard staff
GET   /staff/orders                     Daftar pesanan
GET   /staff/orders/{order}             Detail pesanan
PUT   /staff/orders/{order}             Update status pesanan
GET   /staff/pos                        POS (buat pesanan langsung)
POST  /staff/pos                        Simpan pesanan POS
GET   /staff/pos/{order}/receipt        Cetak struk
```

### Admin (login, role: admin)
```
GET  /admin/dashboard                   Dashboard
GET  /admin/reports                     Laporan & analitik
GET  /admin/reports/export              Ekspor laporan
GET/POST /admin/products                Kelola produk
GET/POST /admin/categories              Kelola kategori
GET/POST /admin/coupons                 Kelola kupon
GET/PUT  /admin/orders                  Kelola pesanan
GET  /admin/orders/{order}/receipt      Struk pesanan
GET/PUT  /admin/customers               Kelola pelanggan (ban/unban)
GET/PUT  /admin/contact-requests        Kelola permintaan kontak
GET/POST /admin/settings                Pengaturan toko
GET/PUT  /admin/profile                 Profil & password
```

### Payment Callback (publik)
```
POST /payment/success              SSLCommerz success (legacy)
POST /payment/fail                 SSLCommerz fail
POST /payment/cancel               SSLCommerz cancel
POST /payment/ipn                  SSLCommerz IPN
GET|POST /payment/midtrans/success Midtrans sukses
GET|POST /payment/midtrans/fail    Midtrans gagal
GET|POST /payment/midtrans/cancel  Midtrans batal
POST     /payment/midtrans/ipn     Midtrans notifikasi IPN
GET      /payment/midtrans/snap/{token} Halaman Snap (redirect)
```

---

## Status Pesanan

| Fulfillment | Alur Status |
| ----------- | ----------- |
| Delivery    | `pending` → `preparing` → `out_for_delivery` → `delivered` → `completed` (bisa `cancelled`) |
| Pickup      | `pending` → `preparing` → `completed` (bisa `cancelled`) |

**Status Pembayaran**: `pending`, `paid`, `failed`, `refunded`, `partial_refund`

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
