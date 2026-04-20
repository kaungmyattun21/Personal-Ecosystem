import { renderHook, waitFor } from '@testing-library/react';
import { useBudgets } from './useBudgets';
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

describe('useBudgets Hook', () => {
  const mockedService = vi.mocked(financeService);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch budgets correctly', async () => {
    const mockData = [{ id: 'b1', name: 'Food', amount: 500 }] as any;
    mockedService.getBudgets.mockResolvedValue(mockData);

    const { result } = renderHook(() => useBudgets(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.budgets.isSuccess).toBe(true));
    expect(result.current.budgets.data).toEqual(mockData);
  });

  it('should call createBudget and invalidation logic', async () => {
    const wrapper = createWrapper();
    const queryClient = (wrapper({ children: null }) as any).props.client as QueryClient;
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    mockedService.createBudget.mockResolvedValue({ id: 'b2' } as any);

    const { result } = renderHook(() => useBudgets(), { wrapper });

    // Fix: amount should be string to match expected input type
    await result.current.createBudget.mutateAsync({ name: 'Travel', amount: '1000' } as any);

    expect(mockedService.createBudget).toHaveBeenCalled();
    expect(invalidateSpy).toHaveBeenCalledWith(expect.objectContaining({ queryKey: ['finance', 'budgets'] }));
  });
});
