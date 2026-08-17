# PRD Infrastruktur — Ticketing Management Backend

**Target:** VPS Ubuntu · Docker + Docker Compose · Nginx (reverse proxy) · OpenAPI (Swagger docs)

---

## 1. Arsitektur

```
Internet
   │  :443 / :80
   ▼
┌─────────────────────────────┐
│ Nginx (reverse proxy + SSL) │  ← host / container
└──────────────┬──────────────┘
               │ proxy_pass -> app:3000
     ┌─────────┴──────────┐
     ▼                    ▼
┌──────────┐        ┌──────────┐
│  app     │───────▶│ mongo    │
│ Express  │  27017 │ MongoDB  │
│ :3000    │        │ (volume) │
└──────────┘        └──────────┘
   Docker network (internal)
```

- Nginx satu-satunya yang expose ke publik (80/443).
- App & Mongo di network internal Docker, **gak** expose port ke host (kecuali dev).
- Data Mongo di named volume → persist walau container di-recreate.

---

## 2. Komponen

| Komponen | Peran | Catatan |
|---|---|---|
| Nginx | Reverse proxy, TLS termination, gzip | Sertifikat via Certbot (Let's Encrypt) |
| app | Express API (container) | Build dari Dockerfile multi-stage |
| mongo | Database | Image `mongo:7`, volume `mongo-data`, auth on |
| Certbot | Auto SSL | Renew via cron/timer |

---

## 3. File yang perlu dibuat

```
.
├── Dockerfile              # build app (multi-stage: build TS -> run JS)
├── docker-compose.yml      # app + mongo + nginx
├── .dockerignore
├── nginx/
│   └── default.conf        # server block reverse proxy
├── .env.production         # secret (JANGAN commit)
└── docs/openapi.yaml       # spec OpenAPI (opsional, atau generate)
```

---

## 4. Dockerfile (rencana — multi-stage)

- Stage `build`: `npm ci` → `tsc` compile `src` ke `dist`.
- Stage `run`: `node:20-alpine`, copy `dist` + `node_modules` (prod only), `CMD ["node","dist/index.js"]`.
- User non-root, `EXPOSE 3000`.

> Butuh nambah script `"build": "tsc"` + `"start": "node dist/index.js"` di package.json, dan `outDir: dist` di tsconfig.

## 5. docker-compose (rencana)

- Service `app`: build `.`, `env_file: .env.production`, `depends_on: mongo`, restart `unless-stopped`, **gak** publish port (Nginx yang akses).
- Service `mongo`: image `mongo:7`, volume `mongo-data:/data/db`, env `MONGO_INITDB_ROOT_USERNAME/PASSWORD`, restart `unless-stopped`.
- Service `nginx`: image `nginx:alpine`, mount `nginx/default.conf` + cert, publish `80:80`, `443:443`, `depends_on: app`.
- Network: default bridge (semua service bisa saling akses by service name → `mongodb://mongo:27017`).

## 6. Nginx (rencana `default.conf`)

- `server` block `:80` redirect ke `:443`.
- `:443` SSL cert Let's Encrypt.
- `location /` → `proxy_pass http://app:3000`.
- Header: `X-Forwarded-For`, `X-Forwarded-Proto`, `Host`.
- `client_max_body_size 10M` (buat upload gambar).

---

## 7. OpenAPI / Swagger

Dua opsi:

| Opsi | Cara | Kelebihan |
|---|---|---|
| **A. swagger-ui-express + swagger-jsdoc** | Tulis anotasi JSDoc di route, generate spec runtime | Deket sama kode, auto |
| **B. openapi.yaml manual** | Tulis spec YAML, serve pakai swagger-ui | Kontrol penuh, bisa share ke tim mobile |

Rekomendasi: **Opsi A** untuk mulai. Endpoint docs di `/api/docs`.
Package: `swagger-ui-express swagger-jsdoc` (+ `@types/*`).

---

## 8. Env & Secret

`.env.production` (di VPS saja, gak masuk git):
```
NODE_ENV=production
PORT=3000
DATABASE_URL=mongodb://<user>:<pass>@mongo:27017/ticketing?authSource=admin
JWT_SECRET=<random-long-string>
MONGO_INITDB_ROOT_USERNAME=<user>
MONGO_INITDB_ROOT_PASSWORD=<pass>
```
> Pastikan `.env*` ada di `.gitignore`. Cek sekarang `.env` masih ke-track — hapus dari git.

---

## 9. Langkah deploy VPS (garis besar)

1. Provision VPS Ubuntu, buat user non-root + SSH key, aktifin UFW (allow 22, 80, 443).
2. Install Docker + Docker Compose plugin.
3. Point domain (A record) ke IP VPS.
4. Clone repo, isi `.env.production`.
5. `docker compose up -d --build`.
6. Certbot issue SSL: `certbot --nginx` (atau container certbot).
7. Cek `https://domain/api/docs` jalan.

---

## 10. Hardening (nanti)

- Mongo: bind internal saja, auth wajib, backup rutin (`mongodump` cron → volume/S3).
- Rate limit di Nginx atau `express-rate-limit`.
- `helmet` di Express.
- Log: Docker logging driver / mount volume log.
- CI/CD: GitHub Actions build image → push → `docker compose pull && up -d`.
