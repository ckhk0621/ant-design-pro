import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Button } from 'antd';
import { withRouter } from 'dva/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

@connect(({ profile, notice, loading }) => ({
  profile,
  post: notice.single,
  loading: loading.effects['notice/single'],
}))
class BasicProfile extends Component {
  componentDidMount() {
    const { dispatch, match } = this.props;
    const { params } = match;

    dispatch({
      type: 'notice/single',
      id: params.id || '',
    });
  }

  render() {
    const { loading, post, history } = this.props;
    return (
      <PageHeaderWrapper title={post.title} loading={loading}>
        <Card bordered={false}>
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
          <div style={{ paddingTop: 30 }}>
            <Button type="primary" onClick={() => history.back()}>
              Back
            </Button>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default withRouter(BasicProfile);
