import 'braft-editor/dist/index.css';
import React, { PureComponent } from 'react';
import { NavLink, withRouter } from 'dva/router';
// import router from 'umi/router';
import moment from 'moment';
import { connect } from 'dva';
import { List, Card, Icon, Dropdown, Menu, Modal, Form, DatePicker, Row, Col } from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './BasicList.less';

const FormItem = Form.Item;
const { MonthPicker } = DatePicker;

@connect(({ gallery, loading }) => ({
  list: gallery.list,
  loading: loading.models.list,
}))
@Form.create()
class BasicList extends PureComponent {
  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'gallery/fetch',
      time: moment(new Date())
        .utcOffset(8)
        .format('YYYY-MM'),
    });
  }

  deleteItem = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'gallery/delete',
      payload: { id },
    });
  };

  handleDateChange = value => {
    console.log(`value====`, value);
    const { dispatch } = this.props;
    dispatch({
      type: 'gallery/fetch',
      time: moment(value)
        .utcOffset(8)
        .format('YYYY-MM'),
    });
  };

  render() {
    const { list, loading } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;

    const editAndDelete = (key, currentItem) => {
      if (key === 'edit') this.showEditModal(currentItem);
      else if (key === 'delete') {
        Modal.confirm({
          title: 'Delete Gallery',
          content: 'Confirm to delete this gallery？',
          okText: 'Confirm',
          cancelText: 'Cancel',
          /* eslint-disable */
          onOk: () => this.deleteItem(currentItem._id),
          /* eslint-enable */
        });
      }
    };

    const MoreBtn = props => (
      <Dropdown
        overlay={
          <Menu onClick={({ key }) => editAndDelete(key, props.current)}>
            {/* <Menu.Item key="edit">Edit</Menu.Item> */}
            <Menu.Item key="delete">Delete</Menu.Item>
          </Menu>
        }
      >
        <a>
          Action <Icon type="down" />
        </a>
      </Dropdown>
    );

    return (
      <PageHeaderWrapper>
        <div className={styles.standardList}>
          <Row gutter={12}>
            <Col className="gutter-row" span={6}>
              <FormItem label="Filter From">
                {getFieldDecorator('date', {
                  initialValue: moment(new Date(), 'YYYY-MM'),
                })(
                  <MonthPicker
                    placeholder="Select"
                    mode="year"
                    format="YYYY-MM"
                    style={{ width: '100%' }}
                    onChange={value => this.handleDateChange(value)}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Card
            className={styles.listCard}
            bordered={false}
            style={{ marginTop: 24, paddingTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
          >
            <List
              size="large"
              rowKey="id"
              loading={loading}
              dataSource={list}
              renderItem={item => (
                <List.Item actions={[<MoreBtn current={item} />]}>
                  <List.Item.Meta
                    /* eslint-disable */
                    title={
                      <NavLink style={{ fontSize: 16 }} to={`/gallery/single/${item._id}`}>
                        {item.title}
                      </NavLink>
                    }
                    /* eslint-enable */
                    // description={moment(item.date).format('YYYY-MM-DD HH:mm')}
                    description={item.description}
                  />
                  <div>{moment(item.year).format('YYYY-MM')}</div>
                </List.Item>
              )}
            />
          </Card>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default withRouter(BasicList);
