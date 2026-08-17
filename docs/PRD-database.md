# PRD Database — Ticketing Management System (ACARA)

**Stack:** Express.js + TypeScript + MongoDB (Mongoose)
**Sumber:** ERD "Aplikasi Web Event Management - ACARA"

---

## 1. Ringkasan

Backend event management: user bikin event, orang lain beli ticket lewat order.
7 collection: `users`, `events`, `tickets`, `orders`, `banners`, `categories`, `locations`.

---

## 2. Relasi (dari ERD)

| Relasi | Kardinalitas | Arti |
|---|---|---|
| user → order | 1 : N | 1 user punya banyak order |
| user → events | 1 : N | 1 user (organizer) bikin banyak event |
| events → ticket | 1 : N | 1 event punya banyak jenis ticket |
| events → order | 1 : N | 1 event punya banyak order |
| events → banner | 1 : 1 | 1 event 1 banner |
| events → category | N : 1 | banyak event 1 kategori |
| events → location | N : 1 | banyak event 1 lokasi |

> Catatan: di ERD banner/location/category ditandai `1:1`. Untuk `category` & `location` diperlakukan **N:1** (satu kategori/lokasi dipakai banyak event) — lebih realistis. Kalau memang mau strict 1:1, bilang.

Pola referensi: **child simpan `ObjectId` ke parent** (`ref`). Bukan embed, karena data dipakai lintas collection.

---

## 3. Collections

### 3.1 `users` (sudah ada)
| Field | Tipe | Rule |
|---|---|---|
| fullName | String | required |
| userName | String | required, unique |
| email | String | required, unique |
| password | String | required, hashed (bcrypt) |
| role | String | enum `["admin","member"]`, default `member` |
| profilePicture | String | default placeholder |
| isActive | Boolean | default `false` |
| activationCode | String | — |

Perubahan disarankan: `unique` di email/userName, `default` di role/isActive/profilePicture (sekarang semua `required` — bikin register ribet).

### 3.2 `categories`
| Field | Tipe | Rule |
|---|---|---|
| name | String | required |
| description | String | — |
| icon | String | url/nama icon |

### 3.3 `locations`
| Field | Tipe | Rule |
|---|---|---|
| name | String | required |
| region | Number | kode region (opsional) |
| coordinates | [Number] | `[lng, lat]` |
| isOnline | Boolean | default `false` |

### 3.4 `events`
| Field | Tipe | Rule |
|---|---|---|
| name | String | required |
| slug | String | unique, auto dari name |
| category | ObjectId → `categories` | required |
| location | ObjectId → `locations` | required |
| createdBy | ObjectId → `users` | required (organizer) |
| description | String | — |
| startDate | Date | required |
| endDate | Date | required |
| isOnline | Boolean | default `false` |
| isFeatured | Boolean | default `false` |
| isPublished | Boolean | default `false` |
| banner | String | url image |

### 3.5 `tickets`
| Field | Tipe | Rule |
|---|---|---|
| name | String | required (mis. VIP, Regular) |
| price | Number | required, min 0 |
| quantity | Number | required (stok) |
| events | ObjectId → `events` | required |
| description | String | — |

### 3.6 `orders`
| Field | Tipe | Rule |
|---|---|---|
| orderId | String | unique (invoice) |
| createdBy | ObjectId → `users` | required (pembeli) |
| events | ObjectId → `events` | required |
| ticket | ObjectId → `tickets` | required |
| quantity | Number | required, min 1 |
| total | Number | required (price × quantity) |
| status | String | enum `["pending","completed","cancelled"]`, default `pending` |

### 3.7 `banners`
| Field | Tipe | Rule |
|---|---|---|
| title | String | required |
| image | String | required (url) |
| isShow | Boolean | default `false` |

> `banners` = banner homepage (list carousel), terpisah dari field `banner` di event. Sesuai ERD banner adalah entitas sendiri.

---

## 4. Konvensi

- Semua schema pakai `{ timestamps: true }` → `createdAt`/`updatedAt` otomatis.
- Validasi input pakai **yup** di controller (pola sudah ada di `auth.controller.ts`).
- Password hash pakai bcrypt di pre-save hook.
- File model: `src/models/<nama>.models.ts` (ikut `users.models.ts`).

---

## 5. Urutan build (dependency)

1. `categories`, `locations` (no deps)
2. `users` (revisi default)
3. `events` (butuh 1 & 2)
4. `tickets` (butuh events)
5. `orders` (butuh users, events, tickets)
6. `banners` (no deps)
