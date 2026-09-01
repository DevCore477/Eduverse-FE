import { TPupil } from '@/types/pupil';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ActivePupilState {
    pupil: TPupil | undefined;
}

const initialState: ActivePupilState = {
    pupil: undefined,
};

const activePupilsSlice = createSlice({
    name: 'active_pupil',
    initialState,
    reducers: {
        setActivePupil(state, action: PayloadAction<TPupil>) {
            state.pupil = action.payload;
        },
        clearActivePupil(state) {
            state.pupil = undefined;
        }, 
    },
});

export const { setActivePupil,  clearActivePupil } = activePupilsSlice.actions;
export default activePupilsSlice.reducer;
