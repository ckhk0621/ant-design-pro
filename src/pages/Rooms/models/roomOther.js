// import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {
  submitRoom2BookingForm,
  queryRoom2Booking,
  deleteRoom2Booking,
  submitRoomBookingEmail,
} from '@/services/api';

export default {
  namespace: 'room2booking',

  state: {
    list: [],
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryRoom2Booking);
      const payload = response;
      if (response) {
        yield put({
          type: 'save',
          payload,
        });
      }
    },
    *delete({ payload }, { call, put, select }) {
      const token = yield select(state => state.login.token);
      const response = yield call(deleteRoom2Booking, payload, token);
      if (response) {
        yield put({
          type: 'fetch',
        });
      }
    },
    *submitRegularForm({ payload }, { call, put, select }) {
      const token = yield select(state => state.login.token);
      const response = yield call(submitRoom2BookingForm, payload, token);
      if (response.status === 'ok') {
        message.success('Room booking created');
        yield put({
          type: 'fetch',
        });
      }
    },
    *submitRoomBookingEmail({ payload }, { call, select }) {
      const token = yield select(state => state.login.token);
      const response = yield call(submitRoomBookingEmail, payload, token);
      if (response.status === 'ok') {
        message.success('Email sent');
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        list: payload,
      };
    },
  },

  subscriptions: {
    setup({ history, dispatch }) {
      return history.listen(({ pathname }) => {
        if (pathname.indexOf('/roombooking/roomtwo') !== -1) {
          dispatch({ type: 'fetch' });
        }
      });
    },
  },
};
