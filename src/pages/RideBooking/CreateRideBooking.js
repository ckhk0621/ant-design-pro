import 'braft-editor/dist/index.css';
import React, { PureComponent } from 'react';
import BraftEditor from 'braft-editor';
import { connect } from 'dva';
import { FormattedMessage } from 'umi/locale';
import { Form, Input, Select, Button, Card, Radio, DatePicker } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ user, ridebooking, loading }) => ({
  submitting: loading.effects['ridebooking/submitRegularForm'],
  currentUser: user.currentUser || '',
  destination: ridebooking.destination.data,
  location: ridebooking.location.data,
}))
@Form.create()
class CreateRideBooking extends PureComponent {
  componentDidMount() {
    // 异步设置编辑器内容
    setTimeout(() => {
      const { form } = this.props;
      form.setFieldsValue({
        remark: BraftEditor.createEditorState(''),
      });
    }, 500);
  }

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'ridebooking/submitRegularForm',
          payload: {
            ...values,
            remark: values.remark.toHTML(),
          },
        });
        form.resetFields();
        setTimeout(() => {
          form.setFieldsValue({
            remark: BraftEditor.createEditorState(''),
          });
        }, 500);
      }
    });
  };

  handleReset = () => {
    const { form } = this.props;
    form.resetFields();
  };

  render() {
    const { submitting, currentUser, destination, location } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;
    const controls = [
      'bold',
      'italic',
      'underline',
      'text-color',
      'separator',
      'link',
      'separator',
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

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    // const passengerOptions = [];
    // passengerOptions.push(<Option key={currentUser.name}>{currentUser.name}</Option>);
    // for (let i = 10; i < 36; i + 1) {
    //   passengerOptions.push(<Option key={i.toString(36) + i}>Staff {i}</Option>);
    // }

    // const guestOptions = [];
    // for (let i = 1; i < 12; i + 1) {
    //   guestOptions.push(<Option key={i.toString(36) + i}>{i}</Option>);
    // }

    return (
      <PageHeaderWrapper
        title={<FormattedMessage id="app.notice.create.ride.booking.title" />}
        content={<FormattedMessage id="app.notice.create.ride.booking.description" />}
      >
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="orderBy" style={{ display: 'none' }}>
              {getFieldDecorator('orderBy', {
                initialValue: currentUser.name,
              })(<Input />)}
            </FormItem>

            <FormItem {...formItemLayout} label="Passengers">
              {getFieldDecorator('passenger', {
                initialValue: [currentUser.name],
              })(
                <Select mode="multiple" placeholder="Please select">
                  {/* {passengerOptions} */}
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
                  {location.list.map(d => (
                    // eslint-disable-next-line no-underscore-dangle
                    <Option key={d._id} value={d.name}>
                      {d.name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="Destination">
              {getFieldDecorator('targetLocation', {
                rules: [
                  {
                    required: true,
                    message: 'Plese select location',
                  },
                ],
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
                initialValue: 0,
              })(
                <Select placeholder="Please select">
                  <Option key={0} value={0}>
                    0
                  </Option>
                  <Option key={1} value={1}>
                    1
                  </Option>
                  <Option key={2} value={2}>
                    2
                  </Option>
                  <Option key={3} value={3}>
                    3
                  </Option>
                  <Option key={4} value={4}>
                    4
                  </Option>
                  <Option key={5} value={5}>
                    5
                  </Option>
                  <Option key={6} value={6}>
                    6
                  </Option>
                  <Option key={7} value={7}>
                    7
                  </Option>
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

            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button onClick={() => this.handleReset()}>
                <FormattedMessage id="form.reset" />
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                style={{ marginLeft: 8 }}
              >
                <FormattedMessage id="form.submit" />
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default CreateRideBooking;
