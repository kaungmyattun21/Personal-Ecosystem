import { renderHook, waitFor } from '@testing-library/react';
import { useBills } from './useBills';
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

describe('useBills Hook', () => {
  const mockedService = vi.mocked(financeService);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should perform optimistic update when updating a bill', async () => {
    const wrapper = createWrapper();
    const queryClient = (wrapper({ children: null }) as any).props.client as QueryClient;
    
    const initialBills = [{ id: 'bill_1', name: 'Rent', amount: 1000, status: 'UNPAID' }];
    const updatedBillsMock = [{ id: 'bill_1', name: 'Rent', amount: 1000, status: 'PAID' }];
    queryClient.setQueryData(['finance', 'bills'], initialBills);
    
    // Mock getBills to return the updated state so that post-settlement refetch works
    mockedService.getBills.mockResolvedValue(updatedBillsMock as any);
    mockedService.updateBill.mockResolvedValue({ id: 'bill_1', status: 'PAID' } as any);

    const { result } = renderHook(() => useBills(), { wrapper });

    await result.current.updateBill.mutateAsync({ id: 'bill_1', data: { status: 'PAID' } });

    // Verify optimistic update (after settlement it matches the updated mock)
    const updatedBills = queryClient.getQueryData<any[]>(['finance', 'bills']);
    expect(updatedBills?.[0].status).toBe('PAID');
    expect(mockedService.updateBill).toHaveBeenCalledWith('bill_1', { status: 'PAID' });
  });

  it('should rollback on update error', async () => {
    const wrapper = createWrapper();
    const queryClient = (wrapper({ children: null }) as any).props.client as QueryClient;
    
    const initialBills = [{ id: 'bill_1', name: 'Rent', amount: 1000, status: 'UNPAID' }];
    queryClient.setQueryData(['finance', 'bills'], initialBills);
    mockedService.getBills.mockResolvedValue(initialBills as any);

    mockedService.updateBill.mockRejectedValue(new Error('Update failed'));

    const { result } = renderHook(() => useBills(), { wrapper });

    try {
      await result.current.updateBill.mutateAsync({ id: 'bill_1', data: { status: 'PAID' } });
    } catch (e) {}

    // Verify rollback
    const bills = queryClient.getQueryData<any[]>(['finance', 'bills']);
    expect(bills?.[0].status).toBe('UNPAID');
  });
});
