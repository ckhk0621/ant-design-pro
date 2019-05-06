// import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { submitMemoForm, queryMemo, deleteMemo, updateMemo } from '@/services/api';

export default {
  namespace: 'roombooking',

  state: {
    list: [],
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryMemo);
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
      const response = yield call(deleteMemo, payload, token);
      if (response) {
        yield put({
          type: 'fetch',
        });
      }
    },
    *update({ payload }, { call, put, select }) {
      const token = yield select(state => state.login.token);
      const response = yield call(updateMemo, payload, token);
      if (response) {
        yield put({
          type: 'fetch',
        });
      }
    },
    *submitRegularForm({ payload }, { call, select }) {
      const token = yield select(state => state.login.token);
      const response = yield call(submitMemoForm, payload, token);
      if (response.status === 'ok') {
        message.success('Memo created');
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
    saveSingleNotice(state, { payload }) {
      return {
        ...state,
        single: payload,
      };
    },
  },
};
