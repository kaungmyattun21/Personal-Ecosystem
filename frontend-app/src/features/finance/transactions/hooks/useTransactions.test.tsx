import { renderHook, waitFor } from '@testing-library/react';
import { useTransactions } from './useTransactions';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { financeService } from '@/lib/services/finance-service';
import { financeKeys } from '../../shared/financeQueries';
import { Transaction } from '@/types/finance';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';

// Vitest will automatically use '@/lib/services/__mocks__/finance-service'
vi.mock('@/lib/services/finance-service');

const createHarness = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { queryClient, wrapper };
};

const cachedLists = (queryClient: QueryClient) =>
  queryClient.getQueriesData<Transaction[]>({
    queryKey: financeKeys.transactions.all(),
  });

const tx = (over: Partial<Transaction>) =>
  ({ id: 't1', amount: '100', type: 'EXPENSE', accountId: 'acc_1', ...over }) as Transaction;

describe('useTransactions Hook', () => {
  const mockedService = vi.mocked(financeService);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch transactions using queryOptions', async () => {
    const { wrapper } = createHarness();
    const mockData = [tx({ description: 'Test' })];
    mockedService.getTransactions.mockResolvedValue(mockData);

    const { result } = renderHook(() => useTransactions(), { wrapper });

    await waitFor(() => expect(result.current.transactions.isSuccess).toBe(true));
    expect(result.current.transactions.data).toEqual(mockData);
  });

  it('should cache each filter combination under its own key', async () => {
    const { queryClient, wrapper } = createHarness();
    mockedService.getTransactions.mockResolvedValue([tx({})]);

    const { result } = renderHook(() => useTransactions({ type: 'INCOME' }), { wrapper });
    await waitFor(() => expect(result.current.transactions.isSuccess).toBe(true));

    const [[key]] = cachedLists(queryClient);
    expect(key).toEqual(financeKeys.transactions.list({ type: 'INCOME' }));
  });

  describe('createTransaction Mutation', () => {
    it('should optimistically insert into every cached filter view', async () => {
      const { queryClient, wrapper } = createHarness();
      mockedService.getTransactions.mockResolvedValue([tx({ id: 'existing' })]);

      // Populate two filter views the way the app does — via the query, not by
      // seeding a key by hand.
      const listAll = renderHook(() => useTransactions(), { wrapper });
      const listIncome = renderHook(() => useTransactions({ type: 'INCOME' }), { wrapper });
      await waitFor(() => {
        expect(listAll.result.current.transactions.isSuccess).toBe(true);
        expect(listIncome.result.current.transactions.isSuccess).toBe(true);
      });
      expect(cachedLists(queryClient)).toHaveLength(2);

      let resolve!: (value: Transaction) => void;
      mockedService.createTransaction.mockReturnValue(
        new Promise<Transaction>((r) => { resolve = r; }),
      );

      const pending = listAll.result.current.createTransaction.mutateAsync(
        tx({ id: undefined, description: 'New Laptop' }),
      );

      // Assert while the request is still in flight — onSettled would otherwise
      // refetch and mask whether the optimistic write ever landed.
      await waitFor(() => {
        for (const [, list] of cachedLists(queryClient)) {
          expect(list?.[0]?.description).toBe('New Laptop');
        }
      });

      resolve(tx({ id: 'tx_new', description: 'New Laptop' }));
      await pending;
    });

    it('should roll back every cached view on error', async () => {
      const { queryClient, wrapper } = createHarness();
      const initial = [tx({ id: 'existing', description: 'Rent' })];
      mockedService.getTransactions.mockResolvedValue(initial);

      const { result } = renderHook(() => useTransactions(), { wrapper });
      await waitFor(() => expect(result.current.transactions.isSuccess).toBe(true));

      mockedService.createTransaction.mockRejectedValue(new Error('Network Error'));
      mockedService.getTransactions.mockResolvedValue(initial);

      await expect(
        result.current.createTransaction.mutateAsync(tx({ description: 'Doomed' })),
      ).rejects.toThrow('Network Error');

      for (const [, list] of cachedLists(queryClient)) {
        expect(list?.some((t) => t.description === 'Doomed')).toBe(false);
      }
    });

    it('should not patch account balances optimistically', async () => {
      const { queryClient, wrapper } = createHarness();
      mockedService.getTransactions.mockResolvedValue([]);
      queryClient.setQueryData(financeKeys.accounts(), [{ id: 'acc_1', balance: '1000' }]);

      const { result } = renderHook(() => useTransactions(), { wrapper });
      await waitFor(() => expect(result.current.transactions.isSuccess).toBe(true));

      let resolve!: (value: Transaction) => void;
      mockedService.createTransaction.mockReturnValue(
        new Promise<Transaction>((r) => { resolve = r; }),
      );

      const pending = result.current.createTransaction.mutateAsync(
        tx({ amount: '200', type: 'EXPENSE', accountId: 'acc_1' }),
      );

      // The server owns Decimal arithmetic; the balance must stay untouched
      // until it answers.
      const accounts = queryClient.getQueryData<{ balance: string }[]>(financeKeys.accounts());
      expect(accounts?.[0].balance).toBe('1000');

      resolve(tx({ id: 'tx_new' }));
      await pending;
    });
  });

  describe('deleteTransaction Mutation', () => {
    it('should optimistically remove from every cached filter view', async () => {
      const { queryClient, wrapper } = createHarness();
      mockedService.getTransactions.mockResolvedValue([
        tx({ id: 'doomed' }),
        tx({ id: 'keeper' }),
      ]);

      const { result } = renderHook(() => useTransactions(), { wrapper });
      await waitFor(() => expect(result.current.transactions.isSuccess).toBe(true));

      let resolve!: () => void;
      mockedService.deleteTransaction.mockReturnValue(
        new Promise<void>((r) => { resolve = r; }),
      );

      const pending = result.current.deleteTransaction.mutateAsync('doomed');

      await waitFor(() => {
        for (const [, list] of cachedLists(queryClient)) {
          expect(list?.map((t) => t.id)).toEqual(['keeper']);
        }
      });

      resolve();
      await pending;
    });
  });
});
