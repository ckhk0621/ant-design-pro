// import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {
  submitRoomBookingForm,
  queryRoomBooking,
  deleteRoomBooking,
  submitRoomBookingEmail,
} from '@/services/api';

export default {
  namespace: 'roombooking',

  state: {
    list: [],
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryRoomBooking);
      const payload = response;
      if (response) {
        yield put({
          type: 'save',
          payload,
        });
      }
    },
    *delete({ payload }, { call, put, select }) {
      console.log(`payload====`, payload);
      const token = yield select(state => state.login.token);
      const response = yield call(deleteRoomBooking, payload, token);
      if (response) {
        yield put({
          type: 'fetch',
        });
      }
    },
    *submitRegularForm({ payload }, { call, put, select }) {
      const token = yield select(state => state.login.token);
      const response = yield call(submitRoomBookingForm, payload, token);
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
        if (pathname.indexOf('/roombooking/roomone') !== -1) {
          dispatch({ type: 'fetch' });
        }
      });
    },
  },
};
