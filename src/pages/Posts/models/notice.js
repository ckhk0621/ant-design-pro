import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { fakeSubmitForm, submitNoticeForm } from '@/services/api';

export default {
  namespace: 'notice',

  state: {
    step: {
      payAccount: '',
      receiverAccount: '',
      receiverName: '',
      amount: '',
    },
    images: null,
  },

  effects: {
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
