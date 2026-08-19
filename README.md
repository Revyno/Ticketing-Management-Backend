# Ticketing-Management-Backend

Backend untuk sistem manajemen tiket. Dibangun dengan Node.js, Express, TypeScript, dan MongoDB.

## Fitur

- Autentikasi JWT (login, register)
- Manajemen event, tiket, kategori, lokasi, banner
- Sistem order
- Swagger API docs
- Role-based access control (admin/user)

## Prasyarat

- Node.js 20+
- MongoDB 6+
- Docker & Docker Compose (opsional, untuk containerized setup)

## Instalasi Lokal

1. Clone repo
2. Install dependencies:
   ```bash
   npm install
   ```
3. Salin environment file:
   ```bash
   cp .env.example .env
   ```
4. Sesuaikan nilai di `.env` sesuai environment Anda.
5. Jalankan server development:
   ```bash
   npm run dev
   ```

Server berjalan di `http://localhost:3000`.
API docs tersedia di `http://localhost:3000/api/docs`.

## Menjalankan dengan Docker

1. Pastikan Docker dan Docker Compose terpasang.
2. Build dan jalankan container:
   ```bash
   docker-compose up --build
   ```
3. Aplikasi tersedia di `http://localhost:3000`.
4. MongoDB berjalan di port `27017`.
5. Untuk menghentikan:
   ```bash
   docker-compose down
   ```

## Environment Variables

| Variable        | Deskripsi                        | Default                                                            |
| --------------- | -------------------------------- | ------------------------------------------------------------------ |
| `MONGODB_URI`   | Connection string MongoDB        | `mongodb://localhost:27017/Ticketing-Management-Backend`           |
| `JWT_SECRET`    | Secret key untuk JWT             | `dev-secret-change-me` (wajib diganti di production)              |
| `JWT_EXPIRES`   | Masa berlaku token JWT           | `7d`                                                               |

## Scripts

| Perintah          | Deskripsi                              |
| ----------------- | -------------------------------------- |
| `npm run dev`     | Jalankan server development            |
| `npm run build`   | Compile TypeScript ke `dist/`          |
| `npm start`       | Jalankan server production dari `dist/`|
| `npm run make-admin` | Buat user admin                     |

## Struktur Proyek

```
src/
├── controllers/     # Logika controller
├── middlewares/     # Middleware Express
├── models/          # Schema Mongoose
├── routes/          # Definisi route
├── utils/           # Utility functions
├── scripts/         # Script one-off
└── index.ts         # Entry point
```

## Lisensi

ISC
