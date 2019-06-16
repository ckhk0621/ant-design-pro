/* eslint-disable react/no-danger */
/* eslint-disable no-underscore-dangle */
import React, { PureComponent, Fragment } from 'react';
import { Table, Alert, Button, Form, Switch, Input, Modal } from 'antd';
import _ from 'lodash';
import { connect } from 'dva';
import moment from 'moment';
import styles from './index.less';

function initTotalList(columns) {
  const totalList = [];
  columns.forEach(column => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}

const FormItem = Form.Item;

@connect(({ user, loading }) => ({
  userRole: user.currentUser.role,
  loading:
    loading.effects['ridebooking/fetch'] || loading.effects['ridebooking/fetchCompletedRecord'],
}))
@Form.create()
class StandardTable extends PureComponent {
  constructor(props) {
    super(props);
    const { columns } = props;
    const needTotalList = initTotalList(columns);
    this.state = {
      needTotalList,
      selectedRows: [],
      showCompleted: false,
      demoEmail: '',
      visible: false,
    };
  }

  static getDerivedStateFromProps(nextProps) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      const needTotalList = initTotalList(nextProps.columns);
      return {
        selectedRowKeys: [],
        needTotalList,
      };
    }
    return null;
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    let { needTotalList } = this.state;
    needTotalList = needTotalList.map(item => ({
      ...item,
      total: selectedRows.reduce((sum, val) => sum + parseFloat(val[item.dataIndex], 10), 0),
    }));
    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRows);
    }

    this.setState({ needTotalList });
  };

  handleTableChange = (pagination, filters, sorter) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(pagination, filters, sorter);
    }
  };

  renderExtraInfo = record => {
    const { passenger, guest, remark, driver, plate, orderBy, time } = record;
    return (
      <div>
        orderBy: {!_.isEmpty(orderBy) ? <b>{orderBy}</b> : '-'}
        <br />
        Passengers: {!_.isEmpty(passenger) ? passenger.map(d => <b key={d}>{d}, </b>) : '-'}
        <br />
        Pickup Time: {!_.isEmpty(time) ? <b>{moment(time).format('HH:mm a')}</b> : '-'}
        <br />
        Guest: {!_.isEmpty(guest) ? guest.map(d => <b key={d}>{d}, </b>) : '-'}
        <br />
        Driver: {!_.isEmpty(driver) ? <b>{driver}</b> : '-'}
        <br />
        Car Plate: {!_.isEmpty(plate) ? <b>{plate}</b> : '-'}
        <br />
        Remark: <span dangerouslySetInnerHTML={{ __html: remark }} />
      </div>
    );
  };

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  };

  renderPlusIcon = record => {
    const { passenger, guest, numberOfGuest, remark, status, date } = record;
    if (status === 'Confirm' && !moment(date).isAfter(moment())) {
      return 'hideSelect';
    }
    if (_.size(passenger) > 1 || _.size(guest) > 1 || numberOfGuest !== 0 || remark !== '<p></p>') {
      return null;
    }
    return 'hide';
  };

  sendEmail = () => {
    const { dispatch, form, setDateDefault } = this.props;
    const { selectedRows, demoEmail } = this.state;

    form.validateFields(err => {
      if (err) return;
      dispatch({
        type: 'ridebooking/submitEmail',
        payload: {
          demoEmail,
          selectedRows,
        },
      })
        .then(this.setState({ demoEmail: '', selectedRowKeys: [], selectedRows: [] }))
        .then(
          form.setFieldsValue({
            demoEmail: '',
          })
        )
        .then(dispatch({ type: 'ridebooking/fetch' }))
        .then(setDateDefault());
    });
  };

  handleDataChange = fetchCompleted => {
    const { dispatch, resetDateFilter, setDateDefault } = this.props;
    if (fetchCompleted) {
      dispatch({ type: 'ridebooking/fetchCompletedRecord' });
      resetDateFilter();
    } else {
      dispatch({ type: 'ridebooking/fetch' });
      setDateDefault();
    }
    this.setState({ showCompleted: fetchCompleted });
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const {
      selectedRowKeys,
      needTotalList,
      selectedRows,
      showCompleted,
      demoEmail,
      visible,
    } = this.state;
    const { data = {}, rowKey, userRole, loading, ...rest } = this.props;
    const { list = [] } = data;
    const dataSource = list.map(d => ({
      ...d,
      key: d._id,
    }));

    // rowSelection objects indicates the need for row selection
    const rowSelection = {
      // eslint-disable-next-line no-shadow
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      onSelect: (record, selected, selectedRowsData) => {
        console.log(`selectedRows=====`, selectedRows);
        console.log(record, selected, selectedRows);
        this.setState({ selectedRows: selectedRowsData });
      },
      onSelectAll: (selected, selectedRowsData, changeRows) => {
        console.log(selected, selectedRowsData, changeRows);
      },
    };

    return (
      <div className={styles.standardTable}>
        <div className={styles.tableAlert} style={{ display: 'none' }}>
          <Alert
            message={
              <Fragment>
                Selected <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a>
                {needTotalList.map(item => (
                  <span style={{ marginLeft: 8 }} key={item.dataIndex}>
                    {item.title}
                    Totals&nbsp;
                    <span style={{ fontWeight: 600 }}>
                      {item.render ? item.render(item.total) : item.total}
                    </span>
                  </span>
                ))}
                <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>
                  Clear
                </a>
              </Fragment>
            }
            type="info"
            showIcon
          />
        </div>
        <div
          className="components-table-demo-control-bar"
          style={{ paddingTop: 10, paddingBottom: 10 }}
        >
          <Form layout="inline">
            <FormItem label="Completed Records">
              <Switch checked={showCompleted} onChange={value => this.handleDataChange(value)} />
            </FormItem>
          </Form>
        </div>
        {!loading && (
          <Table
            rowKey={rowKey || '_id'}
            expandedRowRender={record => this.renderExtraInfo(record)}
            rowSelection={userRole === 'Admin' ? rowSelection : {}}
            dataSource={dataSource}
            rowClassName={record => this.renderPlusIcon(record)}
            pagination={false}
            onChange={this.handleTableChange}
            {...rest}
          />
        )}
        {userRole === 'Admin' && !showCompleted && (
          <div style={{ textAlign: 'right' }}>
            <Form layout="inline">
              <FormItem>
                {getFieldDecorator('demoEmail', {
                  rules: [
                    {
                      type: 'email',
                      message: 'email wrong format',
                    },
                  ],
                  validateTrigger: 'onBlur',
                })(
                  <Input
                    disabled={selectedRows.length === 0}
                    placeholder="測試接收email的電郵"
                    style={{ width: 300, marginTop: 15 }}
                    onChange={v => this.setState({ demoEmail: v.target.value })}
                  />
                )}
              </FormItem>
            </Form>

            <div style={{ textAlign: 'right', paddingTop: 15 }}>
              <Button
                type="primary"
                htmlType="submit"
                align="right"
                onClick={() => this.sendEmail()}
                disabled={selectedRows.length === 0 || _.isEmpty(demoEmail)}
              >
                Email
              </Button>
            </div>
          </div>
        )}
        <Modal
          title="Basic Modal"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
      </div>
    );
  }
}

export default StandardTable;
