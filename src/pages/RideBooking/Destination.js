import 'braft-editor/dist/index.css';
import React, { PureComponent } from 'react';
import BraftEditor from 'braft-editor';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Form, Input, Button, Card } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const FormItem = Form.Item;

@connect(({ user, loading }) => ({
  submitting: loading.effects['ridebooking/submitRegularForm'],
  currentUser: user.currentUser || '',
}))
@Form.create()
class Destination extends PureComponent {
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
          type: 'ridebooking/submitDestinationForm',
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
    const { submitting } = this.props;
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

    return (
      <PageHeaderWrapper title="Destination">
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="Name">
              {getFieldDecorator('name')(<Input placeholder="" />)}
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

export default Destination;
