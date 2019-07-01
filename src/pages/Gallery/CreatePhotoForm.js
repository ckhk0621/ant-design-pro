import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { FormattedMessage } from 'umi/locale';
import { Form, Select, Button, Card } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import UploadImage from '@/components/UploadImage';
import _ from 'lodash';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ user, gallery, loading }) => ({
  list: gallery.list,
  images: gallery.images,
  submitting: loading.effects['gallery/submitPhotoForm'],
  currentUser: user.currentUser || '',
}))
@Form.create()
class CreatePhotoForm extends PureComponent {
  handleSubmit = e => {
    const { dispatch, form, images } = this.props;
    let submitValues;
    let submitImages;
    e.preventDefault();
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
          type: 'gallery/submitPhotoForm',
          payload: submitValues,
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
      <PageHeaderWrapper title="Add Photo">
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

            <FormItem {...formItemLayout} label={<FormattedMessage id="form.images.label" />}>
              {getFieldDecorator('images', {
                rules: [],
              })(<UploadImage direction="gallery" />)}
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
