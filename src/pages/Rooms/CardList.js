import 'braft-editor/dist/index.css';
import React, { PureComponent } from 'react';
import { FormattedMessage } from 'umi/locale';
import _ from 'lodash';
import { connect } from 'dva';
import {
  Form,
  Input,
  Calendar,
  Badge,
  Row,
  Col,
  Radio,
  Button,
  DatePicker,
  TimePicker,
} from 'antd';
import moment from 'moment';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import TextArea from 'antd/lib/input/TextArea';

const FormItem = Form.Item;

@connect(({ user, loading }) => ({
  submitting: loading.effects['notice/submitRegularForm'],
  currentUser: user.currentUser || '',
  loading: loading.models.memo,
}))
@Form.create()
class CardList extends PureComponent {
  state = {
    value: null,
    selectedValue: null,
    disabledTime: null,
  };

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

  getListData = value => {
    let listData;
    switch (value.date()) {
      case 8:
        listData = [
          { type: 'warning', content: 'Warning event.', time: moment() },
          { type: 'success', content: 'Usual event.', time: moment() },
        ];
        break;
      // case 10:
      //   listData = [
      //     { type: 'warning', content: 'This is warning event.' },
      //     { type: 'success', content: 'This is usual event.' },
      //     { type: 'error', content: 'This is error event.' },
      //   ];
      //   break;
      // case 15:
      //   listData = [
      //     { type: 'warning', content: 'This is warning event' },
      //     { type: 'success', content: 'This is very long usual event。。....' },
      //     { type: 'error', content: 'This is error event 1.' },
      //     { type: 'error', content: 'This is error event 2.' },
      //     { type: 'error', content: 'This is error event 3.' },
      //     { type: 'error', content: 'This is error event 4.' },
      //   ];
      //   break;
      default:
    }
    return listData || [];
  };

  dateCellRender = value => {
    const listData = this.getListData(value);
    return (
      <ul className="events">
        {listData.map(item => (
          <li key={item.content}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  getMonthData = value => (value.month() === 8 ? 1394 : '');

  monthCellRender = value => {
    const num = this.getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  };

  onSelect = value => {
    this.setState({
      value,
      selectedValue: value,
    });
  };

  onPanelChange = value => {
    this.setState({ value });
  };

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    let submitValues;
    e.preventDefault();
    form.validateFields((err, values) => {
      submitValues = {
        ...values,
        type: 'success',
      };

      console.log(`submitValues=====`, submitValues);

      if (!err) {
        dispatch({
          type: 'roombooking/submitRegularForm',
          payload: submitValues,
        });
        form.resetFields();
      } else {
        console.log(err);
      }
    });
  };

  handleReset = () => {
    const { form } = this.props;
    form.resetFields();
  };

  handleStartTimeChange = time => {
    if (_.isEmpty(time)) {
      return;
    }
    const startTime = moment('00:00', 'HH:mm');

    const duration = moment.duration(time.diff(startTime));
    const hours = Math.trunc(duration.asHours());

    const diffHours =
      hours &&
      Array(hours)
        .fill()
        .map((d, i) => i);
    this.setState({ disabledTime: diffHours });
  };

  render() {
    const { value, selectedValue, disabledTime } = this.state;
    const {
      form: { getFieldDecorator, getFieldValue },
      submitting,
      currentUser,
    } = this.props;

    const timeFormat = 'HH:mm';

    const formItemLayout = {
      // labelCol: {
      //   xs: { span: 24 },
      //   sm: { span: 7 },
      // },
      // wrapperCol: {
      //   xs: { span: 24 },
      //   sm: { span: 12 },
      //   md: { span: 10 },
      // },
    };

    const submitFormLayout = {
      // wrapperCol: {
      //   xs: { span: 24, offset: 0 },
      //   sm: { span: 10, offset: 7 },
      // },
    };

    const rowTwoStyle = {
      marginTop: 12,
      // wrapperCol: {
      //   xs: { span: 24, offset: 0 },
      //   sm: { span: 10, offset: 7 },
      // },
    };

    // const message = (
    //   <div>
    //     {(this.getListData(value)||[]).map(d=>d.type)}
    //   </div>
    // );

    return (
      <PageHeaderWrapper title="Room">
        {selectedValue && (
          <Row gutter={12}>
            <Col className="gutter-row" span={24}>
              <div
                className="ant-alert-ant-alert ant-alert-info ant-alert-no-icon"
                style={{ padding: 15 }}
              >
                {`You selected date: ${selectedValue && selectedValue.format('YYYY-MM-DD')}`}
                <br />
                {(this.getListData(value) || []).map(d => (
                  <div key={d.content}>{d.content}</div>
                ))}
              </div>
            </Col>
            <Col className="gutter-row" span={24}>
              <Form
                onSubmit={this.handleSubmit}
                hideRequiredMark
                style={{ backgroundColor: '#fff', padding: 15, marginTop: 15, marginBottom: 15 }}
                encType="multipart/form-data"
                layout="inline"
              >
                <FormItem {...formItemLayout} label="orderBy" style={{ display: 'none' }}>
                  {getFieldDecorator('orderBy', {
                    initialValue: currentUser.name,
                  })(<Input />)}
                </FormItem>

                <FormItem {...formItemLayout} label="Reservation">
                  {getFieldDecorator('Reservation', {
                    initialValue: currentUser.name,
                  })(<Input />)}
                </FormItem>

                <FormItem {...formItemLayout} label="Date">
                  {getFieldDecorator('date', {
                    initialValue: moment(value, 'YYYY-MM-DD'),
                  })(
                    <DatePicker
                      placeholder="Select"
                      format="YYYY-MM-DD"
                      style={{ width: '100%' }}
                    />
                  )}
                </FormItem>

                <FormItem {...formItemLayout} label="Start Time">
                  {getFieldDecorator('startTime', {
                    rules: [
                      {
                        required: true,
                        message: 'Input start time',
                      },
                    ],
                  })(
                    <TimePicker
                      minuteStep={30}
                      format={timeFormat}
                      onChange={this.handleStartTimeChange}
                    />
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="End Time">
                  {getFieldDecorator('endTime')(
                    <TimePicker
                      minuteStep={30}
                      format={timeFormat}
                      disabledHours={() => disabledTime}
                      disabled={_.isEmpty(getFieldValue('startTime'))}
                    />
                  )}
                </FormItem>

                <FormItem {...formItemLayout} label="Type" style={rowTwoStyle}>
                  {getFieldDecorator('type', {
                    initialValue: 'videoConference',
                  })(
                    <Radio.Group>
                      <Radio value="videoConference">Video Conference</Radio>
                      <Radio value="meeting">Meeting</Radio>
                      <Radio value="others">Others</Radio>
                    </Radio.Group>
                  )}
                </FormItem>

                <FormItem
                  {...formItemLayout}
                  label="Remark"
                  style={{
                    display: getFieldValue('type') === 'others' ? 'inline-block' : 'none',
                    marginTop: 12,
                  }}
                >
                  {getFieldDecorator('remark')(<TextArea />)}
                </FormItem>

                <FormItem {...submitFormLayout} style={rowTwoStyle}>
                  <Button onClick={() => this.handleReset()}>
                    <FormattedMessage id="form.reset" />
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={submitting}
                    style={{ marginLeft: 8 }}
                  >
                    <FormattedMessage id="form.submit" />
                  </Button>
                </FormItem>
              </Form>
            </Col>
          </Row>
        )}

        <Row gutter={12}>
          <Col span={24}>
            <div style={{ background: '#FFFFFF', padding: '30px' }}>
              <Calendar
                dateCellRender={this.dateCellRender}
                onSelect={this.onSelect}
                monthCellRender={this.monthCellRender}
              />
            </div>
          </Col>
        </Row>
      </PageHeaderWrapper>
    );
  }
}

export default CardList;
