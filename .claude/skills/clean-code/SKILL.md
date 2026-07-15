---
name: clean-code
description: Naming, function size, comments, and error handling conventions for this codebase. Read before writing or reviewing any TypeScript in frontend-app/ or backend/ — especially when introducing a new function, naming a variable, or adding a comment.
---

# Clean code

Rules for writing code that reads like the code already here. When a rule below
conflicts with surrounding code, match the surrounding code and mention the
inconsistency — do not silently start a third pattern.

## Naming

Names carry the domain vocabulary. This project has a real one: transactions,
accounts, budgets, bills, goals, categories. Use it exactly.

- **Booleans read as assertions**: `isConfirmed`, `isLoading`, `isLast`,
  `isSelected`. Not `confirmed`, `loading`, `flag`, `check`.
- **Handlers are `handleX`; props that receive them are `onX`.** A component
  takes `onToggleSelect`, the hook that implements it exports `handleDelete`.
  This split is load-bearing — see [pure-components](../pure-components/SKILL.md).
- **Hooks are `useX`; view controllers are `useXController`** (`useTransactionListController`).
- **Mappers say both ends**: `mapTransactionToFormValues`,
  `mapTransactionFormToPayload`. Never `transform`, `convert`, `process`.
- **No abbreviations except established ones.** `tx` for transaction and `ctrl`
  for a controller result are in the codebase and fine. Inventing `acct`,
  `budg`, or `cat` is not.
- **Say the unit or shape** when the type doesn't. `amount` is a string from the
  API; `totalInflow` is a parsed number. If a value is a string that holds a
  number, the name or an adjacent type should make that survivable.

Avoid names that describe the mechanism instead of the meaning. `filteredAndSortedData`
is acceptable because filtering and sorting *are* the meaning there; `data2`,
`newList`, `temp` never are.

## Functions

- **A function does one thing at one level of abstraction.** If you're reading a
  function and the steps jump between "decide business rule" and "append a DOM
  node", split it.
- **Extract when a block needs a comment to explain what it is.** The comment
  becomes the function name. That's the trade.
- **Guard clauses over nesting.** Return or throw early; keep the happy path at
  the left margin. The backend service layer does this consistently:

  ```ts
  const account = await repo.findAccountById(accountId, userId);
  if (!account) {
    throw new AppError("Account not found", 404);
  }
  return account;
  ```

- **Parameters: three max.** Past that, take an options object — as
  `useTransactionListController({ limit })` does. Never take a boolean parameter
  that selects behavior; that's two functions wearing a trenchcoat.
- **Return early-shaped data.** Don't accumulate into a mutable outer variable
  when `map`/`filter`/`reduce` or a `useMemo` expresses it directly.

## Comments

The bar: **a comment states a constraint the code cannot show.** Why, not what.

Good — these are from the codebase and earn their place:

```ts
await getAccount(userId, accountId); // Verify ownership/existence
// CSV export — DOM interaction lives here, view just calls this
// Derived summary stats over the visible data set
```

The first is the best example: the call looks like a discarded result, and the
comment explains it's an authorization check. Delete it and the next reader
"optimizes" it away.

Do not write:
- Comments restating the next line (`// set loading to true`).
- Section banners inside a function.
- Attribution or history (`// added for the redesign`, `// fixed bug`). Git knows.
- Commented-out code. Delete it.

`// --- Accounts ---` style dividers between route/service groups are an existing
convention in the backend modules. Keep them there; don't introduce them elsewhere.

## Error handling

- **Backend throws `AppError(message, statusCode, code?)`** for anything the
  client should hear about. Never `throw new Error` in a service — it becomes a
  500 with no shape. Never `res.status(...)` from a service; that's the
  controller's job, and controllers are wrapped in `asyncHandler` so you never
  write try/catch there.
- **Frontend surfaces failures with `toast`**, and mutations must handle their own
  rejection. The established shape:

  ```ts
  try {
    await deleteTransaction.mutateAsync(tx.id);
    toast.success("Transaction deleted successfully");
  } catch (error) {
    toast.error("Failed to delete transaction");
  }
  ```

- **Never swallow an error silently.** An empty `catch {}` is a bug. If a failure
  is genuinely ignorable, the catch body needs a comment saying why.
- **Destructive actions confirm first**, via `useConfirm()` from
  `@/providers/confirm-provider`, and the description states the consequence
  ("This will reverse any related balance updates").

## Duplication

Rule of three, with a caveat: extract on the third occurrence, *unless* the two
copies drift for real domain reasons. Two things that look alike today but answer
to different requirements are not duplication — coupling them is the more
expensive mistake. Shared UI goes in `components/ui/`, shared feature code in the
feature's `shared/` slice.