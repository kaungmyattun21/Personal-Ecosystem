import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { kitchenQueries } from "@/features/kitchen/shared/kitchenQueries";
import { KitchenView } from "@/features/kitchen/shared/view/KitchenView";

export default async function KitchenPage() {
  const queryClient = getQueryClient();

  // Prefetch data on the server
  await Promise.all([
    queryClient.prefetchQuery(kitchenQueries.groceryItems()),
    queryClient.prefetchQuery(kitchenQueries.shoppingLists()),
    queryClient.prefetchQuery(kitchenQueries.mealPlans()),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <KitchenView />
    </HydrationBoundary>
  );
}
