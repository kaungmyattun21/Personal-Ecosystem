---
name: testing
description: Vitest conventions for this repo — colocated tests, __mocks__ auto-mocking, renderHook with a QueryClient wrapper, and what's worth testing at each layer. Read before writing or changing any test, adding a __mocks__ entry, or deciding whether a change needs test coverage.
---

# Testing

Vitest both sides. Frontend adds Testing Library + jsdom (`src/test/setup.ts`).
Run with `npm test` (watch) or `npm run test:run` (once) in either package.

## Layout

Tests sit **next to the code they test** — `service.ts` / `service.test.ts`,
`useTransactions.ts` / `useTransactions.test.tsx`. No `__tests__` directory, no
mirrored test tree. Manual mocks go in a `__mocks__/` directory beside the module
they replace.

Test files use `.test.tsx` when they render, `.test.ts` when they don't.

## The `__mocks__` convention

Both packages rely on Vitest picking up a manual mock automatically. Declare the
mock with a bare `vi.mock(path)` and Vitest resolves the adjacent `__mocks__`
file:

```ts
// backend/src/modules/finance/service.test.ts
vi.mock("./repository.js");          // → __mocks__/repository.ts
const mockedRepo = vi.mocked(repo);  // typed access to the mocked fns
```

```ts
// frontend useTransactions.test.tsx
vi.mock('@/lib/services/finance-service');  // → lib/services/__mocks__/finance-service
const mockedService = vi.mocked(financeService);
```

Rules:
- **Always `vi.mocked(...)`** for access — never cast to `any` to reach `.mockResolvedValue`.
- **Mock files export `vi.fn()` per function**, with a sane default where a bare
  call would otherwise explode (`findAccountsByUserId` defaults to `[]`).
- **When you add a repository or service function, add it to `__mocks__`** in the
  same change. A missing entry surfaces as an unrelated test failing on
  `undefined is not a function`.
- **`vi.clearAllMocks()` in `beforeEach`.** Always.
- Note the backend mocks use `.js` specifiers to match the ESM import style of the
  source. Keep them consistent or the mock won't resolve.

## Backend: test the service

The service holds the business rules, so that's where the tests go. The
repository is mocked; nothing touches a real database.

```ts
mockedRepo.runInTransaction.mockImplementation((cb: any) => cb(mockTx));
```

`runInTransaction` is mocked to invoke the callback with a fake Prisma client, so
multi-step writes are assertable without a DB. When you add a model to a
transactional flow, add it to the `mockTx` object.

Worth testing:
- Business rules and derived values — balance moves, bill status flips, budget
  spend accumulation.
- **Ownership and existence checks.** `getAccount` throwing `AppError(404)` for
  another user's ID is a security boundary; assert both the message and the
  `statusCode`.
- Multi-step transactional flows — assert the whole set of writes, not just the
  first.
- Pure utils (`utils/transactionFilters.ts`) — cheap, fast, test directly.

Not worth testing: controllers (they're three lines of plumbing), routes, or the
repository (that would be testing Prisma).

## Frontend: test hooks, not markup

Every existing frontend test targets a hook. That's the right instinct — the
hooks hold the logic, and markup tests break on every redesign. Given this repo
is actively being redesigned, **don't write assertions against class names,
layout, or DOM structure.**

The wrapper pattern, with `retry: false` so failure tests don't hang:

```tsx
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const { result } = renderHook(() => useTransactions(), { wrapper: createWrapper() });
await waitFor(() => expect(result.current.transactions.isSuccess).toBe(true));
```

**A fresh QueryClient per test.** Sharing one leaks cache between tests and
produces order-dependent failures.

Worth testing:
- Controller logic: sorting, filtering, derived totals (`totalInflow`,
  `netBalance`), selection toggling.
- **Optimistic updates — both directions.** Assert the optimistic write lands,
  and assert rollback restores the snapshot when the mutation rejects. Rollback
  is the half that breaks in production and the half nobody tests. See
  [data-fetching](../data-fetching/SKILL.md).
- Query key construction (`financeQueries.test.ts`) — keys are stringly-typed at
  runtime, and a wrong key fails silently rather than loudly.
- Mappers and schemas — pure, cheap, high value.

If you do render a component, query by role or label (`getByRole`,
`findByText`) — never by class or test-id-as-styling-hook. Use
`userEvent` over `fireEvent`.

## What a test should look like

- **Name states the behavior**: `"should create a transaction and update account
  balance"`. Not `"works"`, not `"test 1"`.
- **Group with `describe`** by unit, nested by concern (`describe("Transactions")`
  inside `describe("Finance Service")`).
- **Arrange / act / assert**, in that order, visibly.
- **One behavior per test.** Multiple `expect`s are fine when they check one
  behavior's consequences.
- **Assert on outcomes, not call counts**, where you can. `toHaveBeenCalledWith`
  on a repository write is checking an outcome; asserting a helper was called
  twice is checking an implementation detail that will break on refactor.
- **No conditionals or loops in tests.** A test with an `if` is two tests.

## When to write one

- **A bug fix gets a test that fails before the fix.** Non-negotiable — that's the
  only proof the fix works and the only guard against regression.
- **New business rule in a service or controller hook** → test.
- **New optimistic mutation** → test the write and the rollback.
- **Pure function with branches** → test the branches.
- **Pure presentational component, redesign work, route wiring** → no test.

Don't chase coverage percentage. A test that asserts a mock was called with what
you just told it to call is worse than no test: it fails on refactor and passes
on breakage.