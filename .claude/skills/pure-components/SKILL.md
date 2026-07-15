---
name: pure-components
description: Rules for presentational components in frontend-app — props-in/JSX-out, no data fetching or dispatch below the view, correct memo/key/derived-state usage. Read before creating or editing any file in a feature's components/ directory or in components/ui/.
---

# Pure components

A component in `components/` is a function of its props. Same props in, same JSX
out. It does not fetch, dispatch, navigate, toast, or reach into a store.

## The contract

```tsx
interface TransactionRowProps {
  tx: Transaction;
  isLast: boolean;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}
```

Everything it renders arrives as a prop. Everything it *causes* leaves through a
callback prop. `TransactionRow` doesn't know a confirm dialog exists — it calls
`onToggleSelect` and the controller decides.

**Allowed inside a presentational component:**
- Props, and rendering them.
- Purely visual local state (a hover flag, an open/closed accordion) that nothing
  outside the component can observe.
- Presentation lookup tables. `TYPE_CONFIG` in `TransactionRow` maps
  `INCOME`/`EXPENSE`/`TRANSFER` to icons and colors — that is styling data, and it
  belongs with the styling.
- `cn()`, `cva`, Radix primitives, `lucide-react` icons, `date-fns` formatting.

**Not allowed:**
- `useQuery`, `useMutation`, or anything from `@/lib/services`.
- `useDispatch`, `useSelector`.
- `toast`, `useConfirm`, `useRouter`.
- `useEffect` that talks to anything outside the component.
- Business rules — "a bill is overdue if…" belongs in a hook or a util, not in a
  ternary inside JSX.

If a component needs one of those, it is not presentational. Either lift the
concern into the view's controller and pass it down, or the file belongs in
`view/` instead.

## Views are the exception, and they stay thin

A `view/` file may call exactly one controller hook and compose components:

```tsx
export function TransactionListView({ limit, title }: TransactionListViewProps) {
  const ctrl = useTransactionListController({ limit });

  if (ctrl.isLoading) return <SkeletonMarkup />;

  return /* arrange components, wire ctrl.* into their props */;
}
```

A view does not compute business values inline, does not call `useMutation`
directly, and does not hold state the controller could hold. If you're adding
`useState` to a view, it goes in the controller instead.

## Derived state, not synced state

Never mirror props into state with a `useEffect`. Compute it:

```tsx
// Wrong — two sources of truth, one render behind
const [total, setTotal] = useState(0);
useEffect(() => { setTotal(sum(items)); }, [items]);

// Right
const total = useMemo(() => sum(items), [items]);
```

`useEffect` is for synchronizing with something *outside* React. Deriving a value
from props is not that. The controllers in this codebase compute
`filteredAndSortedData` and the inflow/outflow totals with `useMemo` — follow
that.

## Purity in practice

- **No mutation of props.** `[...list].sort(...)` — never `list.sort(...)`, which
  mutates the array React Query handed you and corrupts the cache.
- **No side effects during render**: no `Date.now()`, `Math.random()`, or
  `localStorage` reads in the render body if the result is rendered. They make
  the component non-deterministic and break hydration. Formatting a *prop* date
  with `format(new Date(tx.date), ...)` is fine — it's derived from input.
- **Keys are stable IDs.** `key={tx.id}`. Array index only for genuinely static
  lists — the skeleton placeholders using `[...Array(3)].map((_, i) => ...)` are
  the legitimate case.

## Memoization

Don't reach for `memo` by default. Reach for it when a component renders in a
long list and its parent re-renders on unrelated state — `TransactionRow` under a
table with live filter state is the real case.

`memo` only works if props are referentially stable. Wrapping a component in
`memo` while passing it a fresh inline arrow every render buys nothing. If you
memo a list row, the handler it receives must come from a `useCallback` in the
controller, or be a stable module-level function.

For genuinely large lists, `react-window` is already a dependency — prefer
virtualization over micro-optimizing row renders.

## Composition over configuration

A component with a growing set of boolean props (`isCompact`, `hideHeader`,
`showActions`) is asking to be split, or to accept `children` / a slot prop
instead. Variant styling belongs in `cva`, following `components/ui/`.
