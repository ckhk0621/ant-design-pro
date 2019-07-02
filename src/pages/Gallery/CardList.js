import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Col, Row, Icon, Modal, Button } from 'antd';
// import { FormattedMessage } from 'umi/locale';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import SITE_URL from '../../services/setting';

// import styles from './CardList.less';

@connect(({ gallery, loading }) => ({
  single: gallery.single || null,
  list: gallery.single.images || [],
  loading: loading.models.gallery,
}))
class CardList extends PureComponent {
  state = {
    image: null,
    visible: false,
  };

  handleOk = () => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  showModal = url => {
    this.setState({
      image: url,
      visible: true,
    });
  };

  render() {
    // const { Meta } = Card;
    const { list, single } = this.props;
    const { image, visible } = this.state;
    return (
      <PageHeaderWrapper title={single.title}>
        <div style={{ background: '#FFFFFF', padding: '30px' }}>
          <Row gutter={16} type="flex">
            {list.map(d => (
              <Col key={d} xs={24} sm={4} md={6} style={{ marginBottom: 15, height: '100%' }}>
                <Card
                  bodyStyle={{ padding: 0 }}
                  hoverable
                  cover={<img alt="" src={`${SITE_URL.SERVER_IMAGE}/${d}`} />}
                  actions={[
                    <Icon
                      type="zoom-in"
                      onClick={() => this.showModal(`${SITE_URL.SERVER_IMAGE}/${d}`)}
                    />,
                  ]}
                />
              </Col>
            ))}
          </Row>

          <Modal
            visible={visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={[
              <Button key="submit" type="primary" onClick={this.handleOk}>
                OK
              </Button>,
            ]}
          >
            <img
              alt="pop"
              src={image}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </Modal>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default CardList;
