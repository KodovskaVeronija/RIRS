import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EmployeeExpensePage from '../pages/employeeExpensePage';
import { MemoryRouter } from 'react-router-dom';
import * as api from '../services/api'; // Adjust the path to match your project structure
import { act, waitFor } from '@testing-library/react';

jest.mock('../services/api', () => ({
  getGroups: jest.fn(() => Promise.resolve([])),
  getUserById: jest.fn(() => Promise.resolve({ name: 'Test User' })),
  getExpensesByUserId: jest.fn(() => Promise.resolve([])),
  requestExpense: jest.fn(() => Promise.resolve()),
}));
// Mock initial expense fetch
api.getExpensesByUserId.mockResolvedValueOnce([]);

// Mock after expense is added (when submitting the new expense)
api.getExpensesByUserId.mockResolvedValueOnce([
  {
    _id: '1',
    description: 'New expense',
    amount: 50,
    date: '2024-12-01',
    status: 'pending',
  },
]);

beforeEach(() => {
  jest.clearAllMocks();

  // Mock API methods
  api.getUserById.mockResolvedValue({ userId: 'test-user', budget: 500 });
  api.getExpensesByUserId.mockResolvedValue({});
  api.requestExpense.mockResolvedValue({});
});

describe('EmployeeExpensePage Component', () => {
  test('renders the component with default elements', () => {
    render(
      <MemoryRouter>
        <EmployeeExpensePage />
      </MemoryRouter>
    );

    expect(screen.getByText('Request Expense')).toBeInTheDocument();
    expect(screen.getByText('Filter Expenses by Date')).toBeInTheDocument();
    expect(screen.getByText('Your Expenses')).toBeInTheDocument();
  });

  test('filters expenses by date and shows no results if none match', async () => {
    render(
      <MemoryRouter>
        <EmployeeExpensePage />
      </MemoryRouter>
    );

    // Simulate date filtering where no expenses match
    fireEvent.change(screen.getByLabelText('Start Date'), {
      target: { value: '2024-01-01' },
    });
    fireEvent.change(screen.getByLabelText('End Date'), {
      target: { value: '2024-12-31' },
    });
    fireEvent.click(screen.getByText('Filter'));

    // Assert that "No expenses found" is displayed
    expect(await screen.findByText('No expenses found')).toBeInTheDocument();
  });

  test('displays no expenses when filter criteria do not match', () => {
    const { getByLabelText, getByText } = render(
      <MemoryRouter>
        <EmployeeExpensePage />
      </MemoryRouter>
    );

    // Set filter dates with no matching expenses
    fireEvent.change(getByLabelText('Start Date'), {
      target: { value: '2025-01-01' },
    });
    fireEvent.change(getByLabelText('End Date'), {
      target: { value: '2025-12-31' },
    });
    fireEvent.click(getByText('Filter'));

    // Ensure no expenses are displayed
    expect(screen.getByText('No expenses found')).toBeInTheDocument();
  });
  test('filters expenses by a date range and shows no results when no expenses match', async () => {
    render(
      <MemoryRouter>
        <EmployeeExpensePage />
      </MemoryRouter>
    );

    // Set filter dates with no matching expenses
    fireEvent.change(screen.getByLabelText('Start Date'), {
      target: { value: '2025-01-01' },
    });
    fireEvent.change(screen.getByLabelText('End Date'), {
      target: { value: '2025-12-31' },
    });
    fireEvent.click(screen.getByText('Filter'));

    // Assert that "No expenses found" is displayed
    expect(await screen.findByText('No expenses found')).toBeInTheDocument();
  });
});
