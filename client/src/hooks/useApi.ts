const API_BASE_URL = 'http://localhost:1337/api/budget-entries';

export const fetchBudgetEntriesAPI = async (token: string) => {
  try {
    const req = await fetch(API_BASE_URL, {
      headers: {
        'x-access-token': token,
      },
    });
    return await req.json();
  } catch (error) {
    console.error('Error fetching budget entries:', error);
    throw error;
  }
};

export const deleteBudgetEntryAPI = async (
  recordKey: string,
  token: string,
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${recordKey}`, {
      method: 'DELETE',
      headers: {
        'x-access-token': token,
      },
    });
    return await response.json();
  } catch (error) {
    console.error('Error deleting budget entry:', error);
    throw error;
  }
};

export const updateBudgetEntryAPI = async (
  recordKey: string,
  values: any,
  token: string,
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${recordKey}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify(values),
    });
    return await response.json();
  } catch (error) {
    console.error('Error updating budget entry:', error);
    throw error;
  }
};

export const createBudgetEntryAPI = async (values: any, token: string) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify(values),
    });
    return await response.json();
  } catch (error) {
    console.error('Error creating budget entry:', error);
    throw error;
  }
};
