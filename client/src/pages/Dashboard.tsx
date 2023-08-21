import React, { useEffect, useState, useRef } from 'react';
// import jwtDecode from 'jwt-decode';
import '../styles/dashboard.css';
import { useNavigate } from 'react-router';
import {
  Button,
  Space,
  Modal,
  Form,
  Input,
  Table,
  Row,
  Card,
  DatePicker,
  notification,
} from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
// import CustomDatePicker from '../components/CustomDatePicker';

const Dashboard: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [editingEntry, setEditingEntry] = useState<any | null>(null);

  const [budgetEntries, setBudgetEntries] = useState<any[]>([]);
  const [filteredBudgetEntries, setFilteredBudgetEntries] = useState<any[]>([]);
  const [filterDate, setFilterDate] = useState<Date | null>(null);

  const formRef = useRef<any>(null);

  async function fetchBudgetEntries() {
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
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log(token);
    // console.log()
    if (!token) {
      navigate('/login', { replace: true });
    } else {
      setTimeout(() => {
        setLoading(false);
        fetchBudgetEntries();
      }, 2000);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    formRef.current?.resetFields();
  };

  const handleDelete = async (recordKey: string) => {
    console.log('Delete entry with key:', recordKey);
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
        console.log('Budget entry deleted:', data.message);

        notification.destroy(recordKey);
        notification.warning({
          message: 'Buget Deleted!',
        });

        // Remove the deleted entry from the budgetEntries array
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
    console.log('Edit entry with key:', record.key);
    setEditingEntry(record);
    showModal();
  };

  const showModal = () => {
    setIsModalVisible(true);
    formRef.current?.resetFields();
  };

  const handleAddEntry = async (values: any) => {
    console.log('Form values:', values);
    try {
      if (editingEntry) {
        // Update existing entry
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
          console.log('Budget entry updated:', data.message);
          setIsModalVisible(false);
          setEditingEntry(null);

          // Update the budgetEntries array with the edited entry
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
        // Add new entry
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
          console.log('Budget entry added:', data.message);

          setIsModalVisible(false);

          // Fetch updated budget entries and update the state
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

  // Rest of the code remains the same

  const actionsColumn = {
    title: 'Action',
    key: 'action',
    render: (text: string, record: any) => (
      <Space>
        <Button
          className="action-btn"
          icon={<EditOutlined />}
          onClick={() => handleUpdate(record)}
        >
          Edit
        </Button>
        <Button
          className="action-btn"
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record.key)}
        >
          Delete
        </Button>
      </Space>
    ),
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    actionsColumn,
  ];

  return (
    <>
      <div className="dashboard-card">
        <Card>
          <Row justify="space-between" align="middle" className="row">
            <Space>
              <DatePicker
                value={filterDate ? dayjs(filterDate) : null}
                onChange={handleFilterDateChange}
                placeholder="Filter by Date"
                size="large"
              />
              <Button
                size="large"
                type="primary"
                className="filter-btn"
                danger
                onClick={handleFilterButtonClick}
              >
                Filter by Date
              </Button>
            </Space>
            <Button
              size="large"
              type="primary"
              className="addEntry-btn"
              onClick={showModal}
              danger
            >
              Add New Entry
            </Button>
          </Row>

          <Modal
            title="Add Budget"
            open={isModalVisible}
            onCancel={handleCancel}
            footer={null}
          >
            <Form ref={formRef} onFinish={handleAddEntry}>
              <Form.Item
                name="date"
                rules={[{ required: true, message: 'Date is required' }]}
              >
                {/* <CustomDatePicker /> */}
                <DatePicker size="large" />
              </Form.Item>
              <Form.Item
                name="name"
                rules={[{ required: true, message: 'Name is required' }]}
              >
                <Input placeholder="Name" size="large" />
              </Form.Item>
              <Form.Item
                name="price"
                rules={[{ required: true, message: 'Price is required' }]}
              >
                <Input type="number" placeholder="Price" size="large" />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="addEntry-btn"
                  block
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Modal>

          <Table
            columns={columns}
            dataSource={
              filteredBudgetEntries.length > 0
                ? filteredBudgetEntries
                : filterDate !== null
                ? []
                : budgetEntries
            }
            pagination={budgetEntries.length > 6 ? { pageSize: 6 } : false}
            loading={loading}
            rowKey="key"
          />
        </Card>
        <Card>
          <div className="logout-btn">
            <Button onClick={handleLogout}>Logout</Button>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Dashboard;
