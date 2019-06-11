import { message } from 'antd';
import {
  submitRideBookingForm,
  updateRideBooking,
  queryRideBooking,
  queryCompletedRideBooking,
  deleteRideBooking,
  submitDestinationForm,
  queryDestination,
  deleteDestination,
  updateDestination,
  submitLocationForm,
  queryLocation,
  deleteLocation,
  updateLocation,
  submitPlateForm,
  queryPlate,
  deletePlate,
  submitDriverForm,
  queryDriver,
  deleteDriver,
} from '@/services/api';

export default {
  namespace: 'ridebooking',
  state: {
    data: {
      list: [],
    },
    destination: {
      data: {
        list: [],
      },
    },
    location: {
      data: {
        list: [],
      },
    },
    plate: {
      data: {
        list: [],
      },
    },
    driver: {
      data: {
        list: [],
      },
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
    *fetchCompletedRecord(_, { call, put }) {
      const response = yield call(queryCompletedRideBooking);
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
    *fetchLocation(_, { call, put }) {
      const response = yield call(queryLocation);
      const payload = response;
      if (response) {
        yield put({
          type: 'saveLocation',
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
    *deleteLocation({ payload }, { call, put, select }) {
      const token = yield select(state => state.login.token);
      const response = yield call(deleteLocation, payload, token);
      if (response) {
        yield put({
          type: 'fetchLocation',
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
    *updateLocation({ payload }, { call, put, select }) {
      const token = yield select(state => state.login.token);
      const response = yield call(updateLocation, payload, token);
      if (response) {
        yield put({
          type: 'fetchLocation',
        });
      }
    },
    *submitPlateForm({ payload }, { call, select }) {
      const token = yield select(state => state.login.token);
      const response = yield call(submitPlateForm, payload, token);
      if (response.status === 'ok') {
        message.success('Plate created');
      }
    },
    *fetchPlate(_, { call, put }) {
      const response = yield call(queryPlate);
      const payload = response;
      if (response) {
        yield put({
          type: 'savePlate',
          payload,
        });
      }
    },
    *deletePlate({ payload }, { call, put, select }) {
      const token = yield select(state => state.login.token);
      const response = yield call(deletePlate, payload, token);
      if (response) {
        yield put({
          type: 'fetchPlate',
        });
      }
    },
    *submitDriverForm({ payload }, { call, select }) {
      const token = yield select(state => state.login.token);
      const response = yield call(submitDriverForm, payload, token);
      if (response.status === 'ok') {
        message.success('Driver created');
      }
    },
    *fetchDriver(_, { call, put }) {
      const response = yield call(queryDriver);
      const payload = response;
      if (response) {
        yield put({
          type: 'saveDriver',
          payload,
        });
      }
    },
    *deleteDriver({ payload }, { call, put, select }) {
      const token = yield select(state => state.login.token);
      const response = yield call(deleteDriver, payload, token);
      if (response) {
        yield put({
          type: 'fetchDriver',
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
    *update({ payload }, { call, put, select }) {
      const token = yield select(state => state.login.token);
      const response = yield call(updateRideBooking, payload, token);
      if (response) {
        yield put({
          type: 'fetch',
        });
      }
    },
    *submitDestinationForm({ payload }, { call, select }) {
      const token = yield select(state => state.login.token);
      const response = yield call(submitDestinationForm, payload, token);
      if (response.status === 'ok') {
        message.success('Destination created');
      }
    },
    *submitLocationForm({ payload }, { call, select }) {
      const token = yield select(state => state.login.token);
      const response = yield call(submitLocationForm, payload, token);
      if (response.status === 'ok') {
        message.success('Location created');
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
    saveLocation(state, { payload }) {
      return {
        ...state,
        location: {
          data: {
            list: payload,
          },
        },
      };
    },
    savePlate(state, { payload }) {
      return {
        ...state,
        plate: {
          data: {
            list: payload,
          },
        },
      };
    },
    saveDriver(state, { payload }) {
      return {
        ...state,
        driver: {
          data: {
            list: payload,
          },
        },
      };
    },
  },

  subscriptions: {
    setup({ history, dispatch }) {
      return history.listen(({ pathname }) => {
        if (pathname.indexOf('/ride-booking') !== -1) {
          dispatch({ type: 'fetchDestination' });
          dispatch({ type: 'fetchLocation' });
          dispatch({ type: 'fetchDriver' });
          dispatch({ type: 'fetchPlate' });
        }
      });
    },
  },
};
