import dayjs from 'dayjs';
import { BudgetEntry } from '../types/Budget';

export async function fetchBudgetEntries(
  filter: string | null,
): Promise<BudgetEntry[]> {
  try {
    const req = await fetch('http://localhost:1337/api/budget-entries', {
      headers: {
        'x-access-token': localStorage.getItem('token') || '',
      },
    });

    const result = await req.json();
    if (result.status === 'ok') {
      const formattedData = result.budgetEntries.map((entry: BudgetEntry) => ({
        ...entry,
        date: dayjs(entry.date).format('MM-DD-YYYY'),
      }));

      const now = dayjs();
      const filteredData = formattedData.filter((entry: BudgetEntry) => {
        const date = dayjs(entry.date, 'MM-DD-YYYY');
        if (filter === '1') {
          return date.isAfter(now.subtract(1, 'month'));
        } else if (filter === '6') {
          return date.isAfter(now.subtract(6, 'months'));
        } else if (filter === '12') {
          return date.isAfter(now.subtract(12, 'months'));
        }
        return false;
      });

      return filteredData;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Error fetching budget entries:', error);
    throw error;
  }
}
