/* eslint-disable react/no-danger */
/* eslint-disable no-underscore-dangle */
import React, { PureComponent, Fragment } from 'react';
import { Table, Alert } from 'antd';
import _ from 'lodash';
import { connect } from 'dva';
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

@connect(({ user }) => ({
  userRole: user.currentUser.role,
}))
class StandardTable extends PureComponent {
  constructor(props) {
    super(props);
    const { columns } = props;
    const needTotalList = initTotalList(columns);
    this.state = {
      needTotalList,
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
    const { passenger, guest, remark, driver, plate, orderBy } = record;
    return (
      <div>
        orderBy: {!_.isEmpty(orderBy) ? <b>{orderBy}</b> : '-'}
        <br />
        Passengers: {!_.isEmpty(passenger) ? passenger.map(d => <b key={d}>{d}, </b>) : '-'}
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
    const { passenger, guest, numberOfGuest, remark } = record;
    if (_.size(passenger) > 1 || _.size(guest) > 1 || numberOfGuest !== 0 || remark !== '<p></p>') {
      return true;
    }
    return false;
  };

  render() {
    const { selectedRowKeys, needTotalList } = this.state;
    const { data = {}, rowKey, userRole, ...rest } = this.props;
    const { list = [] } = data;

    // rowSelection objects indicates the need for row selection
    const rowSelection = {
      // eslint-disable-next-line no-shadow
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      onSelect: (record, selected, selectedRows) => {
        console.log(record, selected, selectedRows);
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        console.log(selected, selectedRows, changeRows);
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
        <Table
          rowKey="_id"
          expandedRowRender={record => this.renderExtraInfo(record)}
          rowSelection={userRole === 'Admin' ? rowSelection : false}
          dataSource={list}
          rowClassName={record => (this.renderPlusIcon(record) ? '' : 'hide')}
          pagination={false}
          onChange={this.handleTableChange}
          {...rest}
        />
      </div>
    );
  }
}

export default StandardTable;
