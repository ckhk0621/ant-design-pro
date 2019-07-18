import 'braft-editor/dist/index.css';
import React, { PureComponent } from 'react';
import BraftEditor from 'braft-editor';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { NavLink, withRouter } from 'dva/router';
import moment from 'moment';
import _ from 'lodash';
import { connect } from 'dva';
import {
  List,
  Card,
  Input,
  Button,
  Icon,
  Dropdown,
  Menu,
  Avatar,
  Modal,
  Form,
  DatePicker,
} from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Result from '@/components/Result';
import styles from './BasicList.less';

const FormItem = Form.Item;

@connect(({ notice, user, loading }) => ({
  list: notice.list,
  loading: loading.models.list,
  role: user.currentUser.role,
}))
@Form.create()
class BasicList extends PureComponent {
  state = { visible: false, done: false };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'notice/fetch',
      payload: {
        count: 5,
      },
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
        content: BraftEditor.createEditorState(item.content),
      });
    }, 300);
  };

  handleDone = () => {
    // setTimeout(() => this.addBtn.blur(), 0);
    this.setState({
      done: false,
      visible: false,
    });
  };

  handleCancel = () => {
    // setTimeout(() => this.addBtn.blur(), 0);
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

    // setTimeout(() => this.addBtn.blur(), 0);
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
      type: 'notice/delete',
      payload: { id },
    });
  };

  render() {
    const { list, loading, role } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { visible, done, current = {} } = this.state;

    const editAndDelete = (key, currentItem) => {
      if (key === 'edit') this.showEditModal(currentItem);
      else if (key === 'delete') {
        Modal.confirm({
          title: 'Delete Notice',
          content: 'Confirm to delete this notice？',
          okText: 'Confirm',
          cancelText: 'Cancel',
          /* eslint-disable */
          onOk: () => this.deleteItem(currentItem._id),
          /* eslint-enable */
        });
      }
    };

    const modalFooter = done
      ? { footer: null, onCancel: this.handleDone }
      : { okText: 'Update', onOk: this.handleSubmit, onCancel: this.handleCancel };

    const ListContent = ({ data: { author } }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <p>{author}</p>
        </div>
      </div>
    );

    const MoreBtn = props => (
      <Dropdown
        overlay={
          <Menu onClick={({ key }) => editAndDelete(key, props.current)}>
            <Menu.Item key="edit">Edit</Menu.Item>
            <Menu.Item key="delete">Delete</Menu.Item>
          </Menu>
        }
      >
        <a>
          Action
          <Icon type="down" />
        </a>
      </Dropdown>
    );

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
      const controls = [
        'bold',
        'italic',
        'underline',
        'text-color',
        'separator',
        'link',
        'separator',
        'media',
      ];

      return (
        <Form onSubmit={this.handleSubmit}>
          <FormItem label="Title" {...this.formLayout}>
            {getFieldDecorator('title', {
              rules: [
                { required: true, message: formatMessage({ id: 'validation.title.required' }) },
              ],
              initialValue: current.title,
            })(<Input placeholder={formatMessage({ id: 'form.title.label' })} />)}
          </FormItem>
          <FormItem label="Update time" {...this.formLayout}>
            {getFieldDecorator('date', {
              rules: [{ required: true, message: 'Please select time' }],
              initialValue: current.date ? moment(current.date) : null,
            })(
              <DatePicker
                showTime
                placeholder="Select"
                format="YYYY-MM-DD HH:mm:ss"
                style={{ width: '100%' }}
              />
            )}
          </FormItem>

          <FormItem {...this.formLayout} label={<FormattedMessage id="form.goal.content" />}>
            {getFieldDecorator('content', {
              validateTrigger: 'onBlur',
              rules: [
                {
                  required: true,
                  /* eslint-disable */
                  validator: (_, value, callback) => {
                    /* eslint-enable */
                    if (value.isEmpty()) {
                      callback(formatMessage({ id: 'form.content.placeholder' }));
                    } else {
                      callback();
                    }
                  },
                },
              ],
              initialValue: current.content,
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
      <PageHeaderWrapper>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            title="Notices List"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
          >
            <List
              size="large"
              rowKey="id"
              loading={loading}
              dataSource={list}
              renderItem={item => (
                <List.Item actions={role === 'Admin' ? [<MoreBtn current={item} />] : null}>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src={!_.isEmpty(item.images) ? item.images[0].thumbUrl : ''}
                        shape="square"
                        size="large"
                      />
                    }
                    /* eslint-disable */
                    title={
                      <NavLink style={{ fontSize: 16 }} to={`/notices/single/${item._id}`}>
                        {item.title}
                      </NavLink>
                    }
                    /* eslint-enable */
                    description={moment(item.date).format('YYYY-MM-DD HH:mm')}
                  />
                  <ListContent data={item} />
                </List.Item>
              )}
            />
          </Card>
        </div>
        <Modal
          title={done ? null : `${current.id ? 'Edit' : 'Add'}`}
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

export default withRouter(BasicList);
