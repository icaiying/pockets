import React, { PureComponent } from 'react'
import { Layout, Table, Input } from 'antd';
import axios from 'axios';

const { Header, Footer, Sider, Content } = Layout;
const Search = Input.Search;

const columns = [{
  width: 100,
  title: '收录时间',
  dataIndex: 'time_added',
  render: (text, record) => (record.created_at)
}, {
  title: '标题',
  dataIndex: 'given_title',
  render: (text, record) => (<a href={record.given_url} target="_blank">{text}</a>)
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
    let url = `http://localhost:9000/pocket`;
    if (params.search) {
        url = `${url}?search=${params.search}`;
    }
    axios.get(url).then((res) => {
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
      <Layout>
        <Content>
            <div style={{ background: '#fff', padding: 8}}>
                <Search
                    placeholder="搜索文章标题"
                    onSearch={value => {
                        this.fetch({'search': value});
                    }}
                />
            </div>
            <div style={{ background: '#fff', padding: 8, minHeight: 280 }}>
            <Table columns={columns}
                rowKey={record => record.sort_id}
                dataSource={this.state.data}
                pagination={this.state.pagination}
                loading={this.state.loading}
                onChange={this.handleTableChange}
                size="small"
                />
            </div>
        </Content>
       </Layout>
    );
  }
}