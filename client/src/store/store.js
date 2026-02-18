import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import contestReducer from '../features/contestSlice';
import leaderboardReducer from '../features/leaderboardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    contest: contestReducer,
    leaderboard: leaderboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
