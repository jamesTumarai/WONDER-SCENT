# Security Spec

## Data Invariants
1. A document must belong to the user creating it (`userId == request.auth.uid`).
2. The `userId` of a document cannot be changed after creation.
3. Users can only CRUD their own documents.

## The "Dirty Dozen" Payloads
1. Unauthenticated creation (FAIL)
2. Create document with `userId` belonging to someone else (FAIL)
3. Create document bypassing correct schema (e.g. missing `createdAt`) (FAIL)
4. Update document not owned by user (FAIL)
5. Update document trying to change `userId` (FAIL)
6. Update document with invalid schema (FAIL)
7. Query `documents` collection without filtering by `userId` (FAIL)
8. Update document to add random ghost field (FAIL)
9. Update document with invalid type for `taxRate` (FAIL)
10. Create document without `documentNumber` (FAIL)
11. Read document by explicit ID but owned by another user (FAIL)
12. Delete document owned by another user (FAIL)
