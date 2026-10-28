# Security Specification: Visitor Counter

## 1. Data Invariants
- The `/analytics/{metricId}` document tracks site visits.
- `metricId` must be a valid identifier (e.g., `visitors`, max 32 alphanumeric chars).
- `count` must be a positive integer.
- On creation, `count` must equal 1.
- On update, `count` can only be incremented by exactly 1 (`request.resource.data.count == resource.data.count + 1`).
- No arbitrary deletion is allowed (`allow delete: if false;`).
- No shadow fields or unapproved keys allowed (`affectedKeys().hasOnly(['count', 'updatedAt'])`).

## 2. The "Dirty Dozen" Payloads (Attacks that MUST return PERMISSION_DENIED)
1. Setting `count` to an arbitrary high value (e.g. 999999) on create or update.
2. Decrementing `count`.
3. Injecting a string into `count` (e.g. `count: "one million"`).
4. Adding ghost fields (e.g. `isAdmin: true`, `role: "admin"`).
5. Attempting to delete the document (`deleteDoc`).
6. Query scraping or listing collections without targeting document ID (`list` query).
7. Using an invalid `metricId` with excessive length or script injection (e.g. `<script>`, 256+ chars).
8. Overwriting document with blank object `{}`.
9. Attempting to modify non-allowed fields during update.
10. Setting negative count (`count: -5`).
11. Setting arbitrary timestamps without server timestamp validation.
12. Attempting to create unauthorized collections (e.g. `/users`, `/admins`).
