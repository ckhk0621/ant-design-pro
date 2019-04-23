import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { FormattedMessage } from 'umi/locale';
import { Form, Select, Button, Card, Input } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ user, gallery, loading }) => ({
  list: gallery.list,
  submitting: loading.effects['gallery/submitPhotoForm'],
  currentUser: user.currentUser || '',
}))
@Form.create()
class CreatePhotoForm extends PureComponent {
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'gallery/submitPhotoForm',
          payload: {
            ...values,
          },
        });
        form.resetFields();
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

    const { list } = this.props;

    return (
      <PageHeaderWrapper title="Gallery">
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            {/* <FormItem {...formItemLayout} label="Title">
              {getFieldDecorator('title', {
                rules: [
                  { required: true, message: 'Please input title' },
                ],
              })(<Input placeholder="" />)}
            </FormItem> */}

            <FormItem {...formItemLayout} label="Gallery">
              {getFieldDecorator('gallery', {
                rules: [
                  {
                    required: true,
                    message: 'Plese select gallery',
                  },
                ],
              })(
                <Select placeholder="Please select">
                  {list.map(d => (
                    <Option key={d.title} value={d.title}>
                      {d.title}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="Title">
              {getFieldDecorator('title', {
                rules: [{ required: true, message: 'Please input title' }],
              })(<Input placeholder="" />)}
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

export default CreatePhotoForm;
