---
name: single-responsibility
description: The hooks/components/view slice layout and one-reason-to-change rule for this codebase. Read before adding a file to a feature slice, before growing an existing hook or component, and when deciding where a piece of logic belongs.
---

# Single responsibility

One reason to change. The useful test is not "is this file small" but **"who
files the bug report?"** If a design tweak and a business-rule change both land
in the same file, that file has two owners and needs splitting.

## The slice layout

Every feature slice under `frontend-app/src/features/<domain>/<slice>/` uses the
same three directories, and they mean specific things:

```
transactions/
  hooks/        ← logic, state, side effects. Owner: behavior changes.
  components/   ← presentational pieces. Owner: design changes.
  view/         ← composition: calls the controller, arranges components.
  index.ts      ← the slice's public surface
  transactionFormSchema.ts        ← validation rules
  mapTransactionToFormValues.ts   ← one mapping, one file
  mapTransactionFormToPayload.ts
```

The mapper files are the pattern in miniature: a single exported function whose
name is the file name. When you have a data transformation with a name, it gets
a file.

## Where logic goes

**`hooks/useXController.ts` — one per view.** It owns local state, derived data,
side effects, and every handler the view needs. It returns a flat object. The
view destructures or holds it as `ctrl`.

`useTransactionListController` is the reference implementation. Note what it
absorbs so the view doesn't have to: sort state, selection state, filter state,
confirm-then-delete flows, toast calls, CSV export including raw DOM
manipulation. The view calls `ctrl.handleExportCSV()` and knows nothing about
`document.createElement`.

**`hooks/useX.ts` — data access.** React Query wrapper for one resource
(`useTransactions`). Queries, mutations, cache updates. See
[data-fetching](../data-fetching/SKILL.md).

**`hooks/useXForm.ts`, `hooks/useXSelection.ts` — focused sub-hooks.** When a
controller grows a self-contained concern with its own state, it becomes its own
hook and the controller composes it. `useBudgetSelection` exists for exactly this
reason.

## Splitting a controller

A controller that has grown too big does **not** get split by line count. Split
along the seam where state clusters:

- Does a group of `useState` calls only ever get read by one other function in
  the file? That's a hook.
- Does a block of logic never touch the controller's other state? That's a hook,
  or a plain function in its own file.
- Is it a pure transformation with no React in it? Plain function, own file,
  named after what it does — like the `map*` files or
  `backend/src/modules/finance/utils/transactionFilters.ts`.

Prefer extracting *outward into a named unit* over adding a `useMemo` and hoping.

## Components hold no business logic

A component decides how something looks. It does not decide what happens.

`TransactionRow` is the model: it takes `tx`, `isLast`, `isSelected`,
`onToggleSelect`, and renders. `TYPE_CONFIG` — the icon/color/sign lookup — lives
in the component file because it is *presentation* data. The decision to delete a
transaction, the confirm dialog, the toast, the cache invalidation: all upstream
in the controller. Full rules in [pure-components](../pure-components/SKILL.md).

## Backend: one layer, one job

Each module under `backend/src/modules/<domain>/` splits by responsibility, and
the boundaries are strict:

| File | Owns | Never does |
|---|---|---|
| `routes.ts` | URL → middleware → controller wiring | Business logic |
| `controller.ts` | HTTP: read `req`, call service, set status | Prisma, business rules, try/catch |
| `service.ts` | Business rules, ownership checks, orchestration | Touch `req`/`res`, call Prisma directly |
| `repository.ts` | Prisma queries | Business rules, throwing `AppError` |
| `schemas.ts` | Zod validation shapes | Anything else |
| `utils/` | Pure helpers | Side effects |

The controller is a three-liner by design:

```ts
export const getAccounts = asyncHandler(async (req: Request, res: Response) => {
  const result = await financeService.getAccounts(req.user!.id);
  res.json(result);
});
```

If a controller grows a conditional about business state, that conditional belongs
in the service. Details in [backend-architecture](../backend-architecture/SKILL.md).

## Smells

- A component file importing `useDispatch`, `toast`, or a service.
- A controller hook returning JSX.
- `service.ts` importing `prisma` or `@prisma/client`.
- A hook whose name has "and" in it, or whose return object has two unrelated
  clusters of keys.
- A `useEffect` that syncs state that could have been derived with `useMemo`.
