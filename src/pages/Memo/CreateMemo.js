import 'braft-editor/dist/index.css';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Form, Input, Button, Card } from 'antd';
import _ from 'lodash';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import UploadImage from '@/components/UploadImage';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ memo, loading }) => ({
  submitting: loading.effects['memo/submitRegularForm'],
  images: memo.images,
}))
@Form.create()
class CreateMemo extends PureComponent {
  handleSubmit = e => {
    const { dispatch, form, images } = this.props;
    let submitValues;
    let submitImages;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!_.isEmpty(images)) {
        submitImages = (_.toArray(images) || []).map(d => ({
          name: d.name,
          thumbUrl: d.thumbUrl,
          type: d.type,
          uid: d.uid,
        }));
      }

      submitValues = {
        ...values,
        images: submitImages,
      };

      if (!err) {
        dispatch({
          type: 'memo/submitRegularForm',
          payload: submitValues,
        });
        form.resetFields();
      } else {
        console.log(err);
      }
    });
  };

  handleReset = () => {
    const { form } = this.props;
    form.resetFields();
  };

  render() {
    const { submitting } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;

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

    return (
      <PageHeaderWrapper
        title={<FormattedMessage id="app.notice.create.memo.form.title" />}
        content={<FormattedMessage id="app.notice.create.memo.form.description" />}
      >
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label={<FormattedMessage id="form.title.label" />}>
              {getFieldDecorator('title', {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.title.required' }),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: 'form.title.placeholder' })} />)}
            </FormItem>

            <FormItem {...formItemLayout} label={<FormattedMessage id="form.goal.content" />}>
              {getFieldDecorator('content', {
                validateTrigger: 'onBlur',
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<TextArea rows={4} maxLength={100} placeholder="" />)}
            </FormItem>

            <FormItem {...formItemLayout} label={<FormattedMessage id="form.images.label" />}>
              {getFieldDecorator('images', {
                rules: [],
              })(<UploadImage direction="memo" />)}
            </FormItem>

            {/* <FormItem {...formItemLayout} label={<FormattedMessage id="form.priority.label" />}>
              <div>
                {getFieldDecorator('priority', {
                  initialValue: '3',
                })(
                  <Radio.Group>
                    <Radio value="1">High</Radio>
                    <Radio value="2">Medium</Radio>
                    <Radio value="3">Low</Radio>
                  </Radio.Group>
                )}
              </div>
            </FormItem> */}

            {/* <FormItem
              {...formItemLayout}
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
                    </Select>
                  )}
                </FormItem>
              </div>
            </FormItem> */}
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

export default CreateMemo;
