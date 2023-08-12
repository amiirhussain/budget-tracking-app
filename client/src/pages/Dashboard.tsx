import React, { useState } from 'react';
import {
  Button,
  DatePicker,
  Space,
  Modal,
  Form,
  Input,
  Table,
  Dropdown,
  Row,
  Card,
} from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

import '../styles/dashboard.css';

interface BudgetEntry {
  key: string;
  name: string;
  price: string;
  date: string;
}

const Dashboard: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState<string | null>(null); // Track the visible dropdown

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDropdownVisibleChange = (visible: boolean, recordKey: string) => {
    setDropdownVisible(visible ? recordKey : null); // Show the dropdown for the clicked row
  };

  const handleDelete = () => {
    console.log('delete');
  };

  const handleUpdate = () => {
    console.log('update');
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
    {
      title: 'Action',
      key: 'action',
      render: (text: string, record: BudgetEntry) => (
        <Dropdown
          overlay={menu}
          trigger={['click']}
          visible={dropdownVisible === record.key} // Show the dropdown for this row's key
          onVisibleChange={(visible) =>
            handleDropdownVisibleChange(visible, record.key)
          }
        >
          <Button style={{ textAlign: 'center' }}>
            <img
              src={require('../assets/three-dots-menu.png')}
              alt="Menu"
              style={{ width: '5px' }}
            />
          </Button>
        </Dropdown>
      ),
    },
  ];

  const data: BudgetEntry[] = [
    {
      key: '1',
      name: 'Item 1',
      price: '$100',
      date: '2023-08-12',
    },
    {
      key: '2',
      name: 'Item 2',
      price: '$50',
      date: '2023-08-11',
    },
    {
      key: '3',
      name: 'Item 3',
      price: '$75',
      date: '2023-08-10',
    },
    {
      key: '4',
      name: 'Item 3',
      price: '$75',
      date: '2023-08-10',
    },
    {
      key: '5',
      name: 'Item 3',
      price: '$75',
      date: '2023-08-10',
    },
    {
      key: '6',
      name: 'Item 3',
      price: '$75',
      date: '2023-08-10',
    },
  ];

  const menu = (
    <div className="action-button-container">
      <Button icon={<EditOutlined />} block onClick={handleUpdate}>
        Edit
      </Button>
      <Button icon={<DeleteOutlined />} block onClick={handleDelete}>
        Delete
      </Button>
    </div>
  );

  return (
    <div className="dashboard-card">
      <Card>
        <Row justify="space-between" align="middle" className="row">
          <Space>
            <DatePicker size="large" placeholder="Select Date" />
            <Button size="large" type="primary" className="filter-btn" danger>
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
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={[
            <Button key="submit" type="primary" className="addEntry-btn" block>
              Submit
            </Button>,
          ]}
        >
          <Form>
            <Form.Item>
              <Input placeholder="Name" size="large" />
            </Form.Item>
            <Form.Item>
              <Input type="number" placeholder="Price" size="large" />
            </Form.Item>
            <Form.Item>
              <DatePicker size="large" style={{ width: '100%' }} />
            </Form.Item>
          </Form>
        </Modal>

        <Table
          columns={columns}
          dataSource={data}
          pagination={data.length > 5 ? { pageSize: 5 } : false}
        />
      </Card>
    </div>
  );
};

export default Dashboard;
