import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  leaderboard: [],
  loading: false,
  error: null,
};

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setLeaderboard: (state, action) => {
      state.leaderboard = action.payload;
      state.loading = false;
    },
    updateLeaderboard: (state, action) => {
      // Real-time update from Socket.io
      state.leaderboard = action.payload.leaderboard;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setLoading, setLeaderboard, updateLeaderboard, setError } = leaderboardSlice.actions;
export default leaderboardSlice.reducer;
