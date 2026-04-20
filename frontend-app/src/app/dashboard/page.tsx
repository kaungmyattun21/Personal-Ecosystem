import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { financeQueries } from "@/features/finance/shared/financeQueries";
import DashboardView from "@/features/finance/dashboard/view/DashboardView";

export default async function DashboardPage() {
  const queryClient = getQueryClient();

  // Prefetch data on the server
  await Promise.all([
    queryClient.prefetchQuery(financeQueries.accounts()),
    queryClient.prefetchQuery(financeQueries.transactions()),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardView />
    </HydrationBoundary>
  );
}
