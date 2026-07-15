---
name: server-first
description: Next.js App Router server/client boundary rules for frontend-app — where "use client" belongs, server prefetch + HydrationBoundary, and pushing the boundary down to interactive leaves. Read before adding "use client", creating a page/layout, or adding a component to a feature view.
---

# Server first

Default to a server component. Add `"use client"` only when a specific component
needs interactivity — and add it as far **down** the tree as possible.

## Current state — read this first

70 of 98 `.tsx` files in `frontend-app/src` are `"use client"`. The route pages
are correct: they're async server components that prefetch and hydrate. But the
client boundary currently starts at the *view* and swallows everything beneath it,
including components that never needed to be client.

**This skill is prescriptive, not descriptive.** When you touch a slice, move the
boundary down. Don't rewrite unrelated files to chase the ratio, and don't treat
an existing client-heavy view as license to add more.

## The page pattern — keep it

Route pages fetch on the server and hand a dehydrated cache to the client. This
is correct and every new page follows it:

```tsx
// app/dashboard/finance/page.tsx
export default async function FinancePage() {
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery(financeQueries.transactions()),
    queryClient.prefetchQuery(financeQueries.accounts()),
    // ...
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FinanceView />
    </HydrationBoundary>
  );
}
```

Rules:
- **Pages and layouts are never `"use client"`.** No exceptions. If a page needs
  interactivity, it renders a client component.
- **Prefetch on the server for anything above the fold.** Parallel with
  `Promise.all` — never `await` prefetches in sequence.
- **Query options come from the shared factory** (`financeQueries`) so server
  prefetch and client `useQuery` cannot drift. See
  [data-fetching](../data-fetching/SKILL.md).

## Pushing the boundary down

The default instinct — put `"use client"` on the view and stop thinking — is what
produced the current ratio. The better shape:

```
page.tsx                    server: prefetch + hydrate
└─ FinanceView              server: layout, headings, static chrome
   ├─ SummaryCards          server: renders prefetched data, no interaction
   └─ TransactionListView   "use client": owns filter/sort/selection state
      ├─ TransactionFilters (client — inside the boundary already)
      └─ TransactionRow     (client — needs onToggleSelect)
```

A component needs `"use client"` **only** if it uses:
- `useState`, `useReducer`, `useEffect`, `useRef` for interaction
- Event handlers (`onClick`, `onChange`, …)
- Browser APIs (`window`, `document`, `localStorage`)
- Context/state that is client-only: `useSelector`, `useDispatch`, `useQuery`,
  `useConfirm`, `next-themes`, `framer-motion`, `sonner`
- Radix primitives that manage their own open/close state

A component does **not** need it to:
- Render props, including data from the hydrated cache
- Format a date, run `cn()`, or apply a `cva` variant
- Render an icon or static markup

**The move that actually pays:** when a view is client-only for one interactive
sub-tree, extract that sub-tree into its own client component and let the wrapper
stay server. Static headers, summary tiles, empty states, and skeleton chrome are
usually free wins.

## Composition escape hatch

A client component can render server components **passed as `children` or props**.
This is how you keep a mostly-static subtree on the server even inside an
interactive shell:

```tsx
// InteractiveShell is "use client"; StaticPanel stays a server component
<InteractiveShell>
  <StaticPanel />
</InteractiveShell>
```

Importing `StaticPanel` *inside* `InteractiveShell` makes it client. Passing it
through does not. Reach for this before giving up and marking a whole subtree
client.

## Hard rules

- **Never `"use client"` on a page or layout.**
- **Never import a server-only module from a client component.** Secrets, DB
  handles, and server env vars must not cross. Anything a client component
  imports ships to the browser.
- **`"use client"` is the first line of the file**, above imports.
- **The directive is transitive.** Everything a client component imports becomes
  client. So the boundary file should be the *smallest* component that needs it,
  never the largest.
- **Server components cannot use hooks or handlers.** If you're adding one to a
  server component, you're choosing to move the boundary — do it deliberately, at
  the leaf.

## Review checklist

When adding `"use client"`, answer in one sentence: *which specific interaction
requires this?* If the answer is "the thing it renders needs it", you've put the
directive too high — move it down to that thing.
