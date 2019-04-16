import { message } from 'antd';
import {
  submitRideBookingForm,
  queryRideBooking,
  deleteRideBooking,
  submitDestinationForm,
  queryDestination,
  deleteDestination,
  updateDestination,
} from '@/services/api';

export default {
  namespace: 'ridebooking',
  state: {
    data: {
      list: [],
    },
    destination: {
      data: {},
    },
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryRideBooking);
      const payload = response;
      if (response) {
        yield put({
          type: 'saveRideBooking',
          payload,
        });
      }
    },
    *fetchDestination(_, { call, put }) {
      const response = yield call(queryDestination);
      const payload = response;
      if (response) {
        yield put({
          type: 'saveDestination',
          payload,
        });
      }
    },
    *delete({ payload }, { call, put, select }) {
      const token = yield select(state => state.login.token);
      const response = yield call(deleteRideBooking, payload, token);
      if (response) {
        yield put({
          type: 'fetch',
        });
      }
    },
    *deleteDestination({ payload }, { call, put, select }) {
      const token = yield select(state => state.login.token);
      const response = yield call(deleteDestination, payload, token);
      if (response) {
        yield put({
          type: 'fetchDestination',
        });
      }
    },
    *updateDestination({ payload }, { call, put, select }) {
      const token = yield select(state => state.login.token);
      const response = yield call(updateDestination, payload, token);
      if (response) {
        yield put({
          type: 'fetchDestination',
        });
      }
    },
    // *update({ payload }, { call, put, select }) {
    //   const token = yield select(state => state.login.token);
    //   const response = yield call(updateNotice, payload, token);
    //   if (response) {
    //     yield put({
    //       type: 'fetch',
    //     });
    //   }
    // },
    *submitRegularForm({ payload }, { call, select }) {
      const token = yield select(state => state.login.token);
      const response = yield call(submitRideBookingForm, payload, token);
      if (response.status === 'ok') {
        message.success('Booking created');
      }
    },
    *submitDestinationForm({ payload }, { call, select }) {
      const token = yield select(state => state.login.token);
      const response = yield call(submitDestinationForm, payload, token);
      if (response.status === 'ok') {
        message.success('Destination created');
      }
    },
  },

  reducers: {
    saveRideBooking(state, { payload }) {
      return {
        ...state,
        data: {
          list: payload,
        },
      };
    },
    saveDestination(state, { payload }) {
      return {
        ...state,
        destination: {
          data: {
            list: payload,
          },
        },
      };
    },
    saveSingleNotice(state, { payload }) {
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
