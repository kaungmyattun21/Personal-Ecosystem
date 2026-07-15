import { describe, it, expect, vi } from 'vitest';
import { financeKeys, financeQueries } from './financeQueries';
import { financeService } from '@/lib/services/finance-service';

// Mock the finance service to ensure we're testing the logic, not the implementation
vi.mock('@/lib/services/finance-service', () => ({
  financeService: {
    getAccounts: vi.fn(),
    getCategories: vi.fn(),
    getBills: vi.fn(),
    getBudgets: vi.fn(),
    getSavingGoals: vi.fn(),
    getTransactions: vi.fn(),
  },
}));

describe('Finance Query Logic', () => {
  describe('financeKeys', () => {
    it('should generate basic namespaced keys', () => {
      expect(financeKeys.all).toEqual(['finance']);
      expect(financeKeys.accounts()).toEqual(['finance', 'accounts']);
      expect(financeKeys.budgets()).toEqual(['finance', 'budgets']);
    });

    it('should correctly nest transaction keys with filters', () => {
      const filters = { search: 'target', type: 'EXPENSE' };
      const key = financeKeys.transactions.list(filters);
      
      expect(key).toContain('transactions');
      expect(key[key.length - 1]).toEqual(filters);
    });

    it('should provide a default empty object for missing filters', () => {
      const key = financeKeys.transactions.list();
      expect(key[key.length - 1]).toEqual({});
    });
  });

  describe('financeQueries', () => {
    it('should associate the correct queryKey with queryOptions', () => {
      const options = financeQueries.accounts();
      expect(options.queryKey).toEqual(['finance', 'accounts']);
    });

    it('should pass filters to the service function in transactions query', () => {
      const filters = { search: 'test' };
      const options = financeQueries.transactions(filters);
      
      // Execute the queryFn manually
      if (typeof options.queryFn === 'function') {
        options.queryFn({ queryKey: options.queryKey, meta: undefined, signal: new AbortController().signal, client: {} as any });
        expect(financeService.getTransactions).toHaveBeenCalledWith(filters);
      }
    });
  });
});
