import { useState, useRef } from 'react';
import dayjs from 'dayjs';
import { notification } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { BudgetEntry } from '../types/Budget';

const useBudgetUtil = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingEntry, setEditingEntry] = useState<BudgetEntry | null>(null);
  const [budgetEntries, setBudgetEntries] = useState<BudgetEntry[]>([]);
  const [filteredBudgetEntries, setFilteredBudgetEntries] = useState<
    BudgetEntry[]
  >([]);
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const formRef = useRef<FormInstance | null>(null);

  const fetchBudgetEntries = async () => {
    try {
      const req = await fetch('http://localhost:1337/api/budget-entries', {
        headers: {
          'x-access-token': localStorage.getItem('token') || '',
        },
      });

      const data = await req.json();
      if (data.status === 'ok') {
        const formattedBudgetEntries = data.budgetEntries.map((entry: any) => ({
          ...entry,
          key: entry._id,
          date: dayjs(entry.date).format('MM-DD-YYYY'),
        }));
        setBudgetEntries(formattedBudgetEntries);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error fetching budget entries:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingEntry(null);
    formRef.current?.resetFields();
  };

  const handleDelete = async (recordKey: string) => {
    try {
      const response = await fetch(
        `http://localhost:1337/api/budget-entries/${recordKey}`,
        {
          method: 'DELETE',
          headers: {
            'x-access-token': localStorage.getItem('token') || '',
          },
        },
      );
      const data = await response.json();
      if (data.status === 'ok') {
        notification.destroy(recordKey);
        notification.warning({
          message: 'Buget Deleted!',
        });
        setBudgetEntries((prevEntries) =>
          prevEntries.filter((entry) => entry.key !== recordKey),
        );
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error deleting budget entry:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const handleUpdate = (record: any) => {
    setEditingEntry(record);
    formRef.current?.setFieldsValue({
      name: record.name,
      price: record.price,
      date: dayjs(record.date, 'MM-DD-YYYY'),
    });
    showModal();
  };

  const showModal = () => {
    setIsModalVisible(true);
    formRef.current?.resetFields();
  };

  const handleAddEntry = async (values: any) => {
    try {
      if (editingEntry) {
        const response = await fetch(
          `http://localhost:1337/api/budget-entries/${editingEntry.key}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': localStorage.getItem('token') || '',
            },
            body: JSON.stringify(values),
          },
        );
        const data = await response.json();
        if (data.status === 'ok') {
          setIsModalVisible(false);
          setEditingEntry(null);
          setBudgetEntries((prevEntries) =>
            prevEntries.map((entry) =>
              entry.key === editingEntry.key
                ? {
                    ...entry,
                    name: values.name,
                    price: values.price,
                    date: values.date,
                  }
                : entry,
            ),
          );
          notification.success({
            message: 'Budget Update Successfully',
          });
          fetchBudgetEntries();
        } else {
          alert(data.error);
        }
      } else {
        const response = await fetch(
          'http://localhost:1337/api/budget-entries',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': localStorage.getItem('token') || '',
            },
            body: JSON.stringify(values),
          },
        );
        const data = await response.json();
        if (data.status === 'ok') {
          setIsModalVisible(false);
          fetchBudgetEntries();
          formRef.current?.resetFields();
          notification.success({
            message: 'Budget Created',
          });
        } else {
          alert(data.error);
        }
      }
    } catch (error) {
      console.error('Error adding/updating budget entry:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const handleFilterDateChange = (date: any) => {
    setFilterDate(date);
  };

  const handleFilterButtonClick = () => {
    if (!filterDate) {
      setFilteredBudgetEntries([]);
    } else {
      const filteredEntries = budgetEntries.filter((entry) =>
        dayjs(entry.date).isSame(dayjs(filterDate), 'day'),
      );
      setFilteredBudgetEntries(filteredEntries);
    }
  };

  return {
    isModalVisible,
    setIsModalVisible,
    loading,
    setLoading,
    editingEntry,
    setEditingEntry,
    budgetEntries,
    setBudgetEntries,
    filteredBudgetEntries,
    setFilteredBudgetEntries,
    filterDate,
    setFilterDate,
    formRef,
    fetchBudgetEntries,
    handleLogout,
    handleCancel,
    handleDelete,
    handleUpdate,
    showModal,
    handleAddEntry,
    handleFilterDateChange,
    handleFilterButtonClick,
  };
};

export default useBudgetUtil;
