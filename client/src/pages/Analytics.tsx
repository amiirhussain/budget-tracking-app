import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, Tabs } from 'antd';
import { BudgetEntry } from '../types/Budget';
import { fetchBudgetEntries } from '../utils/AnalyticsUtils';

const { TabPane } = Tabs;

const Analytics: React.FC = () => {
  const [data, setData] = useState<BudgetEntry[]>([]);
  const [filter, setFilter] = useState<string | null>(null);

  useEffect(() => {
    if (filter === null) {
      setFilter('1');
      return;
    }

    async function fetchData() {
      try {
        const filteredData = await fetchBudgetEntries(filter);
        setData(filteredData);
      } catch (error) {}
    }

    fetchData();
  }, [filter]);

  return (
    <div className="container">
      <Card>
        <Tabs activeKey={filter || '1'} onChange={setFilter}>
          <TabPane tab="Last Month" key="1" />
          <TabPane tab="Last 6 Months" key="6" />
          <TabPane tab="Last 12 Months" key="12" />
        </Tabs>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="analytics-404">No data found.</div>
        )}
      </Card>
    </div>
  );
};

export default Analytics;
