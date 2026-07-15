---
name: data-fetching
description: React Query conventions for frontend-app — the queries/keys factory, server prefetch, mutations, and optimistic updates with rollback. Read before adding a useQuery/useMutation, creating a query key, changing a service call, or touching cache invalidation.
---

# Data fetching

React Query owns server state. Redux owns UI state (open dialogs, edit targets).
Never put fetched data in Redux; never put dialog state in a query.

## Layers

```
lib/services/finance-service.ts     HTTP only (axios). No React.
features/finance/shared/financeQueries.ts   keys + queryOptions factory
features/<slice>/hooks/useX.ts      useQuery/useMutation + cache rules
features/<slice>/hooks/useXController.ts    consumes the above
```

A component never imports a service. A view never calls `useQuery` directly.

## Keys and query options: always from the factory

Never inline a query key. `financeKeys` is hierarchical so invalidation can be
broad or narrow on purpose:

```ts
export const financeKeys = {
  all: ["finance"] as const,
  accounts: () => [...financeKeys.all, "accounts"] as const,
  transactions: {
    all: () => [...financeKeys.all, "transactions"] as const,
    list: (filters?: TransactionFilterParams) =>
      [...financeKeys.transactions.all(), filters || {}] as const,
    detail: (id: string) => [...financeKeys.transactions.all(), "detail", id] as const,
  },
};
```

Invalidating `financeKeys.transactions.all()` clears every filtered list because
each list key is prefixed by it. That only works if keys come from the factory —
one inlined `["transactions"]` silently escapes invalidation.

`financeQueries` wraps each key with `queryOptions({ queryKey, queryFn })`. That
single object is what both the server page and the client hook consume, so they
cannot drift:

```ts
// server: app/dashboard/finance/page.tsx
await queryClient.prefetchQuery(financeQueries.transactions());
// client: hooks/useTransactions.ts
const transactions = useQuery(financeQueries.transactions(filters));
```

**Adding a resource means adding to both `financeKeys` and `financeQueries`.**
Never a bare `useQuery({ queryKey: [...], queryFn: ... })` in a hook.

## Server prefetch

Route pages prefetch in parallel and hydrate — see
[server-first](../server-first/SKILL.md). If you add a query that renders above
the fold, add it to the page's `Promise.all` prefetch. Filtered lists prefetch
with the same filters the client will request, or the key won't match and it
refetches.

## Mutations

Mutations live in the resource hook, not the controller and never a component.
The controller calls `mutateAsync` and owns the user-facing story:

```ts
try {
  await deleteTransaction.mutateAsync(tx.id);
  toast.success("Transaction deleted successfully");
} catch (error) {
  toast.error("Failed to delete transaction");
}
```

Toasts and confirms belong to the controller. Cache correctness belongs to the
mutation.

## Optimistic updates — the full contract

`useTransactions` does optimistic updates, and this is the part most often gotten
wrong. All four steps are mandatory; skipping one produces a cache that's subtly
wrong in a way tests won't catch.

**1. Cancel in-flight queries** for every key you're about to touch — otherwise a
response already in flight lands after your optimistic write and clobbers it:

```ts
await Promise.all([
  queryClient.cancelQueries({ queryKey: financeKeys.transactions.all() }),
  queryClient.cancelQueries({ queryKey: financeKeys.bills() }),
  queryClient.cancelQueries({ queryKey: financeKeys.accounts() }),
]);
```

**2. Snapshot every key you touch**, and return the snapshot from `onMutate`.

**3. Write optimistically**, guarded on the snapshot existing.

**4. Roll back in `onError`** from that snapshot, and **`invalidateQueries` in
`onSettled`** to reconcile with the server.

**A finance mutation is rarely one resource.** Creating a transaction moves the
account balance and can flip a bill to `PAID`. Every cache that the server
mutation affects must be cancelled, snapshotted, updated, rolled back, and
invalidated. A transaction write that only touches the transactions cache leaves
a stale balance on screen.

Optimistic writes must not mutate cached objects. Build new arrays/objects —
`[newTx, ...previousTx]`, `previousBills.map(b => b.id === id ? { ...b, status: "PAID" } : b)`.
Mutating cached data in place breaks referential equality and rollback both.

Temp IDs for optimistic inserts follow `"temp-" + Date.now()`; anything keyed on
`tx.id` must tolerate one render with a temp ID.

## When *not* to be optimistic

Optimistic updates cost real complexity. Use them when the mutation is
high-frequency and the outcome is near-certain (toggles, deletes, quick adds).
For a slow or failure-prone mutation, plain `invalidateQueries` in `onSuccess` is
better — a spinner beats a UI that lies and then snaps back.

## Rules

- Never call `queryClient.setQueryData` outside a mutation's `onMutate`/`onSuccess`.
- Never `refetch()` where invalidation is correct.
- Never fetch in a `useEffect`.
- Keep `queryFn` a plain service call — filtering/sorting happens in the
  controller (`filteredAndSortedData`), not the query.
- Loading and error state come from the query (`ctrl.isLoading`) and render as a
  skeleton in the view, never as a bare spinner swap.