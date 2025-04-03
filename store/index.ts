import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setupListeners } from '@reduxjs/toolkit/query';

import itemsReducer from './slices/itemsSlice';
import networkReducer from './slices/networkSlice';
import { itemsApi } from '../services/itemsApi';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['items'], // only persist items
};

const rootReducer = combineReducers({
  items: itemsReducer,
  network: networkReducer,
  [itemsApi.reducerPath]: itemsApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(itemsApi.middleware),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;