import React from 'react';
import { SearchOutlined } from "@mui/icons-material";

import { Button, Input, Space, Table } from "antd";

const data = [
  { key: "1", name: "John Brown", age: 32, address: "New York No. 1 Lake Park" },
  { key: "2", name: "Jim Green", age: 42, address: "London No. 1 Lake Park" },
  { key: "3", name: "Joe Black", age: 32, address: "Sydney No. 1 Lake Park" },
  { key: "4", name: "Jim Red", age: 32, address: "London No. 2 Lake Park" },
  { key: "5", name: "Jim Red", age: 32, address: "London No. 2 Lake Park" },
  { key: "6", name: "Jim Red", age: 32, address: "London No. 2 Lake Park" },
  { key: "7", name: "Jim Red", age: 32, address: "London No. 2 Lake Park" },
  { key: "8", name: "Jim Red", age: 32, address: "London No. 2 Lake Park" },
  { key: "9", name: "Jim Red", age: 32, address: "London No. 2 Lake Park" },
  { key: "10", name: "Jim Red", age: 32, address: "London No. 2 Lake Park" },
  { key: "11", name: "Jim Red", age: 32, address: "London No. 2 Lake Park" },
  { key: "12", name: "Jim Red", age: 32, address: "London No. 2 Lake Park" },
  { key: "13", name: "Jim Red", age: 32, address: "London No. 2 Lake Park" },
  { key: "14", name: "Jim Red", age: 32, address: "London No. 2 Lake Park" },
];

const onChange = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};

const Assignment = () => {
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => confirm()}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters()}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : "",
  });

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      width: "30%",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Age",
      dataIndex: "age",
      ...getColumnSearchProps("age"),
    },
    {
      title: "Address",
      dataIndex: "address",
      ...getColumnSearchProps("address"),
      width: "40%",
    },
  ];

  return (
    <Table
      rowSelection={{
        type: "checkbox",
      }}
      columns={columns}
      dataSource={data}
      onChange={onChange}
    />
  );
};

export default Assignment;
