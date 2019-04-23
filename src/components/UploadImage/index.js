import React, { PureComponent } from 'react';
import { Upload, Icon, Modal, message } from 'antd';
import { connect } from 'dva';

@connect(({ loading }) => ({
  submitting:
    loading.effects['notice/submitRegularForm'] || loading.effects['memo/submitRegularForm'],
}))
class UploadImage extends PureComponent {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
  };

  componentDidUpdate(prevProps) {
    const { submitting, direction } = this.props;
    if (prevProps.submitting !== submitting && submitting) {
      /* eslint-disable */
      this.setState({ fileList: [] });
      /* eslint-enable */
      const { dispatch } = this.props;
      if (direction === 'gallery') {
        dispatch({
          type: 'gallery/uploadImages',
          payload: [],
        });
      } else if (direction === 'memo') {
        dispatch({
          type: 'memo/uploadImages',
          payload: [],
        });
      } else {
        dispatch({
          type: 'notice/uploadImages',
          payload: [],
        });
      }
    }
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleChange = ({ fileList }) => {
    const { dispatch, direction } = this.props;
    this.setState({ fileList });
    if (direction === 'gallery') {
      dispatch({
        type: 'gallery/uploadImages',
        payload: fileList,
      });
    } else if (direction === 'memo') {
      dispatch({
        type: 'memo/uploadImages',
        payload: fileList,
      });
    } else {
      dispatch({
        type: 'notice/uploadImages',
        payload: fileList,
      });
    }
  };

  beforeUpload = file => {
    const isJPG = file.type === 'image/jpeg';
    if (!isJPG) {
      message.error('You can only upload JPG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJPG && isLt2M;
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return (
      <div className="clearfix">
        <Upload
          // action="//jsonplaceholder.typicode.com/posts/"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          beforeUpload={this.beforeUpload}
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default UploadImage;
