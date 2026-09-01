import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TRSubject } from "@/types/subjects";

interface SubjectState {
    subjects: TRSubject[];  // Array of TRSubject, not a tuple
    selectedSubject: TRSubject | null; // Add a field to store the selected subject
    subjectLessons: string[]; // Placeholder for subject lessons

}

const initialState: SubjectState = {
    subjects: [], // Initialize as empty array
    selectedSubject:  null, // Add a field to store the selected subject
    subjectLessons: [], // Initialize as empty array
};

const subjectSlice = createSlice({
    name: 'subjects',
    initialState,
    reducers: {
        // To add or set the subjects
        setPupilSubjects(state, action: PayloadAction<TRSubject[]>) {
            state.subjects = action.payload;  // Set the array of subjects
        },

        // To clear the subjects array
        clearSubjects(state) {
            state.subjects = [];  // Reset the array to empty
        },

        setSubjectLessons(state, action: PayloadAction<string[]>) {
            state.subjectLessons = action.payload;  // Set the array of subject lessons
        },
        // To get a specific subject and update the state
        getSpecificSubject(state, action: PayloadAction<string>) {
            const subject = state.subjects.find(subject => subject.id === action.payload);
            state.selectedSubject = subject || null;  // Set selectedSubject to found subject or null
        },
    },
});

export const { setPupilSubjects, clearSubjects, getSpecificSubject, setSubjectLessons } = subjectSlice.actions;
export const selectSubjects = (state: { subjects: SubjectState }) => state.subjects.selectedSubject;
export const subjects = (state: { subjects: SubjectState }) => state.subjects.subjects;
export const subjectLessons = (state: { subjects: SubjectState }) => state.subjects.subjectLessons;
export default subjectSlice.reducer;
