import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  startOfDay, 
  isWithinInterval,
  format 
} from 'date-fns';
import type { Expense } from '../types';

export type FilterType = 'thisMonth' | 'thisWeek' | 'monthly' | 'weekly' | 'custom';

export const getFilterDates = (type: FilterType, customStart?: Date, customEnd?: Date): { start: Date; end: Date } => {
  const now = new Date();
  const today = startOfDay(now);

  switch (type) {
    case 'thisMonth':
      return { start: startOfMonth(today), end: today };
    case 'thisWeek':
      return { start: startOfWeek(today), end: today };
    case 'monthly':
      return { start: startOfMonth(today), end: endOfMonth(today) };
    case 'weekly':
      return { 
        start: startOfWeek(today, { weekStartsOn: 1 }), 
        end: endOfWeek(today, { weekStartsOn: 1 }) 
      };
    case 'custom':
      return { 
        start: startOfDay(customStart!), 
        end: startOfDay(customEnd!) 
      };
    default:
      return { start: startOfMonth(today), end: today };
  }
};

export const timestampToDate = (timestamp: number): Date => {
  // Firebase Unix timestamp (milliseconds)
  return new Date(timestamp);
};

export const filterExpenses = (expenses: Expense[], filterType: FilterType, customStart?: Date, customEnd?: Date): Expense[] => {
  const { start, end } = getFilterDates(filterType, customStart, customEnd);
  
  return expenses.filter(expense => {
    const expenseDate = startOfDay(timestampToDate(expense.createdAt));
    return isWithinInterval(expenseDate, { start, end });
  });
};

export const formatFilterLabel = (type: FilterType, customStart?: Date, customEnd?: Date): string => {
  const now = new Date();
  
  switch (type) {
    case 'thisMonth':
      return `This Month (${format(now, 'MMM yyyy')})`;
    case 'thisWeek':
      return `This Week`;
    case 'monthly':
      return `Full Month`;
    case 'weekly':
      return `Full Week`;
    case 'custom':
      if (customStart && customEnd) {
        return `${format(customStart, 'MMM dd')} - ${format(customEnd, 'MMM dd, yyyy')}`;
      }
      return `Custom`;
    default:
      return 'This Month';
  }
};

// Bonus: For expense cards - format createdAt display
export const formatExpenseDate = (timestamp: number): string => {
  const date = timestampToDate(timestamp);
  const now = new Date();
  const today = startOfDay(now);
  const expenseDay = startOfDay(date);
  
  if (expenseDay.getTime() === today.getTime()) {
    return 'Today';
  }
  
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24));
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return format(date, 'MMM dd');
};