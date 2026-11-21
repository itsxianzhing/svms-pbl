# API Contract SVMS

Base URL: `/api`. Semua endpoint selain `POST /auth/login` dan `POST /auth/register`
memerlukan header `Authorization: Bearer <token>`. Respons berhasil dibungkus sebagai
`{ "data": ... }`; respons gagal memakai `{ "message": "...", "errors": { ... } }`.

## Auth

| Method | Path             | Body                        | Response          |
| ------ | ---------------- | --------------------------- | ----------------- |
| POST   | `/auth/login`    | `{ email, password }`       | `{ token, user }` | 
| POST   | `/auth/register` | `{ name, email, password }` | `{ token, user }` |
| GET    | `/auth/me`       | -                           | `user`            |

## Venue

| Method | Path               | Query/body                                    | Response                                                 |
| ------ | ------------------ | --------------------------------------------- | -------------------------------------------------------- |
| GET    | `/venues`          | Query opsional: `search`, `type`, `city`      | `Venue[]`                                                |
| GET    | `/venues/filters`  | -                                             | `{ types: string[], cities: string[] }`                  |
| GET    | `/venues/:venueId` | -                                             | `Venue` dengan `courts: Court[]`                         |
| POST   | `/venues`          | `{ name, type, address, city, description? }` | `Venue` (ADMIN)                                          |
| PUT    | `/venues/:venueId` | `{ name, type, address, city, description? }` | `Venue` (ADMIN)                                          |
| DELETE | `/venues/:venueId` | -                                             | `{}` (ADMIN); `409` bila venue/courtnya memiliki booking |

`Venue` berisi `id`, `name`, `type`, `address`, `city`, `description`, `courtCount`, dan
`minPricePerHour` (atau `null` bila tidak ada court aktif).

## Court

| Method | Path                        | Query/body                         | Response                                        |
| ------ | --------------------------- | ---------------------------------- | ----------------------------------------------- |
| POST   | `/venues/:venueId/courts`   | `{ name, pricePerHour, isActive }` | `Court` (ADMIN)                                 |
| PUT    | `/courts/:courtId`          | `{ name, pricePerHour, isActive }` | `Court` (ADMIN)                                 |
| DELETE | `/courts/:courtId`          | -                                  | `{}` (ADMIN); `409` bila court memiliki booking |
| GET    | `/courts/:courtId/bookings` | Query: `from`, `to`                | `{ startTime, endTime }[]`                      |

`Court` berisi `id`, `venueId`, `name`, `pricePerHour`, dan `isActive`.

## Booking

| Method | Path                          | Query/body                                        | Response                                      |
| ------ | ----------------------------- | ------------------------------------------------- | --------------------------------------------- |
| POST   | `/bookings`                   | `{ courtId, startTime, endTime }`                 | `Booking` (CUSTOMER); `409` bila slot bentrok |
| GET    | `/bookings/my`                | Query opsional: `status`                          | `Booking[]` milik pengguna aktif              |
| GET    | `/bookings`                   | Query opsional: `status`, `search`                | `Booking[]` (ADMIN)                           |
| GET    | `/bookings/:bookingId`        | -                                                 | `Booking`                                     |
| POST   | `/bookings/:bookingId/pay`    | `{ method: QRIS \| VIRTUAL_ACCOUNT \| E_WALLET }` | `Booking`                                     |
| POST   | `/bookings/:bookingId/cancel` | -                                                 | `Booking`                                     |

`Booking` berisi `id`, `courtId`, `userId`, `status` (`PENDING`, `CONFIRMED`, atau
`CANCELLED`), `startTime`, `endTime`, `totalPrice`, `createdAt`, `expiresAt`, serta objek
ringkas `court`, `venue`, dan `user`.

## Dashboard

| Method | Path                 | Response                                                                                                                   |
| ------ | -------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/dashboard/summary` | `{ totalRevenue, totalBookings, todayBookings, pendingBookings, confirmedBookings, cancelledBookings, topCourts }` (ADMIN) |

Validasi memakai `422`, autentikasi/otorisasi memakai `401`/`403`, data tidak ditemukan
memakai `404`, dan konflik bisnis memakai `409`.
