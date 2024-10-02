import { configureStore } from '@reduxjs/toolkit';
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
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlice'; // Auth slice reducer
import tweetSlice from './tweets'; // Tweet slice reducer

// Persist configuration for auth
const authPersistConfig = {
    key: 'auth',
    storage, // Use localStorage or sessionStorage
};

// Persist configuration for tweets
const tweetPersistConfig = {
    key: 'tweets',
    storage, // Use localStorage or sessionStorage
};

// Create persisted reducers
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedTweetReducer = persistReducer(tweetPersistConfig, tweetSlice);

// Configure the Redux store
const store = configureStore({
    reducer: {
        auth: persistedAuthReducer, // Use persisted auth reducer
        tweet: persistedTweetReducer, // Use persisted tweet reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

// Create a persistor
export const persistor = persistStore(store);
export default store;
