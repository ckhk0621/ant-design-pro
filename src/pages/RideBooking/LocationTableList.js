import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import BraftEditor from 'braft-editor';
import { formatMessage } from 'umi/locale';
import { Card, Button, Modal, Form, Input } from 'antd';
import SimplyTable from '@/components/SimplyTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Result from '@/components/Result';
import styles from './TableList.less';

const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@connect(({ ridebooking, loading }) => ({
  location: ridebooking.location,
  loading: loading.models.ridebooking,
}))
@Form.create()
class LocationTableList extends PureComponent {
  state = {
    selectedRows: [],
    visible: false,
    done: false,
  };

  columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Remark',
      dataIndex: 'remark',
      // eslint-disable-next-line react/no-danger
      render: val => <span dangerouslySetInnerHTML={{ __html: val }} />,
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
      type: 'ridebooking/fetchLocation',
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
    console.log(`record----`, item);
    setTimeout(() => {
      const { form } = this.props;
      form.setFieldsValue({
        remark: BraftEditor.createEditorState(item.remark),
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
        type: 'ridebooking/updateLocation',
        payload: { id, ...fieldsValue, remark: fieldsValue.remark.toHTML() },
      });
    });
  };

  deleteItem = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ridebooking/deleteLocation',
      payload: { id },
    });
  };

  render() {
    const {
      location: { data },
      loading,
      form: { getFieldDecorator },
    } = this.props;
    const { selectedRows, visible, done, current = {} } = this.state;

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
            title="Location updated"
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
          <FormItem {...formItemLayout} label="Name">
            {getFieldDecorator('name', {
              initialValue: current.name,
              rules: [
                {
                  required: true,
                  message: 'Plese input name',
                },
              ],
            })(<Input placeholder="" />)}
          </FormItem>

          <FormItem {...formItemLayout} label="Remark">
            {getFieldDecorator('remark', {
              initialValue: current.remark,
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
        </Form>
      );
    };

    return (
      <PageHeaderWrapper title="Location">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button
                icon="plus"
                type="primary"
                onClick={() => router.push('/ride-booking/destination/create')}
              >
                Add Location
              </Button>
            </div>
            <SimplyTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
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

export default LocationTableList;
