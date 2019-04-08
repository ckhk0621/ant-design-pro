import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {
  fakeSubmitForm,
  submitNoticeForm,
  queryNotices,
  deleteNotice,
  updateNotice,
  querySingleNotice,
} from '@/services/api';

export default {
  namespace: 'notice',

  state: {
    single: null,
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
      const response = yield call(submitNoticeForm, payload, token);
      if (response.status === 'ok') {
        message.success('成功提交了');
      }
    },
    *uploadImages({ payload }, { put }) {
      yield put({
        type: 'saveImagesToFormData',
        payload,
      });
    },
    *submitStepForm({ payload }, { call, put }) {
      yield call(submitNoticeForm, payload);
      yield put({
        type: 'saveStepFormData',
        payload,
      });
      yield put(routerRedux.push('/form/step-form/result'));
    },
    *submitAdvancedForm({ payload }, { call }) {
      yield call(fakeSubmitForm, payload);
      message.success('提交成功');
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
