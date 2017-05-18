import React, { PureComponent } from 'react'
import { Table, Input } from 'antd';
import axios from 'axios';

const Search = Input.Search;

const columns = [{
  width: 80,
  title: '编号',
  dataIndex: 'sort_id',
  sorter: true,
}, {
  width: 120,
  title: '收录时间',
  dataIndex: 'time_added',
  render: (text, record) => (record.created_at)
}, {
  title: '标题',
  dataIndex: 'resolved_title',
  render: (text, record) => (<a href={record.resolved_url} target="_blank">{text}</a>)
}];

export default class PocketsTable extends React.Component {
  state = {
    data: [],
    pagination: {
        pageSize: 100
    },
    loading: false,
  };
  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.fetch({
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
    });
  }
  fetch = (params = {}) => {
    console.log('params:', params);
    this.setState({ loading: true });
    axios.get(`http://localhost:9000/pocket`).then((res) => {
      const pagination = { ...this.state.pagination };
      // Read total count from server
      // pagination.total = data.totalCount;
      const data = res.data;
      pagination.total = data.length;
      this.setState({
        loading: false,
        data: data,
        pagination,
      });
    });
  }
  componentDidMount() {
    this.fetch();
  }
  render() {
    return (
        <Table columns={columns}
            rowKey={record => record.sort_id}
            dataSource={this.state.data}
            pagination={this.state.pagination}
            loading={this.state.loading}
            onChange={this.handleTableChange}
            />
    );
  }
}