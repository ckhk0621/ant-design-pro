import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import BraftEditor from 'braft-editor';
import { formatMessage } from 'umi/locale';
import { Card, Input, Button, Modal, Form, DatePicker, Select, Radio } from 'antd';
import RideBookingStandardTable from '@/components/RideBookingStandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Result from '@/components/Result';
import styles from './TableList.less';

const { Option } = Select;

const FormItem = Form.Item;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
/* eslint react/no-multi-comp:0 */
@connect(({ ridebooking, loading }) => ({
  ridebooking,
  loading: loading.models.inout,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
    visible: false,
    done: false,
  };

  columns = [
    {
      title: 'Passenger',
      dataIndex: 'passenger',
    },
    {
      title: 'Pickup',
      dataIndex: 'pickupLocation',
    },
    {
      title: 'Target',
      dataIndex: 'targetLocation',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      render: val => moment(val).format('YYYY-MM-DD'),
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
      title: 'Remark',
      dataIndex: 'remark',
      render: val => <span dangerouslySetInnerHTML={{ __html: val }} />,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: val =>
        val === 'Pending' ? (
          <span style={{ color: 'orange' }}>{val}</span>
        ) : (
          <span style={{ color: 'orange' }}>{val}</span>
        ),
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
        type: 'notice/update',
        payload: { id, ...fieldsValue, content: fieldsValue.content.toHTML() },
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
      ridebooking: { data },
      loading,
      form: { getFieldDecorator },
    } = this.props;
    const { selectedRows, visible, done } = this.state;

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

    const locationOptions = ['MK', 'NT'];

    const modalFooter = done
      ? { footer: null, onCancel: this.handleDone }
      : { okText: 'Update', onOk: this.handleSubmit, onCancel: this.handleCancel };

    const getModalContent = () => {
      if (done) {
        return (
          <Result
            type="success"
            title="Notice updated"
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

      return (
        <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
          <FormItem {...formItemLayout} label="Passengers">
            {getFieldDecorator('passenger', {
              rules: [
                {
                  required: true,
                  message: 'Plese select passenger',
                },
              ],
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
            })(
              <Select placeholder="Please select">
                {locationOptions.map(d => (
                  <Option key={d} value={d}>
                    {d}
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
            })(
              <Select placeholder="Please select">
                {locationOptions.map(d => (
                  <Option key={d} value={d}>
                    {d}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="Date" {...this.formLayout}>
            {getFieldDecorator('date', {
              rules: [{ required: true, message: 'Please select time' }],
            })(<DatePicker placeholder="Select" format="YYYY-MM-DD" style={{ width: '100%' }} />)}
          </FormItem>

          <FormItem {...formItemLayout} label="Return">
            {getFieldDecorator('return', {
              rules: [],
              initialValue: 'one way',
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
            })(
              <Select placeholder="Please select">
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

          <FormItem {...formItemLayout} label="Remark">
            {getFieldDecorator('remark', {
              validateTrigger: 'onBlur',
            })(
              <BraftEditor
                className="my-editor"
                controls={controls}
                placeholder={formatMessage({ id: 'form.content.placeholder' })}
                contentStyle={{
                  height: 210,
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

          <FormItem {...formItemLayout} label="Status">
            {getFieldDecorator('status', {
              rules: [
                {
                  required: true,
                  message: 'status',
                },
              ],
            })(
              <Select placeholder="Please select">
                {/* {passengerOptions} */}
                <Option key={1} value="Staff01">
                  Pending
                </Option>
                <Option key={2} value="Staff02">
                  Confirm
                </Option>
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="Car Plate">
            {getFieldDecorator('plate', {
              rules: [
                {
                  required: true,
                  message: 'status',
                },
              ],
            })(
              <Select placeholder="Please select">
                {/* {passengerOptions} */}
                <Option key={1} value="Staff01">
                  Pending
                </Option>
                <Option key={2} value="Staff02">
                  Confirm
                </Option>
              </Select>
            )}
          </FormItem>
        </Form>
      );
    };

    return (
      <PageHeaderWrapper title="Ride Booking records">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => router.push('/ride-booking/add')}>
                Add Record
              </Button>
            </div>
            <RideBookingStandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
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
