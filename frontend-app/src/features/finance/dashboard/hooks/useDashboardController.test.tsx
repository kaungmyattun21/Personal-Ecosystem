import { renderHook } from '@testing-library/react';
import { useDashboardController } from './useDashboardController';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSession } from 'next-auth/react';
import { useAccounts } from '@/features/finance/shared/hooks/useAccounts';
import { useTransactions } from '@/features/finance/transactions/hooks/useTransactions';

// Mock dependencies
vi.mock('next-auth/react');
vi.mock('@/features/finance/shared/hooks/useAccounts');
vi.mock('@/features/finance/transactions/hooks/useTransactions');

describe('useDashboardController Hook', () => {
  const mockedSession = vi.mocked(useSession);
  const mockedAccounts = vi.mocked(useAccounts);
  const mockedTransactions = vi.mocked(useTransactions);

  const mockSession = { user: { name: 'John Doe' } };
  const mockAccountData = {
    data: [
      { id: '1', balance: '1000' },
      { id: '2', balance: '500' }
    ],
    isLoading: false,
  };
  const mockTransactionData = {
    data: [
      { id: 't1', amount: '200', type: 'INCOME', date: new Date().toISOString() },
      { id: 't2', amount: '100', type: 'EXPENSE', date: new Date().toISOString() }
    ],
    isLoading: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockedSession.mockReturnValue({ data: mockSession } as any);
    mockedAccounts.mockReturnValue({ accounts: mockAccountData } as any);
    mockedTransactions.mockReturnValue({ transactions: mockTransactionData } as any);
  });

  it('should calculate total balance correctly', () => {
    const { result } = renderHook(() => useDashboardController());
    expect(result.current.totalBalance).toBe(1500);
    expect(result.current.integerPart).toBe(1500);
    expect(result.current.decimalPart).toBe('00');
  });

  it('should parse user name from session', () => {
    const { result } = renderHook(() => useDashboardController());
    expect(result.current.userName).toBe('John');
  });

  it('should calculate month-over-month stats', () => {
    const { result } = renderHook(() => useDashboardController());
    expect(result.current.currentMonthIncome).toBe(200);
    expect(result.current.thisMonthExpense).toBe(100);
  });

  it('should generate chart data for weekly range', () => {
    const { result } = renderHook(() => useDashboardController());
    const chartData = result.current.getChartData('weekly');
    
    expect(chartData.length).toBeGreaterThan(0);
    // Find today's data in the chart
    const today = chartData[chartData.length - 1];
    expect(today.income).toBe(200);
    expect(today.expense).toBe(100);
  });

  it('should handle loading states correctly', () => {
    mockedAccounts.mockReturnValue({ accounts: { ...mockAccountData, isLoading: true } } as any);
    const { result } = renderHook(() => useDashboardController());
    expect(result.current.isLoading).toBe(true);
  });
});
