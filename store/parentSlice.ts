import { TAuthResponse, TTrailInfo, TUser } from '@/types/auth';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ParentState {
  parent: TAuthResponse | null;
}

const initialState: ParentState = {
  parent: null,
};

const parentSlice = createSlice({
  name: 'parent',
  initialState,
  reducers: {
    setParent(state, action: PayloadAction<TAuthResponse>) {
      state.parent = action.payload;
    },
    clearParent(state) {
      state.parent = null;
    },
    updateSubscription(state, action: PayloadAction<TUser['subscription']>) {
      if (state.parent) {
        state.parent.user.subscription = action.payload;
      }
    },
    updateTrail(state, action: PayloadAction<TTrailInfo>) {
      if (state.parent) {
        state.parent.user = {
          ...state.parent.user,
          trailStartDate: action.payload.trailStartDate,
          trailEndDate: action.payload.trailEndDate,
          trailStatue: action.payload.trailStatus,
          maxPupilsAllowed: action.payload.maxPupilsAllowed
        };
      }
    },
    setTrialStatus(state, action: PayloadAction<'not_started' | 'active' | 'expired' | 'converted'>) {
      if (state.parent) {
        state.parent.user.trailStatue = action.payload;
      }
    },
    clearTrail(state) {
      if (state.parent) {
        state.parent.user = {
          ...state.parent.user,
          trailStartDate: undefined,
          trailEndDate: undefined,
          trailStatue: undefined,
          maxPupilsAllowed: undefined
        };
      }
    }

  },
});

export const { setParent, clearParent, updateSubscription, updateTrail, setTrialStatus, clearTrail } = parentSlice.actions;
export default parentSlice.reducer;
