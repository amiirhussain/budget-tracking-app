import React, { useEffect } from 'react';
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
} from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import useBudgetUtil from '../utils/BudgetUtil';

const Dashboard: React.FC = () => {
  const {
    isModalVisible,
    loading,
    setLoading,
    editingEntry,
    budgetEntries,
    filteredBudgetEntries,
    filterDate,
    formRef,
    fetchBudgetEntries,
    handleCancel,
    handleDelete,
    handleUpdate,
    showModal,
    handleAddEntry,
    handleFilterDateChange,
    handleFilterButtonClick,
  } = useBudgetUtil();

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log(token);
    if (!token) {
      navigate('/login', { replace: true });
    } else {
      setTimeout(() => {
        setLoading(false);
        fetchBudgetEntries();
      }, 2000);
    }
  }, []);

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
            title={editingEntry ? 'Edit Budget' : 'Add Budget'}
            open={isModalVisible}
            onCancel={handleCancel}
            footer={null}
          >
            <Form ref={formRef} onFinish={handleAddEntry}>
              <Form.Item
                name="date"
                rules={[{ required: true, message: 'Date is required' }]}
              >
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
                  {editingEntry ? 'Update' : 'Submit'}
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
      </div>
    </>
  );
};

export default Dashboard;
