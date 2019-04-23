// import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {
  submitGalleryForm,
  queryGallery,
  deleteGallery,
  submitPhotoForm,
  updateMemo,
  querySingleGallery,
} from '@/services/api';

export default {
  namespace: 'gallery',

  state: {
    list: [],
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryGallery);
      const payload = response;
      if (response) {
        yield put({
          type: 'save',
          payload,
        });
      }
    },
    *fetchSingle({ getGalleryID }, { call, put }) {
      const response = yield call(querySingleGallery, getGalleryID);
      const payload = response;
      if (response) {
        yield put({
          type: 'saveSingle',
          payload,
        });
      }
    },
    *delete({ payload }, { call, put, select }) {
      const token = yield select(state => state.login.token);
      const response = yield call(deleteGallery, payload, token);
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
    *uploadImages({ payload }, { put }) {
      yield put({
        type: 'saveImagesToFormData',
        payload,
      });
    },
    *submitGalleryForm({ payload }, { call, select }) {
      const token = yield select(state => state.login.token);
      const response = yield call(submitGalleryForm, payload, token);
      if (response.status === 'ok') {
        message.success('Gallery created');
      }
    },

    *submitPhotoForm({ payload }, { call, select }) {
      const token = yield select(state => state.login.token);
      const response = yield call(submitPhotoForm, payload, token);
      if (response.status === 'ok') {
        message.success('Photos added');
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
    saveSingle(state, { payload }) {
      return {
        ...state,
        single: {
          ...payload.images,
        },
      };
    },
    saveSingleNotice(state, { payload }) {
      return {
        ...state,
        single: payload,
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

  subscriptions: {
    setup({ history, dispatch }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname }) => {
        if (pathname === '/gallery/photo/add') {
          dispatch({ type: 'fetch' });
        }
        if (window.location.pathname.includes('/gallery/single/')) {
          const getGalleryID = window.location.pathname.split('/').pop();
          dispatch({ type: 'fetchSingle', getGalleryID });
        }
      });
    },
  },
};
