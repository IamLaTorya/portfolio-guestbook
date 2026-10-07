## 🧪 Postman & Live Environment Smoke Test Logs

The following integration test suite was manually executed against production endpoints using Postman Online. All route status targets passed perfectly with zero network or cross-origin errors:

- [x] **GET `/api/health`** ➔ `200 OK` 
  * *Result:* Verified live backend framework is active and fully connected to MongoDB Atlas.
- [x] **POST `/api/auth/register`** ➔ `201 Created`
  * *Result:* Provisioned user account `Rosalina` successfully in the collection.
- [x] **POST `/api/auth/register` (Duplicate Name)** ➔ `409 Conflict`
  * *Result:* Core database unique constraint blocked duplicate profile generation cleanly.
- [x] **POST `/api/auth/register` (Malformed Body)** ➔ `400 Bad Request`
  * *Result:* Backend `Zod` schemas successfully intercepted invalid lengths and missing keys.
- [x] **POST `/api/guestbook/GB-0001/like` (No Header Token)** ➔ `401 Unauthorized`
  * *Result:* Custom authentication middleware (`requireAuth`) safely blocked unauthenticated traffic.
- [x] **GET `/api/guestbook/pending` (Standard Token Role)** ➔ `403 Forbidden`
  * *Result:* Access control gateway (`requireRole('admin')`) successfully isolated sensitive queues.
- [x] **GET `/api/health` (High-Speed Traffic Flood)** ➔ `429 Too Many Requests`
  * *Result:* Rate-limiting middleware successfully rate-throttled spam traffic after 10+ rapid requests.
