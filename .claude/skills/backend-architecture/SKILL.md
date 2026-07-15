---
name: backend-architecture
description: The routes → controller → service → repository module pattern in backend/src — layer boundaries, AppError, asyncHandler, Zod validation, ownership checks, and Prisma transactions. Read before adding an endpoint, changing a module under backend/src/modules/, or writing any Prisma query.
---

# Backend architecture

Every domain under `backend/src/modules/<domain>/` (finance, kitchen, auth,
health, user) uses the same shape. New endpoints follow it exactly.

```
routes.ts       URL + middleware + controller wiring
controller.ts   HTTP in, HTTP out
service.ts      business rules, ownership, orchestration
repository.ts   Prisma only
schemas.ts      Zod
types.ts        module types
utils/          pure helpers
__mocks__/      manual mocks (repository)
```

Dependencies point one direction: `routes → controller → service → repository`.
A layer never reaches past its neighbor, and never calls back upward.

## routes.ts

Wiring only. Auth applied once for the whole router; validation per mutating
route:

```ts
router.use(authMiddleware);

router.post("/accounts", validateBody(schemas.createAccountSchema), controller.createAccount);
router.get("/accounts", controller.getAccounts);
router.put("/accounts/:id", validateBody(schemas.updateAccountSchema), controller.updateAccount);
router.delete("/accounts/:id", controller.deleteAccount);
```

- **Every POST/PUT/PATCH gets a `validateBody`.** No exceptions — an unvalidated
  body is an untyped body downstream.
- Create and update take **separate schemas**; update fields are `.optional()`.
- Note ESM `.js` specifiers on relative imports. Required — keep them.

## controller.ts

Translate HTTP to a service call and back. Nothing else.

```ts
export const getAccountById = asyncHandler(async (req: Request, res: Response) => {
  const result = await financeService.getAccount(req.user!.id, String(req.params.id));
  res.json(result);
});
```

- **Always wrap in `asyncHandler`.** It forwards rejections to `errorHandler`, so
  **never write try/catch in a controller**.
- `req.user!.id` is the accepted non-null assertion — `authMiddleware` guarantees
  it via `shared/types/express.d.ts`.
- **Always pass `userId` as the first argument** to the service. Every
  user-scoped operation takes it.
- Status codes live here and only here: `201` on create, `204` + `.end()` on
  delete, `res.json(result)` otherwise.
- `String(req.params.id)` — params are typed loosely; normalize at this edge.
- **No business logic.** A conditional on domain state in a controller belongs in
  the service.

## service.ts

Business rules live here. This is the layer worth testing (see
[testing](../testing/SKILL.md)).

**Ownership checks are mandatory and non-negotiable.** Every operation on an
existing record verifies the record belongs to the caller *before* touching it:

```ts
export async function getAccount(userId: string, accountId: string) {
  const account = await repo.findAccountById(accountId, userId);
  if (!account) {
    throw new AppError("Account not found", 404);
  }
  return account;
}

export async function updateAccount(userId: string, accountId: string, data: UpdateAccountInput) {
  await getAccount(userId, accountId); // Verify ownership/existence
  return repo.updateAccount(accountId, data);
}
```

Two things to preserve:
- The lookup is scoped by `userId`, so a missing record and someone else's record
  are indistinguishable — **404, never 403.** Don't leak existence.
- `updateAccount` reuses `getAccount` rather than re-implementing the check. Reuse
  the getter; don't hand-roll a second lookup.

Also:
- **Never import `prisma` or `@prisma/client` in a service.** All DB access goes
  through the repository. The one intentional seam is `repo.runInTransaction`,
  which hands the service a transaction client to pass back down.
- **Never touch `req` or `res`.** Services take plain arguments and return plain
  data.
- Throw `AppError(message, statusCode, code?)` for anything the client should
  hear. A bare `Error` becomes an opaque 500.
- Type inputs with `z.infer` of the module's schema, not `any` — see
  [type-safety](../type-safety/SKILL.md).

## repository.ts

Prisma queries. No business rules, no `AppError` — a repository returns `null`
and lets the service decide that's a 404.

```ts
export async function findAccountById(id: string, userId: string, tx?: Prisma.TransactionClient) {
  const db = tx ?? prisma;
  return db.account.findFirst({ where: { id, userId } });
}
```

- **The optional `tx` parameter with `const db = tx || prisma` is the convention.**
  Keep it on every function that could participate in a transaction. Type it
  `Prisma.TransactionClient`, not `any`.
- **Always scope reads by `userId`** where the model is user-owned. A
  `findUnique({ where: { id } })` on user data is a data-leak bug — use
  `findFirst` with both.
- Prefer Prisma's generated types for args over hand-written ones.

## Transactions

Any write that must be all-or-nothing goes through `repo.runInTransaction`, and
the service passes the resulting client into each repository call. Finance writes
are the common case: creating a transaction moves an account balance, may flip a
bill to `PAID`, and may record a saving contribution. Those must not be able to
half-succeed.

If you add a step to a transactional flow, add the corresponding model to the
`mockTx` object in `service.test.ts`.

## Errors

`AppError` carries `statusCode`, derives `status` (`fail` for 4xx, `error`
otherwise), sets `isOperational`, and takes an optional machine-readable `code`.
`errorHandler` middleware turns it into the response — nothing else formats
errors.

Validation failures never reach your code: `validateBody` returns
`400 { code: "VALIDATION_ERROR", message, errors[] }` directly.

Use the codes you'd want a client to branch on. `404` not found, `403` only for a
genuine permission failure on a record the user may know exists, `409` conflict,
`400` bad input that Zod can't express.

## Adding an endpoint

1. `schemas.ts` — Zod schema, export `z.infer` type.
2. `repository.ts` — the query, `userId`-scoped, optional `tx`.
3. `__mocks__/repository.ts` — add the `vi.fn()`.
4. `service.ts` — ownership check, business rules, `AppError`.
5. `service.test.ts` — cover the rule and the ownership failure.
6. `controller.ts` — `asyncHandler`, call service, set status.
7. `routes.ts` — wire with `validateBody`.