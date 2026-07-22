import { renderHook, waitFor } from '@testing-library/react';
import { useSavingGoals } from './useSavingGoals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { financeService } from '@/lib/services/finance-service';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';

// Vitest will automatically use '@/lib/services/__mocks__/finance-service'
vi.mock('@/lib/services/finance-service');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useSavingGoals Hook', () => {
  const mockedService = vi.mocked(financeService);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch saving goals correctly', async () => {
    const mockData = [{ id: 'g1', name: 'Car', targetAmount: 20000, currentAmount: 5000 }] as any;
    mockedService.getSavingGoals.mockResolvedValue(mockData);

    const { result } = renderHook(() => useSavingGoals(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.savingGoals.isSuccess).toBe(true));
    expect(result.current.savingGoals.data).toEqual(mockData);
  });

  it('should invalidate finance queries after adding a contribution', async () => {
    const wrapper = createWrapper();
    const queryClient = (wrapper({ children: null }) as any).props.client as QueryClient;
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    mockedService.createSavingContribution.mockResolvedValue({ id: 'c1' } as any);

    const { result } = renderHook(() => useSavingGoals(), { wrapper });

    await result.current.createSavingContribution.mutateAsync({ savingGoalId: 'g1', amount: 500 } as any);

    expect(mockedService.createSavingContribution).toHaveBeenCalled();
    expect(invalidateSpy).toHaveBeenCalledWith(expect.objectContaining({ queryKey: ['finance'] }));
  });
});
