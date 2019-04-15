import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';
import { Row, Col, Card, List, Avatar } from 'antd';
import _ from 'lodash';
import EditableLinkGroup from '@/components/EditableLinkGroup';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './Workplace.less';

const links = [
  {
    title: 'Room 1',
    href: '',
  },
  {
    title: <span style={{ color: 'red' }}>Room 2</span>,
    href: '',
  },
  {
    title: 'Room 3',
    href: '',
  },
];

@connect(({ user, memo, notice, project, activities, chart, loading }) => ({
  currentUser: user.currentUser,
  project,
  activities,
  chart,
  noticeList: notice.list,
  memoList: memo.list,
  currentUserLoading: loading.effects['user/fetchCurrent'],
  projectLoading: loading.effects['project/fetchNotice'],
  activitiesLoading: loading.effects['activities/fetchList'],
  memoLoading: loading.effects['memo/fetch'],
  noticeLoading: loading.effects['notice/fetch'],
}))
class Workplace extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });
    dispatch({
      type: 'project/fetchNotice',
    });
    dispatch({
      type: 'activities/fetchList',
    });
    dispatch({
      type: 'chart/fetch',
    });
    dispatch({
      type: 'memo/fetch',
    });
    dispatch({
      type: 'notice/fetch',
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
  }

  disableClick = e => {
    e.preventDefault();
  };

  renderActivities() {
    const { noticeList } = this.props;
    return noticeList.map(item => {
      // const events = item.template.split(/@\{([^{}]*)\}/gi).map(key => {
      //   if (item[key]) {
      //     return (
      //       <a href={item[key].link} key={item[key].name}>
      //         {item[key].name}
      //       </a>
      //     );
      //   }
      //   return key;
      // });
      return (
        <>
          {/* eslint-disable */}
          <List.Item key={item._id}>
            {/* eslint-enable */}
            <List.Item.Meta
              avatar={<Avatar src={!_.isEmpty(item.images[0]) ? item.images[0].thumbUrl : ''} />}
              title={
                <span>
                  <a className={styles.username}>{item.author}</a>
                  &nbsp;
                  {/* eslint-disable */}
                  <Link to={`/notices/single/${item._id}`}>
                    {/* eslint-enable */}
                    <span
                      className={styles.event}
                      dangerouslySetInnerHTML={{ __html: item.content }}
                    />
                  </Link>
                </span>
              }
              description={
                <span className={styles.datetime} title={item.date}>
                  {moment(item.date).fromNow()}
                </span>
              }
            />
          </List.Item>
        </>
      );
    });
  }

  render() {
    const { currentUser, currentUserLoading, memoList, projectLoading, noticeLoading } = this.props;

    const pageHeaderContent =
      currentUser && Object.keys(currentUser).length ? (
        <div className={styles.pageHeaderContent}>
          <div className={styles.avatar}>
            <Avatar size="large" src={currentUser.avatar} />
          </div>
          <div className={styles.content}>
            <div className={styles.contentTitle}>Hello {currentUser.name}, welcome back.</div>
            <div>{currentUser.title}</div>
          </div>
        </div>
      ) : null;

    const extraContent = (
      <div className={styles.extraContent}>
        <div className={styles.statItem}>
          <p>Room Booking</p>
          <p>0</p>
        </div>
        <div className={styles.statItem}>
          <p>Ride Booking</p>
          <p>0</p>
        </div>
      </div>
    );

    return (
      <PageHeaderWrapper
        loading={currentUserLoading}
        content={pageHeaderContent}
        extraContent={extraContent}
      >
        <Row gutter={24}>
          <Col xl={16} lg={24} md={24} sm={24} xs={24}>
            <Card
              className={styles.projectList}
              style={{ marginBottom: 24 }}
              title="Latest Memo"
              bordered={false}
              extra={<Link to="/memo/all">All</Link>}
              loading={projectLoading}
              bodyStyle={{ padding: 0 }}
            >
              {memoList.map(item => (
                <Card.Grid className={styles.projectGrid} key={item.title}>
                  <Card bodyStyle={{ padding: 0 }} bordered={false}>
                    <Card.Meta
                      title={
                        <div className={styles.cardTitle}>
                          <Avatar
                            size="small"
                            src={!_.isEmpty(item.images[0]) ? item.images[0].thumbUrl : ''}
                          />
                          <Link to="#" onClick={this.disableClick}>
                            {item.title}
                          </Link>
                        </div>
                      }
                      description={<span dangerouslySetInnerHTML={{ __html: `${item.content}` }} />}
                    />
                    <div className={styles.projectItemContent}>
                      <Link to="#" onClick={this.disableClick}>
                        {item.member || ''}
                      </Link>
                      {item.date && (
                        <span className={styles.datetime} title={item.date}>
                          {moment(item.date).fromNow()}
                        </span>
                      )}
                    </div>
                  </Card>
                </Card.Grid>
              ))}
            </Card>
            <Card
              bodyStyle={{ padding: 0 }}
              bordered={false}
              extra={<Link to="/notices/all">All</Link>}
              className={styles.activeCard}
              title="Latest Notice"
              loading={noticeLoading}
            >
              <List loading={noticeLoading} size="large">
                <div className={styles.activitiesList}>{this.renderActivities()}</div>
              </List>
            </Card>
          </Col>
          <Col xl={8} lg={24} md={24} sm={24} xs={24}>
            <Card
              style={{ marginBottom: 24 }}
              title={`Booking Status: ${moment().format('MM ddd, YYYY')}`}
              bordered={false}
              bodyStyle={{ padding: 0 }}
            >
              <EditableLinkGroup onAdd={() => {}} links={links} linkElement={Link} />
            </Card>
            {/* <Card
              style={{ marginBottom: 24 }}
              bordered={false}
              title="XX 指数"
              loading={radarData.length === 0}
            >
              <div className={styles.chart}>
                <Radar hasLegend height={343} data={radarData} />
              </div>
            </Card> */}
            <Card
              bodyStyle={{ paddingTop: 12, paddingBottom: 12 }}
              bordered={false}
              title="Other info"
              loading={projectLoading}
            >
              <div className={styles.members}>
                <Row gutter={48}>
                  <Col span={12} />
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
      </PageHeaderWrapper>
    );
  }
}

export default Workplace;
