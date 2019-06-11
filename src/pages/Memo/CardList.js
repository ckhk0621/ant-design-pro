/* eslint-disable react/jsx-indent */
/* eslint-disable no-unused-vars */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, List, Modal, Form, Radio, Select, Input, DatePicker } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import _ from 'lodash';
import moment from 'moment';
import Ellipsis from '@/components/Ellipsis';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Result from '@/components/Result';

import styles from './CardList.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

@connect(({ memo, loading, user }) => ({
  list: memo.list,
  loading: loading.models.memo,
  role: user.currentUser.role,
}))
@Form.create()
class CardList extends PureComponent {
  state = { visible: false, done: false };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'memo/fetch',
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
        type: 'memo/update',
        payload: { id, ...fieldsValue, content: fieldsValue.content.toHTML() },
      });
    });
  };

  deleteItem = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'memo/delete',
      payload: { id },
    });
  };

  render() {
    const { list, loading, role } = this.props;
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;

    const { visible, done, current = {} } = this.state;

    const modalFooter = done
      ? { footer: null, onCancel: this.handleDone }
      : { okText: 'Update', onOk: this.handleSubmit, onCancel: this.handleCancel };

    const content = (
      <div className={styles.pageHeaderContent}>
        <FormattedMessage id="app.notice.memo.list.description" />
      </div>
    );

    const extraContent = (
      <div className={styles.extraImg}>
        <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png" />
      </div>
    );

    const getModalContent = () => {
      if (done) {
        return (
          <Result
            type="success"
            title="Memo updated"
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
                },
              ],
              initialValue: current.content,
            })(<TextArea rows={4} maxLength={100} placeholder="" />)}
          </FormItem>

          {/* <FormItem {...this.formLayout} label={<FormattedMessage id="form.images.label" />}>
            {getFieldDecorator('images', {
              rules: [],
            })(<UploadImage direction="memo" />)}
          </FormItem> */}

          <FormItem
            {...this.formLayout}
            label={<FormattedMessage id="form.public.label" />}
            help={<FormattedMessage id="form.public.label2.help" />}
          >
            <div>
              {getFieldDecorator('public', {
                initialValue: current.public,
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
                    {/* <Option value="3">
                      <FormattedMessage id="form.publicUsers.option.my" />
                    </Option>
                    */}
                  </Select>
                )}
              </FormItem>
            </div>
          </FormItem>
          {/*
          <FormItem {...this.formLayout} label={<FormattedMessage id="form.priority.label" />}>
            <div>
              {getFieldDecorator('priority', {
                initialValue: current.priority,
              })(
                <Radio.Group>
                  <Radio value="1">High</Radio>
                  <Radio value="2">Medium</Radio>
                  <Radio value="3">Low</Radio>
                </Radio.Group>
              )}
            </div>
          </FormItem> */}

          <br />
        </Form>
      );
    };

    return (
      <PageHeaderWrapper title="Memo List" content={content} extraContent={extraContent}>
        <div className={styles.cardList}>
          <List
            rowKey="id"
            loading={loading}
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={[...list]}
            renderItem={item => (
              <List.Item key={item.id}>
                <Card
                  hoverable
                  className={styles.card}
                  actions={
                    role === 'Admin'
                      ? [
                          // eslint-disable-next-line react/jsx-indent
                          <a onClick={() => this.showEditModal(item)}>Edit</a>,
                          // eslint-disable-next-line react/jsx-indent
                          <a
                            onClick={() =>
                              Modal.confirm({
                                title: 'Delete Memo',
                                content: 'Confirm to delete this memo',
                                okText: 'Confirm',
                                cancelText: 'Cancel',
                                /* eslint-disable */
                                onOk: () => this.deleteItem(item._id),
                                /* eslint-enable */
                              })
                            }
                          >
                            Delete
                          </a>,
                        ]
                      : null
                  }
                >
                  <Card.Meta
                    avatar={
                      <img
                        alt=""
                        className={styles.cardAvatar}
                        src={!_.isEmpty(item.images) ? item.images[0].thumbUrl : ''}
                      />
                    }
                    title={<a>{item.title}</a>}
                    description={
                      <Ellipsis className={styles.item} lines={3}>
                        <div dangerouslySetInnerHTML={{ __html: item.content }} />
                      </Ellipsis>
                    }
                  />
                </Card>
              </List.Item>
            )}
          />
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

export default CardList;
