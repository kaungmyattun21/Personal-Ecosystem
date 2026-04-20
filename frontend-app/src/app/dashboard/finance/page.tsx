import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { financeQueries } from "@/features/finance/shared/financeQueries";
import FinanceView from "@/features/finance/shared/view/FinanceView";

export default async function FinancePage() {
  const queryClient = getQueryClient();

  // Prefetch data on the server for all finance sections
  await Promise.all([
    queryClient.prefetchQuery(financeQueries.transactions()),
    queryClient.prefetchQuery(financeQueries.accounts()),
    queryClient.prefetchQuery(financeQueries.categories()),
    queryClient.prefetchQuery(financeQueries.bills()),
    queryClient.prefetchQuery(financeQueries.budgets()),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FinanceView />
    </HydrationBoundary>
  );
}
