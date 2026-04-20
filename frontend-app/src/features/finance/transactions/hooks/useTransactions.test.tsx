import { renderHook, waitFor } from '@testing-library/react';
import { useTransactions } from './useTransactions';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { financeService } from '@/lib/services/finance-service';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';

// Vitest will automatically use '@/lib/services/__mocks__/finance-service'
vi.mock('@/lib/services/finance-service');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useTransactions Hook', () => {
  const mockedService = vi.mocked(financeService);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch transactions using queryOptions', async () => {
    const mockData = [{ id: '1', amount: '100', description: 'Test' }] as any;
    mockedService.getTransactions.mockResolvedValue(mockData);

    const { result } = renderHook(() => useTransactions(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.transactions.isSuccess).toBe(true));
    expect(result.current.transactions.data).toEqual(mockData);
  });

  describe('createTransaction Mutation', () => {
    it('should perform optimistic updates on multiple query keys', async () => {
      const wrapper = createWrapper();
      const queryClient = (wrapper({ children: null }) as any).props.client as QueryClient;

      // Seed initial data
      const initialAccounts = [{ id: 'acc_1', balance: '1000' }];
      queryClient.setQueryData(['finance', 'accounts'], initialAccounts);
      queryClient.setQueryData(['finance', 'transactions'], []);

      const { result } = renderHook(() => useTransactions(), { wrapper });

      const newTx = {
        amount: '200',
        type: 'EXPENSE',
        accountId: 'acc_1',
        description: 'New Laptop',
      } as any;

      mockedService.createTransaction.mockResolvedValue({ id: 'tx_new', ...newTx });

      await result.current.createTransaction.mutateAsync(newTx);

      // Verify that accounts cache was updated optimistically
      const updatedAccounts = queryClient.getQueryData<any[]>(['finance', 'accounts']);
      expect(updatedAccounts?.[0].balance).toBe('800'); // 1000 - 200

      // Verify transaction was added
      const transactions = queryClient.getQueryData<any[]>(['finance', 'transactions']);
      expect(transactions).toHaveLength(1);
      expect(transactions?.[0].description).toBe('New Laptop');
    });

    it('should rollback updates on error', async () => {
      const wrapper = createWrapper();
      const queryClient = (wrapper({ children: null }) as any).props.client as QueryClient;

      const initialAccounts = [{ id: 'acc_1', balance: '1000' }];
      queryClient.setQueryData(['finance', 'accounts'], initialAccounts);

      const { result } = renderHook(() => useTransactions(), { wrapper });

      mockedService.createTransaction.mockRejectedValue(new Error('Network Error'));

      try {
        await result.current.createTransaction.mutateAsync({ amount: '200', accountId: 'acc_1', type: 'EXPENSE' } as any);
      } catch (e) {
        // Expected
      }

      // Balance should be rolled back to 1000
      const accounts = queryClient.getQueryData<any[]>(['finance', 'accounts']);
      expect(accounts?.[0].balance).toBe('1000');
    });
  });
});
