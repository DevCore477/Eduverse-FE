import { TPupilModulesData } from '@/types/pupil';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ParentPupilState {
  pupil: TPupilModulesData | undefined;
}

const initialState: ParentPupilState = {
  pupil: undefined,
};

const parentPupilsSlice = createSlice({
  name: 'parent_pupil',
  initialState,
  reducers: {
    setParentPupil(state, action: PayloadAction<TPupilModulesData>) {
      state.pupil = action.payload;
    },
    clearParentPupil(state) {
      state.pupil = undefined;
    },
  },
});

export const { setParentPupil, clearParentPupil } = parentPupilsSlice.actions;
export default parentPupilsSlice.reducer;
