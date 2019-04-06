import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createLogger } from 'redux-logger';

const persistConfig = {
  key: 'redux-storage',
  timeout: 0,
  storage,
  whitelist: ['login'],
};

const persistEnhancer = () => createStore => (reducer, initialState, enhancer) => {
  const store = createStore(persistReducer(persistConfig, reducer), initialState, enhancer);
  const persist = persistStore(store);
  return { ...store, persist };
};

export const dva = {
  config: {
    onError(err) {
      err.preventDefault();
      console.error(err.message);
    },
    extraEnhancers: [persistEnhancer()],
    onAction: createLogger(),
  },
};

export function render(oldRender) {
  oldRender();
}

// import { persistStore, persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';

// const persistConfig = {
//   key: 'redux-storage',
//   timeout: 0,
//   storage,
//   whitelist: ['products', 'user','cookies']
// };

// const persistEnhancer = () => createStore => (reducer, initialState, enhancer) => {
//   const store = createStore(persistReducer(persistConfig, reducer), initialState, enhancer);
//   const persist = persistStore(store);
//   return { ...store, persist };
// };

// export const dva = {
//   config: {
//     onError(err) {
//       err.preventDefault();
//       console.error(err.message);
//     },
//     extraEnhancers: [persistEnhancer()],
//   },
//   plugins: [require('dva-logger')()],
// };
