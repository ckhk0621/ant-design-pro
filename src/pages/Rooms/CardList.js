import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form } from 'antd';
import { FormattedMessage } from 'umi/locale';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './CardList.less';

@connect(({ memo, loading }) => ({
  list: memo.list,
  loading: loading.models.memo,
}))
@Form.create()
class CardList extends PureComponent {
  state = {};

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

  render() {
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

    return (
      <PageHeaderWrapper title="Room" content={content} extraContent={extraContent}>
        <div>Wokring</div>
      </PageHeaderWrapper>
    );
  }
}

export default CardList;
