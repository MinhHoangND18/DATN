import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';

import MenuReducer from './slices/MenuSlice';
import ModalReducer from './slices/ModalSlice';
import UserReducer from './slices/UserSlice';
import SocketReducer from './slices/SocketSlice';

const createNoopStorage = (): {
  getItem: (_key: string) => Promise<null>;
  setItem: (_key: string, value: unknown) => Promise<unknown>;
  removeItem: (_key: string) => Promise<void>;
} => {
  return {
    getItem(): Promise<null> {
      return Promise.resolve(null);
    },
    setItem(_key, value): Promise<unknown> {
      return Promise.resolve(value);
    },
    removeItem(): Promise<void> {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== 'undefined'
    ? createWebStorage('local')
    : createNoopStorage();

const rootReducers = combineReducers({
  menu: MenuReducer,
  user: UserReducer,
  modal: ModalReducer,
  socket: SocketReducer,
});

const persistedReducer = persistReducer(
  {
    key: 'store',
    version: 1,
    storage: storage,
    blacklist: ['modal'],
  },
  rootReducers,
);

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredPaths: [],
      },
    }),
});

export const persistor = persistStore(store);

export default store;

export type IRootState = ReturnType<typeof store.getState>;

export type IAppDispatch = typeof store.dispatch;
