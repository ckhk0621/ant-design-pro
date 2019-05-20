import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import BraftEditor from 'braft-editor';
import { Card, Input, Button, Modal, Form, DatePicker, Select, Radio } from 'antd';
import RideBookingStandardTable from '@/components/RideBookingStandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Result from '@/components/Result';
import styles from './TableList.less';

const { Option } = Select;

const FormItem = Form.Item;

// const getValue = obj =>
//   Object.keys(obj)
//     .map(key => obj[key])
//     .join(',');
/* eslint react/no-multi-comp:0 */
@connect(({ ridebooking, loading }) => ({
  ridebooking,
  loading: loading.models.inout,
  destination: ridebooking.destination.data,
  location: ridebooking.location.data,
  plate: ridebooking.plate.data,
  driver: ridebooking.driver.data,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    // formValues: {},
    visible: false,
    done: false,
    filteredInfo: null,
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
    // console.log('Various parameters', pagination, filters, sorter);
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  };

  // handleStandardTableChange = (pagination, filtersArg, sorter) => {
  //   const { dispatch } = this.props;
  //   const { formValues } = this.state;

  //   const filters = Object.keys(filtersArg).reduce((obj, key) => {
  //     const newObj = { ...obj };
  //     newObj[key] = getValue(filtersArg[key]);
  //     return newObj;
  //   }, {});

  //   const params = {
  //     currentPage: pagination.current,
  //     pageSize: pagination.pageSize,
  //     ...formValues,
  //     ...filters,
  //   };
  //   if (sorter.field) {
  //     params.sorter = `${sorter.field}_${sorter.order}`;
  //   }

  //   dispatch({
  //     type: 'rule/fetch',
  //     payload: params,
  //   });
  // };

  previewItem = id => {
    router.push(`/profile/basic/${id}`);
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    // this.setState({
    //   formValues: {},
    // });
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

  handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
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
      form: { getFieldDecorator },
    } = this.props;
    const { selectedRows, visible, done } = this.state;

    const columns = [
      {
        title: 'Order By',
        dataIndex: 'orderBy',
        filteredValue: filteredInfo.orderBy || null,
        sorter: (a, b) => (a.orderBy < b.orderBy ? -1 : 1),
        sortOrder: sortedInfo.columnKey === 'orderBy' && sortedInfo.order,
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
      },
      {
        title: 'Return',
        dataIndex: 'return',
      },
      {
        title: 'Guest No.',
        dataIndex: 'numberOfGuest',
      },
      {
        title: 'Plate',
        dataIndex: 'plate',
      },
      // {
      //   title: 'Remark',
      //   dataIndex: 'remark',
      //   render: val => <span dangerouslySetInnerHTML={{ __html: val }} />,
      // },
      {
        title: 'Status',
        dataIndex: 'status',
        render: (val, row) => {
          if (moment(row.date, 'YYYY-MM-DD').isBefore(moment(new Date(), 'YYYY-MM-DD'))) {
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
        render: (text, record) => (
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
                <Option key={1} value="Staff01">
                  Staff01
                </Option>
                <Option key={2} value="Staff02">
                  Staff02
                </Option>
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="Pickup Location">
            {getFieldDecorator('pickupLocation', {
              rules: [
                {
                  required: true,
                  message: 'Plese select location',
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
                  message: 'Plese select location',
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

    return (
      <PageHeaderWrapper title="Booking records">
        <Card bordered={false}>
          <div className={styles.tableList}>
            {/* <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => router.push('/ride-booking/add')}>
                Add Record
              </Button>
            </div> */}
            <div className="table-operations">
              {/* <Button onClick={this.setOrderNameSort}>Sort Order Name</Button> &nbsp; */}
              {/* <Button onClick={this.clearFilters}>Clear filters</Button> */}
              <Button onClick={this.clearAll}>Clear Sorters</Button>
            </div>
            <RideBookingStandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleChange}
            />
          </div>
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
