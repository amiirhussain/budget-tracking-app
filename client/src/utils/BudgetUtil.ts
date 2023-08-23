import { useState, useRef } from 'react';
import dayjs from 'dayjs';
import { notification } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { BudgetEntry } from '../types/Budget';
import {
  fetchBudgetEntriesAPI,
  deleteBudgetEntryAPI,
  updateBudgetEntryAPI,
  createBudgetEntryAPI,
} from '../hooks/useGetApi';

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
    const token = localStorage.getItem('token') || '';
    const data = await fetchBudgetEntriesAPI(token);
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
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingEntry(null);
    formRef.current?.resetFields();
  };

  const handleDelete = async (recordKey: string) => {
    const token = localStorage.getItem('token') || '';
    const data = await deleteBudgetEntryAPI(recordKey, token);
    if (data.status === 'ok') {
      notification.destroy(recordKey);
      notification.warning({ message: 'Budget Deleted!' });
      setBudgetEntries((prevEntries) =>
        prevEntries.filter((entry) => entry.key !== recordKey),
      );
    } else {
      alert(data.error);
    }
  };

  const handleUpdate = (record: any) => {
    setEditingEntry(record);
    formRef.current?.setFieldsValue({
      name: record.name,
      price: record.price,
      date: dayjs(record.date, 'MM-DD-YYYY'),
    });
    setIsModalVisible(true);
  };

  const handleAddEntry = async (values: any) => {
    const token = localStorage.getItem('token') || '';
    if (editingEntry) {
      const data = await updateBudgetEntryAPI(editingEntry.key, values, token);
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
        notification.success({ message: 'Budget Updated Successfully' });
        fetchBudgetEntries();
      } else {
        alert(data.error);
      }
    } else {
      const data = await createBudgetEntryAPI(values, token);
      if (data.status === 'ok') {
        setIsModalVisible(false);
        fetchBudgetEntries();
        formRef.current?.resetFields();
        notification.success({ message: 'Budget Created' });
      } else {
        alert(data.error);
      }
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

  const showModal = () => {
    setIsModalVisible(true);
    formRef.current?.resetFields();
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
    showModal,
    fetchBudgetEntries,
    handleCancel,
    handleDelete,
    handleUpdate,
    handleAddEntry,
    handleFilterDateChange,
    handleFilterButtonClick,
  };
};

export default useBudgetUtil;
