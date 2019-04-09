// import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { submitInoutForm, queryInout, deleteInout } from '@/services/api';

export default {
  namespace: 'inout',

  state: {
    data: {
      list: [],
    },
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryInout);
      const payload = response;
      if (response) {
        yield put({
          type: 'saveInout',
          payload,
        });
      }
    },
    *delete({ payload }, { call, put, select }) {
      const token = yield select(state => state.login.token);
      const response = yield call(deleteInout, payload, token);
      if (response) {
        yield put({
          type: 'fetch',
        });
      }
    },
    *submitRegularForm({ payload }, { call, select }) {
      const token = yield select(state => state.login.token);
      const response = yield call(submitInoutForm, payload, token);
      if (response.status === 'ok') {
        message.success('In out record created');
      }
    },
  },

  reducers: {
    saveInout(state, { payload }) {
      return {
        ...state,
        data: {
          list: payload,
        },
      };
    },
  },
};
