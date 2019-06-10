import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import BraftEditor from 'braft-editor';
import { Card, Input, Button, Modal, Form, DatePicker, Select, Radio, Alert } from 'antd';
import RideBookingStandardTable from '@/components/RideBookingStandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Result from '@/components/Result';
import _ from 'lodash';
import styles from './TableList.less';

const { Option } = Select;

const FormItem = Form.Item;

@connect(({ ridebooking, loading, user }) => ({
  ridebooking,
  loading: loading.models.inout,
  destination: ridebooking.destination.data,
  location: ridebooking.location.data,
  plate: ridebooking.plate.data,
  allUser: user.allUser,
  driver: ridebooking.driver.data,
  userRole: user.currentUser.role,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    visible: false,
    done: false,
    filteredInfo: {
      date: [
        // moment().format('YYYY-MM-DD'),
        // moment()
        //   .add(1, 'days')
        //   .format('YYYY-MM-DD'),
      ],
    },
    sortedInfo: null,
    current: {
      date: null,
      status: null,
      guest: null,
      numberOfGuest: null,
      orderBy: null,
      passenger: [],
      pickupLocation: null,
      remark: null,
      return: null,
      targetLocation: null,
    },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'ridebooking/fetch',
    });
    dispatch({
      type: 'user/queryAllUser',
    });
  }

  showModal = () => {
    this.setState({
      visible: true,
      current: undefined,
    });
  };

  showEditModal = item => {
    this.setState({
      visible: true,
      current: item,
    });
    setTimeout(() => {
      const { form } = this.props;
      form.setFieldsValue({
        remark: BraftEditor.createEditorState(item.content),
      });
    }, 300);
  };

  handleDone = () => {
    this.setState({
      done: false,
      visible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { current } = this.state;
    /* eslint-disable */
    const id = current ? current._id : '';
    /* eslint-enable */
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        done: true,
      });

      dispatch({
        type: 'ridebooking/update',
        payload: {
          id,
          ...fieldsValue,
          content: fieldsValue.remark.toHTML(),
          remark: fieldsValue.remark.toHTML(),
        },
      });
    });
  };

  deleteItem = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ridebooking/delete',
      payload: { id },
    });
  };

  handleChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  };

  previewItem = id => {
    router.push(`/profile/basic/${id}`);
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
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

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  clearFilters = () => {
    this.setState({ filteredInfo: null });
  };

  clearAll = () => {
    this.setState({
      filteredInfo: null,
      sortedInfo: null,
    });
  };

  setOrderNameSort = () => {
    this.setState({
      sortedInfo: {
        order: 'descend',
        columnKey: 'orderBy',
      },
    });
  };

  render() {
    let { sortedInfo, filteredInfo } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    const {
      ridebooking: { data },
      loading,
      userRole,
      form: { getFieldDecorator },
      allUser,
    } = this.props;
    const { selectedRows, visible, done } = this.state;
    const filterOptions = data.list.map(d => {
      const date = moment(d.date).format('YYYY-MM-DD');
      return {
        // eslint-disable-next-line no-underscore-dangle
        id: d._id,
        text: date,
        value: date,
        total: d.passenger.length + d.numberOfGuest,
      };
    });

    const uniqFilterOptions = _.uniqBy(filterOptions, 'value');
    // eslint-disable-next-line consistent-return,func-names
    const selectedDateAllObject = _.map(filterOptions, function(obj) {
      if (filteredInfo.date.indexOf(obj.value) !== -1) {
        return obj;
      }
    });

    const columns = [
      // {
      //   title: 'Order',
      //   dataIndex: 'orderBy',
      //   filteredValue: filteredInfo.orderBy || null,
      //   sorter: (a, b) => (a.orderBy < b.orderBy ? -1 : 1),
      //   sortOrder: sortedInfo.columnKey === 'orderBy' && sortedInfo.order,
      // },
      {
        title: 'Passengers',
        dataIndex: 'passenger',
        render: val => (_.isEmpty(val) ? '--' : val.map(v => <span>{v}, </span>)),
      },
      {
        title: 'Pickup',
        dataIndex: 'pickupLocation',
      },
      {
        title: 'Destination',
        dataIndex: 'targetLocation',
      },
      {
        title: 'Date',
        dataIndex: 'date',
        render: val => moment(val).format('YYYY-MM-DD'),
        filteredValue: filteredInfo.date || null,
        sorter: (a, b) => (a.date < b.date ? -1 : 1),
        sortOrder: sortedInfo.columnKey === 'date' && sortedInfo.order,
        filters: uniqFilterOptions,
        onFilter: (value, record) => moment(record.date).format('YYYY-MM-DD') === value,
      },
      {
        title: 'Return',
        dataIndex: 'return',
      },
      {
        title: 'Guest',
        dataIndex: 'numberOfGuest',
      },
      // {
      //   title: 'Passenger',
      //   dataIndex: 'passenger',
      //   render: val => val.length,
      // },
      {
        title: 'Driver',
        dataIndex: 'driver',
      },
      {
        title: 'Car Plate',
        dataIndex: 'plate',
      },
      {
        title: 'Remark',
        dataIndex: 'remark',
        // eslint-disable-next-line react/no-danger
        render: val => <span dangerouslySetInnerHTML={{ __html: val }} />,
      },
      {
        title: 'Status',
        dataIndex: 'status',
        render: (val, row) => {
          if (val === 'Confirm' && moment(row.date).isBefore(moment())) {
            return (
              <span style={{ color: 'red' }}>
                <b>Complete</b>
              </span>
            );
          }
          if (val === 'Pending') {
            return (
              <span style={{ color: 'orange' }}>
                <b>{val}</b>
              </span>
            );
          }
          return (
            <span style={{ color: 'green' }}>
              <b>{val}</b>
            </span>
          );
        },
      },
      {
        title: 'Action',
        render: (text, record) =>
          userRole === 'Admin' && (
            <Fragment>
              <a onClick={() => this.showEditModal(record)}>Edit </a>
              &nbsp;|&nbsp;
              <a
                style={{ color: 'red' }}
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

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const modalFooter = done
      ? { footer: null, onCancel: this.handleDone }
      : { okText: 'Update', onOk: this.handleSubmit, onCancel: this.handleCancel };

    const getModalContent = () => {
      if (done) {
        return (
          <Result
            type="success"
            title="Detail updated"
            description=""
            actions={
              <Button type="primary" onClick={this.handleDone}>
                OK
              </Button>
            }
            className={styles.formResult}
          />
        );
      }
      const controls = ['bold', 'italic', 'underline', 'text-color'];
      const { destination, location, plate, driver } = this.props;
      const { current } = this.state;
      // let time = moment(current.date, 'YYYY-MM-DD')
      return (
        <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
          <FormItem {...formItemLayout} label="Passengers">
            {getFieldDecorator('passenger', {
              initialValue: current.passenger,
            })(
              <Select mode="multiple" placeholder="Please select">
                {allUser.map(item => {
                  return (
                    // eslint-disable-next-line no-underscore-dangle
                    <Option key={item._id} value={item.name}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="Pickup Location">
            {getFieldDecorator('pickupLocation', {
              rules: [
                {
                  required: true,
                  message: 'Please select location',
                },
              ],
              initialValue: current.pickupLocation,
            })(
              <Select placeholder="Please select">
                {location.list.map(d => (
                  // eslint-disable-next-line no-underscore-dangle
                  <Option key={d._id} value={d.name}>
                    {d.name}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="Target Location">
            {getFieldDecorator('targetLocation', {
              rules: [
                {
                  required: true,
                  message: 'Please select location',
                },
              ],
              initialValue: current.targetLocation,
            })(
              <Select placeholder="Please select">
                {destination.list.map(d => (
                  // eslint-disable-next-line no-underscore-dangle
                  <Option key={d._id} value={d.name}>
                    {d.name}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="Date" {...this.formLayout}>
            {getFieldDecorator('date', {
              rules: [{ required: true, message: 'Please select time' }],
              initialValue: moment(current.date, 'YYYY-MM-DD'),
            })(<DatePicker placeholder="Select" format="YYYY-MM-DD" style={{ width: '100%' }} />)}
          </FormItem>

          <FormItem {...formItemLayout} label="Return">
            {getFieldDecorator('return', {
              rules: [],
              initialValue: current.return,
            })(
              <Radio.Group>
                <Radio value="one way">One way</Radio>
                <Radio value="return">Return</Radio>
              </Radio.Group>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="Number of guest">
            {getFieldDecorator('numberOfGuest', {
              rules: [],
              initialValue: current.numberOfGuest,
            })(
              <Select placeholder="Please select">
                <Option key={0}>0</Option>
                <Option key={1}>1</Option>
                <Option key={2}>2</Option>
                <Option key={3}>3</Option>
                <Option key={4}>4</Option>
                <Option key={5}>5</Option>
                <Option key={6}>6</Option>
                <Option key={7}>7</Option>
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="Guest">
            {getFieldDecorator('guest')(<Input placeholder="Name 01, Name 02, ...etc" />)}
          </FormItem>

          <FormItem {...formItemLayout} label="Status">
            {getFieldDecorator('status', {
              rules: [
                {
                  required: true,
                  message: 'status',
                },
              ],
              initialValue: current.status,
            })(
              <Select placeholder="Please select">
                {/* {passengerOptions} */}
                <Option key={1} value="Pending">
                  Pending
                </Option>
                <Option key={2} value="Confirm">
                  Confirm
                </Option>
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="Driver">
            {getFieldDecorator('driver', {
              initialValue: current.driver,
            })(
              <Select placeholder="Please select">
                {driver.list.map(d => (
                  // eslint-disable-next-line no-underscore-dangle
                  <Option key={d._id} value={d.name}>
                    {d.name}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="Car Plate">
            {getFieldDecorator('plate', {
              initialValue: current.plate,
            })(
              <Select placeholder="Please select">
                {plate.list.map(d => (
                  // eslint-disable-next-line no-underscore-dangle
                  <Option key={d._id} value={d.name}>
                    {d.name}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="Remark">
            {getFieldDecorator('remark', {
              validateTrigger: 'onBlur',
            })(
              <BraftEditor
                className="my-editor"
                controls={controls}
                contentStyle={{
                  height: 100,
                  borderWidth: 1,
                  borderColor: '#d9d9d9',
                  borderStyle: 'solid',
                  borderRadius: 4,
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                  borderTop: 'none',
                }}
              />
            )}
          </FormItem>
        </Form>
      );
    };
    const selectedDate = filteredInfo.date;
    const renderTotalObj = _.without(selectedDateAllObject, undefined);
    const totalPassengers = data.list.reduce(
      (result, { passenger, numberOfGuest }) => result + passenger.length + numberOfGuest,
      0
    );
    const filteredPassengers = renderTotalObj.reduce((result, { total }) => result + total, 0);
    console.log(`DATA====`, data.list);
    console.log(`DATA====`, renderTotalObj);
    console.log(`totalPassengers=====`, totalPassengers);
    return (
      <PageHeaderWrapper title="Booking records">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableAlert}>
              <Alert
                message={
                  <Fragment>
                    <b>Total Passagners:</b> {totalPassengers}
                    <br />
                    <b style={{ lineHeight: 2 }}>Filtered Date:</b>
                    <a style={{ fontWeight: 600 }}>
                      {!_.isEmpty(selectedDate) ? selectedDate.map(d => ` ${d}, `) : ' - '}
                    </a>
                    <br />
                    {/* eslint-disable-next-line no-return-assign */}
                    <span style={{ marginLeft: 0 }}>
                      <b>Filtered Passagners:</b> &nbsp;{filteredPassengers}
                    </span>
                  </Fragment>
                }
                type="info"
                showIcon
              />
            </div>
            <br />
            <RideBookingStandardTable
              rowKey="_id"
              bordered
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleChange}
            />
          </div>

          {userRole === 'Admin' && (
            <div style={{ textAlign: 'right', paddingTop: 15 }}>
              <Button type="primary" htmlType="submit" align="right" disabled>
                Email
              </Button>
            </div>
          )}
        </Card>
        <Modal
          className={styles.standardListForm}
          width={640}
          bodyStyle={done ? { padding: '72px 0' } : { padding: '28px 0 0' }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          {getModalContent()}
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
