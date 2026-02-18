import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  contests: [],
  activeContest: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    pages: 1,
    total: 0,
  },
};

const contestSlice = createSlice({
  name: 'contest',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setContests: (state, action) => {
      state.contests = action.payload.contests;
      state.pagination = action.payload.pagination || state.pagination;
      state.loading = false;
    },
    setActiveContest: (state, action) => {
      state.activeContest = action.payload;
      state.loading = false;
    },
    updateContestStatus: (state, action) => {
      const { contestId, status } = action.payload;
      
      // Update in contests list
      const contest = state.contests.find((c) => c._id === contestId);
      if (contest) {
        contest.status = status;
      }
      
      // Update active contest
      if (state.activeContest?._id === contestId) {
        state.activeContest.status = status;
      }
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setContests,
  setActiveContest,
  updateContestStatus,
  setError,
  clearError,
} = contestSlice.actions;

export default contestSlice.reducer;
