import 'braft-editor/dist/index.css';
import React, { PureComponent } from 'react';
import BraftEditor from 'braft-editor';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Form, Input, Select, Button, Card, Radio, DatePicker, Checkbox, Row, Col } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(({ user, loading }) => ({
  currentUser: user.currentUser || '',
  submitting: loading.effects['inout/submitRegularForm'],
}))
@Form.create()
class CreateInout extends PureComponent {
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'inout/submitRegularForm',
          payload: {
            ...values,
            remark: !_.isEmpty(values.remark) ? values.remark.toHTML() : '',
          },
        });

        const demoEmail = form.getFieldValue('demoEmail');

        if (!_.isEmpty(demoEmail)) {
          dispatch({
            type: 'inout/submitInoutEmail',
            payload: {
              demoEmail: values.demoEmail,
              values,
              remark: !_.isEmpty(values.remark) ? values.remark.toHTML() : '',
            },
          });
        }

        form.resetFields();
        setTimeout(() => {
          form.setFieldsValue({
            remark: BraftEditor.createEditorState(''),
          });
        }, 500);
      } else {
        console.log(err);
      }
    });
  };

  handleReset = () => {
    const { form } = this.props;
    form.resetFields();
  };

  disabledDate = current => {
    const { currentUser } = this.props;
    if (currentUser.role === 'Admin') {
      return false;
    }
    // Can not select days before today
    return current < moment().startOf('day');
  };

  onCheckboxChange = (checkedValues) => {
    console.log('checked = ', checkedValues)
  }

  render() {
    const { submitting, currentUser } = this.props;
    const {
      form: { getFieldDecorator, getFieldValue },
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

    const getTypeValue = getFieldValue('type') || []

    console.log(`getTypeValue===`,getTypeValue);

    return (
      <PageHeaderWrapper title={<FormattedMessage id="app.notice.create.inout.form.title" />}>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="Staff">
              {getFieldDecorator('staff', {
                initialValue: currentUser.name,
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.title.required' }),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: 'form.title.placeholder' })} />)}
            </FormItem>

            <FormItem {...formItemLayout} label={<FormattedMessage id="form.date.label" />}>
              {getFieldDecorator('inout', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.date.required' }),
                  },
                ],
              })(
                <RangePicker
                  style={{ width: '100%' }}
                  disabledDate={this.disabledDate}
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                  placeholder={['Start Time', 'End Time']}
                />
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="Email">
              {getFieldDecorator('demoEmail', {
                rules: [
                  {
                    type: 'email',
                    message: 'email wrong format',
                  },
                ],
                validateTrigger: 'onBlur',
              })(<Input placeholder="測試接收email的電郵" style={{ width: 300 }} />)}
            </FormItem>

            {/* <FormItem {...formItemLayout} label="Type">
              <div>
                {getFieldDecorator('type', {
                  initialValue: 'Annual Leave',
                })(
                  <Radio.Group>
                    <Radio value="Annual Leave">Annual Leave</Radio>
                    <Radio value="Sick Leave">Sick Leave</Radio>
                    <Radio value="Travel">Travel</Radio>
                    <Radio value="Others">Others</Radio>
                  </Radio.Group>
                )}
              </div>
            </FormItem> */}

            <FormItem {...formItemLayout} label="Type">
              <div>
                {getFieldDecorator('type',{
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(
                  <Checkbox.Group style={{ width: '100%' }} onChange={this.onCheckboxChange}>
                    <Row>
                      <Col span={8}>
                        <Checkbox value="Annual Leave">Annual Leave</Checkbox>
                      </Col>
                      <Col span={8}>
                        <Checkbox value="Sick Leave">Sick Leave</Checkbox>
                      </Col>
                      <Col span={8}>
                        <Checkbox value="Travel">Travel</Checkbox>
                      </Col>
                      <Col span={8}>
                        <Checkbox value="Others">Others</Checkbox>
                      </Col>
                    </Row>
                  </Checkbox.Group>
                )}
              </div>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="Remark"
              style={{ display: getTypeValue.indexOf('Others') === -1 ? 'none' : 'block' }}
            >
              {getFieldDecorator('remark')(
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

            <FormItem
              {...formItemLayout}
              style={{ display: 'none' }}
              label={<FormattedMessage id="form.public.label" />}
              help={<FormattedMessage id="form.public.label2.help" />}
            >
              <div>
                {getFieldDecorator('public', {
                  initialValue: '1',
                })(
                  <Radio.Group>
                    <Radio value="1">
                      <FormattedMessage id="form.public.radio.public" />
                    </Radio>
                    <Radio value="2">
                      <FormattedMessage id="form.public.radio.partially-public" />
                    </Radio>
                  </Radio.Group>
                )}
                <FormItem style={{ marginBottom: 0 }}>
                  {getFieldDecorator('publicUsers')(
                    <Select
                      mode="multiple"
                      placeholder={formatMessage({ id: 'form.publicUsers.placeholder' })}
                      style={{
                        margin: '8px 0',
                        display: getFieldValue('public') === '2' ? 'block' : 'none',
                      }}
                    >
                      <Option value="1">
                        <FormattedMessage id="form.publicUsers.option.hk" />
                      </Option>
                      <Option value="2">
                        <FormattedMessage id="form.publicUsers.option.cn" />
                      </Option>
                      <Option value="3">
                        <FormattedMessage id="form.publicUsers.option.my" />
                      </Option>
                    </Select>
                  )}
                </FormItem>
              </div>
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

export default CreateInout;
