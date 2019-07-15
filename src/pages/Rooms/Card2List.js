/* eslint-disable consistent-return */
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
  Button,
  DatePicker,
  TimePicker,
  Checkbox,
} from 'antd';
import moment from 'moment';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import TextArea from 'antd/lib/input/TextArea';

const FormItem = Form.Item;

@connect(({ user, room2booking, loading }) => ({
  submitting: loading.effects['room2booking/submitRegularForm'],
  currentUser: user.currentUser || '',
  roombooking: room2booking.list,
  loading: loading.models.room2booking,
}))
@Form.create()
class Card2List extends PureComponent {
  state = {
    value: null,
    selectedValue: null,
    disabledTime: [],
    dateValue: null,
    disabledStartHours: [],
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  getListData = value => {
    let listData;
    switch (value.date()) {
      case 8:
        listData = [
          { type: 'warning', content: 'Warning event.', time: moment() },
          { type: 'success', content: 'Usual event.', time: moment() },
        ];
        break;
      default:
    }
    return listData || [];
  };

  getDateData = value => {
    const { roombooking } = this.props;
    // eslint-disable-next-line consistent-return
    // eslint-disable-next-line array-callback-return
    const DateData = roombooking.filter(d => {
      if (moment(d.date).format('YYYY-MM-DD') === value.format('YYYY-MM-DD')) {
        return d;
      }
    });
    return DateData;
  };

  dateCellRender = value => {
    const listData = this.getDateData(value);
    if (_.isEmpty(listData)) {
      return false;
    }
    return (
      <ul className="events">
        {listData.map(item => (
          // eslint-disable-next-line no-underscore-dangle
          <li key={item._id}>
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
    const listData = this.getDateData(value);
    let disabledStartHours = [];

    if (_.isEmpty(listData)) {
      this.setState({
        disabledStartHours: [],
        value,
        dateValue: null,
        selectedValue: value,
      });
      return;
    }

    // eslint-disable-next-line array-callback-return
    listData.map(d => {
      const startTime = moment(d.startTime, 'HH:mm');
      const endTime = moment(d.endTime, 'HH:mm');
      const duration = moment.duration(endTime.diff(startTime));
      const hours = Math.trunc(duration.asHours());

      const diffHours =
        hours &&
        Array(hours)
          .fill()
          .map((v, i) => startTime.hour() + i);

      disabledStartHours = [...disabledStartHours, ...diffHours];
    });

    this.setState({
      value,
      selectedValue: value,
      dateValue: listData,
      disabledStartHours,
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
        startTime: moment(values.startTime).format('HH:mm'),
        endTime: moment(values.endTime).format('HH:mm'),
        content: `${moment(values.startTime).format('HH:mm')}(${values.reservation})`,
        type: 'success',
      };

      if (!err) {
        dispatch({
          type: 'room2booking/submitRegularForm',
          payload: submitValues,
        });
        form.resetFields();
        this.setState({ selectedValue: null });
      }
    });
  };

  handleDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'room2booking/delete',
      payload: { id },
    });

    this.setState({ selectedValue: null });
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

  sendEmail = data => {
    const { form, dispatch } = this.props;

    form.validateFields(['demoEmail'], (errors, values) => {
      if (errors || _.isEmpty(values.demoEmail)) return;
      dispatch({
        type: 'roombooking/submitRoomBookingEmail',
        payload: {
          demoEmail: values.demoEmail,
          data,
        },
      })
        .then(this.setState({ selectedValue: null }))
        .then(
          form.setFieldsValue({
            demoEmail: '',
          })
        );
    });
  };

  onCheckboxChange = (checkedValues) => {
    console.log('checked = ', checkedValues)
  }

  render() {
    const { value, selectedValue, disabledTime, dateValue, disabledStartHours } = this.state;
    const {
      form: { getFieldDecorator, getFieldValue },
      submitting,
      currentUser,
    } = this.props;

    const timeFormat = 'HH:mm';

    const rowTwoStyle = {
      marginTop: 12,
    };

    const getBookingTypeValue = getFieldValue('bookingType') || []

    console.log(`getTypeValue===`,getBookingTypeValue);

    return (
      <PageHeaderWrapper title="Room Two">
        {selectedValue && (
          <Row gutter={12}>
            <Col className="gutter-row" span={24}>
              <FormItem>
                {getFieldDecorator('demoEmail', {
                  rules: [
                    {
                      type: 'email',
                      message: 'email wrong format',
                    },
                  ],
                  validateTrigger: 'onBlur',
                })(
                  <Input placeholder="測試接收email的電郵" style={{ width: 300, marginTop: 15 }} />
                )}
              </FormItem>

              <div
                className="ant-alert-ant-alert ant-alert-info ant-alert-no-icon"
                style={{ padding: 15 }}
              >
                {`You selected date: ${selectedValue && selectedValue.format('YYYY-MM-DD')}`}
                <br />
                {(dateValue || []).map(d => (
                  // eslint-disable-next-line no-underscore-dangle
                  <div key={d._id} style={{ marginBottom: 10 }}>
                    <b>{`${d.startTime}-${d.endTime} ${d.reservation}`} </b>
                    {`${d.bookingType}`} {d.remark && ` | ${d.remark}`}
                    {(currentUser.role === 'Admin' || currentUser.name === d.reservation) && (
                      <Button
                        type="dashed"
                        style={{ padding: 5, marginLeft: 10, fontSize: 11 }}
                        // eslint-disable-next-line no-underscore-dangle
                        onClick={() => this.handleDelete(d._id)}
                      >
                        Delete
                      </Button>
                    )}
                    {(currentUser.role === 'Admin' || currentUser.name === d.reservation) && (
                      <Button
                        type="dashed"
                        style={{ padding: 5, marginLeft: 10, fontSize: 11 }}
                        // eslint-disable-next-line no-underscore-dangle
                        onClick={() => this.sendEmail(d)}
                      >
                        Email
                      </Button>
                    )}
                  </div>
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
                <FormItem label="orderBy" style={{ display: 'none' }}>
                  {getFieldDecorator('orderBy', {
                    initialValue: currentUser.name,
                  })(<Input />)}
                </FormItem>

                <FormItem label="Reservation">
                  {getFieldDecorator('reservation', {
                    initialValue: currentUser.name,
                  })(<Input />)}
                </FormItem>

                <FormItem label="Date">
                  {getFieldDecorator('date', {
                    initialValue: moment(value, 'YYYY-MM-DD'),
                  })(
                    <DatePicker
                      placeholder="Select"
                      format="YYYY-MM-DD"
                      style={{ width: '100%' }}
                      disabled
                    />
                  )}
                </FormItem>

                <FormItem label="Start Time">
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
                      disabledHours={() => disabledStartHours}
                      onChange={this.handleStartTimeChange}
                    />
                  )}
                </FormItem>
                <FormItem label="End Time">
                  {getFieldDecorator('endTime')(
                    <TimePicker
                      minuteStep={30}
                      format={timeFormat}
                      disabledHours={() => disabledTime}
                      disabled={_.isEmpty(getFieldValue('startTime'))}
                    />
                  )}
                </FormItem>

                <br />

                <FormItem label="Type" style={rowTwoStyle}>
                  {getFieldDecorator('bookingType')(
                    <Checkbox.Group onChange={this.onCheckboxChange}>
                      <Row style={{ width: '100%' }}>
                        <Col span={8}>
                          <Checkbox value="Video Conference">Video Conference</Checkbox>
                        </Col>
                        <Col span={8}>
                          <Checkbox value="Meeting">Meeting</Checkbox>
                        </Col>
                        <Col span={8}>
                          <Checkbox value="Others">Others</Checkbox>
                        </Col>
                      </Row>
                    </Checkbox.Group>
                  )}
                </FormItem>

                <br />

                <FormItem
                  label="Remark"
                  style={{
                    marginTop: 12,
                    display: getBookingTypeValue.indexOf('Others') === -1 ? 'none' : 'block'
                  }}
                >
                  {getFieldDecorator('remark')(<TextArea />)}
                </FormItem>

                <br />

                {!_.isEmpty(selectedValue) && (
                  <FormItem style={rowTwoStyle}>
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
                )}
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

export default Card2List;
