import { message } from 'antd';
import {
  submitRideBookingForm,
  queryNotices,
  deleteNotice,
  updateNotice,
  querySingleNotice,
} from '@/services/api';

export default {
  namespace: 'ridebooking',

  state: {
    single: {
      post: {
        title: '',
        content: '',
      },
    },
    list: [],
    images: null,
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryNotices);
      const payload = response;
      if (response) {
        yield put({
          type: 'saveNotices',
          payload,
        });
      }
    },
    *single({ id }, { call, put }) {
      const response = yield call(querySingleNotice, id);
      const payload = response.post;
      if (response.result === 'ok') {
        yield put({
          type: 'saveSingleNotice',
          payload,
        });
      }
    },
    *delete({ payload }, { call, put, select }) {
      const token = yield select(state => state.login.token);
      const response = yield call(deleteNotice, payload, token);
      if (response) {
        yield put({
          type: 'fetch',
        });
      }
    },
    *update({ payload }, { call, put, select }) {
      const token = yield select(state => state.login.token);
      const response = yield call(updateNotice, payload, token);
      if (response) {
        yield put({
          type: 'fetch',
        });
      }
    },
    *submitRegularForm({ payload }, { call, select }) {
      const token = yield select(state => state.login.token);
      const response = yield call(submitRideBookingForm, payload, token);
      if (response.status === 'ok') {
        message.success('Booking created');
      }
    },
  },

  reducers: {
    saveNotices(state, { payload }) {
      return {
        ...state,
        list: payload,
      };
    },
    saveSingleNotice(state, { payload }) {
      console.log(`saveSingleNotice===`, payload);
      return {
        ...state,
        single: payload,
      };
    },
    saveStepFormData(state, { payload }) {
      return {
        ...state,
        step: {
          ...state.step,
          ...payload,
        },
      };
    },
    saveImagesToFormData(state, { payload }) {
      return {
        ...state,
        images: {
          ...payload,
        },
      };
    },
  },
};
