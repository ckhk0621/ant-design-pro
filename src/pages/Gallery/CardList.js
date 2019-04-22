import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Col, Row } from 'antd';
// import { FormattedMessage } from 'umi/locale';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

// import styles from './CardList.less';

@connect(({ memo, loading }) => ({
  list: memo.list,
  loading: loading.models.memo,
}))
class CardList extends PureComponent {
  state = {};

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'memo/fetch',
    });
  }

  render() {
    const { Meta } = Card;
    return (
      <PageHeaderWrapper title="Gallery">
        <div style={{ background: '#FFFFFF', padding: '30px' }}>
          <Row gutter={16} type="flex">
            <Col xs={24} sm={4} md={6}>
              <Card
                onClick={() => console.log(`Clicked`)}
                hoverable
                cover={
                  <img
                    alt="example"
                    src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                  />
                }
              >
                <Meta title="Europe Street beat" description="www.instagram.com" />
              </Card>
            </Col>
          </Row>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default CardList;
