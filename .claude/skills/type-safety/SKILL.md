---
name: type-safety
description: Banning `any` and deriving types from Zod schemas and Prisma across frontend-app and backend. Read before writing a function signature, adding a Zod schema, or typing anything that crosses the HTTP or database boundary — and any time you are tempted to write `any`.
---

# Type safety

The types exist. The job is to stop discarding them.

## The problem this skill fixes

`backend/src/modules/finance` validates every write with Zod at the route edge:

```ts
router.post("/accounts", validateBody(schemas.createAccountSchema), controller.createAccount);
```

By the time `createAccount` runs, `req.body` is a fully known shape. Then the
service throws it away:

```ts
export async function createAccount(userId: string, data: any) {  // ← the type is gone
  return repo.createAccount(userId, data);
}
```

There are ~68 `: any` annotations in `backend/src` outside tests. Each one is a
place where a schema change compiles clean and fails at runtime. Zod already knows
the answer — use it.

## Rule 1: derive, never redeclare

`z.infer` turns a schema into a type. One source of truth:

```ts
// schemas.ts
export const createAccountSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["CHECKING", "SAVINGS", "CASH", "CREDIT", "OTHER"]),
  balance: z.number().default(0),
  currency: z.string().length(3).default("USD"),
});
export type CreateAccountInput = z.infer<typeof createAccountSchema>;

// service.ts
export async function createAccount(userId: string, data: CreateAccountInput) {
  return repo.createAccount(userId, data);
}
```

Now adding a required field to the schema breaks the build at every call site,
which is the entire point.

Note `z.infer` gives you the **output** type (post-`.default()`, so `balance` is
`number`, not `number | undefined`). That's what a service should receive. Use
`z.input` only for the pre-parse shape.

**Do not hand-write an interface that mirrors a schema.** Two declarations drift.

## Rule 2: types come from the source of truth

- **Request bodies** → `z.infer` of the schema in that module's `schemas.ts`.
- **DB rows and Prisma args** → generated Prisma types. In `repository.ts`,
  `Prisma` is already imported — use `Prisma.AccountCreateInput`,
  `Prisma.TransactionWhereInput`, and `Prisma.TransactionClient` for the `tx`
  parameter instead of `tx?: any`.
- **API responses on the frontend** → the shared types in
  `frontend-app/src/types/` (`Transaction`, `Account`, `Bill`). Services and
  query functions must be typed so `useQuery` infers correctly and never returns
  `any`.

The `tx?: any` transaction parameter in the repository is worth fixing when you
touch a repo function — `Prisma.TransactionClient` is the correct type and it
catches misuse of the wrong client.

## Rule 3: `any` is banned; `unknown` is the answer

`any` disables checking and the damage spreads to everything it touches.
`unknown` forces a narrowing check at the edge, which is where you wanted one.

Legitimate uses of `any`, all rare:
- A third-party type is genuinely wrong and you're working around it — with a
  comment naming the library and the reason.
- Test mocks, where the shape is deliberately partial.

Everywhere else, if you don't know the type, it's `unknown` plus a narrow. In a
`catch`, the error is `unknown` — narrow it before reading `.message`.

Never use `as` to silence an error you don't understand. A cast is a claim you're
making to the compiler; if it's wrong, it's worse than `any` because it looks
deliberate. `as const` for literal inference (as in the `financeKeys` factory) is
a different thing and is correct.

Never use `!` to dismiss a null the compiler correctly found. `req.user!.id` in
controllers is the accepted exception: `authMiddleware` guarantees it, and the
guarantee is expressed in `shared/types/express.d.ts`.

## Rule 4: model the domain, don't stringly-type it

- Union literals over `string`: `type FilterType = "ALL" | "INCOME" | ...`, as in
  `useTransactionListController`. The compiler then checks your `switch`.
- If a value can be absent, say so in the type rather than defending with `||`
  everywhere downstream.
- **Money stays a string end to end.** `Transaction.amount` is a string because
  it's a Prisma `Decimal` serialized over JSON. Parse at the point of arithmetic
  (`parseFloat(tx.amount)`), never store a float back into a field typed as
  string, and never do currency math in a component.

## Frontend specifics

- **Props get an explicit interface** — `TransactionRowProps`,
  `TransactionListViewProps`. Never `React.FC` (it drags in implicit `children`).
- **Controller return types are inferred** from the returned object. That's fine;
  don't hand-write a mirror interface for them either.
- **Form types come from the schema.** `transactionFormSchema` + `zodResolver` is
  the pattern; the form values type is `z.infer` of that schema, and the mappers
  (`mapTransactionToFormValues`, `mapTransactionFormToPayload`) are the only
  places the API shape and form shape meet.

## Checklist

Before finishing a change, ask:
1. Did I write `any`? Replace it or justify it in a comment.
2. Did I hand-write a type that a Zod schema or Prisma already knows?
3. Does a schema change break the build at every affected call site? If not, the
   types aren't connected.