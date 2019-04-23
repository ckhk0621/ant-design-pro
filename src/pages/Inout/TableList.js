import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { Card, Form, Button, Modal } from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './TableList.less';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
/* eslint react/no-multi-comp:0 */
@connect(({ inout, loading }) => ({
  inout,
  loading: loading.models.inout,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
  };

  columns = [
    {
      title: 'Staff',
      dataIndex: 'staff',
    },
    {
      title: 'Time',
      dataIndex: 'inout',
      sorter: true,
      render: val => (
        <div>
          {moment(val[0]).format('YYYY-MM-DD HH:mm')} - <br />{' '}
          {moment(val[1]).format('YYYY-MM-DD HH:mm')}
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
    },
    {
      title: 'Remark',
      dataIndex: 'remark',
      render: val => <span dangerouslySetInnerHTML={{ __html: val }} />,
    },
    {
      title: 'Added by',
      dataIndex: 'author',
    },
    {
      title: 'Action',
      render: (text, record) => (
        <Fragment>
          <a
            onClick={() =>
              Modal.confirm({
                title: 'Delete Record',
                content: 'Confirm to delete this record',
                okText: 'Confirm',
                cancelText: 'Cancel',
                /* eslint-disable */
                onOk: () => this.deleteItem(record._id),
                /* eslint-enable */
              })
            }
          >
            Delete
          </a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'inout/fetch',
    });
  }

  deleteItem = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'inout/delete',
      payload: { id },
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    // const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    // dispatch({
    //   type: 'rule/fetch',
    //   payload: params,
    // });
  };

  previewItem = id => {
    router.push(`/profile/basic/${id}`);
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'rule/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'rule/fetch',
        payload: values,
      });
    });
  };

  render() {
    const {
      inout: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;

    return (
      <PageHeaderWrapper title="In Out Records">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => router.push('/inout/add')}>
                Add Record
              </Button>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
