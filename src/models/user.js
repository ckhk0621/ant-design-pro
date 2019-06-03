import { query as queryUsers } from '@/services/user';
import { queryCurrentUser, queryAllUser } from '@/services/api';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
    allUser: [],
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *queryAllUser(_, { call, put }) {
      const response = yield call(queryAllUser);
      console.log(`response====`, response);
      yield put({
        type: 'saveAll',
        payload: response,
      });
    },

    *fetchCurrent(_, { call, put, select }) {
      const token = yield select(state => state.login.token);
      const response = yield call(queryCurrentUser, token);
      console.log(`fetchCurrent=======`, response);
      yield put({
        type: 'saveCurrentUser',
        payload: {
          ...response,
          avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
        },
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveAll(state, action) {
      return {
        ...state,
        allUser: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
