import { TLessonQuestionResult, TQuestionResult } from '@/types/questions';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LessonQuestionState {
    lessons: TLessonQuestionResult[];
}

const initialState: LessonQuestionState = {
    lessons: [],
};

const LessonQuestionSlice = createSlice({
    name: 'lesson_questions',
    initialState,
    reducers: {
        setLessonQuestions(state, action: PayloadAction<{ data: TLessonQuestionResult }>) {
            const { lessonId, questions } = action.payload.data;
            const lessonIndex = state.lessons.findIndex((lesson) => lesson.lessonId === lessonId);

            if (lessonIndex !== -1) {
                state.lessons[lessonIndex].questions = questions;  // Update questions for the existing lesson
            } else {
                state.lessons.push({ lessonId, questions });  // Add new lesson with questions
            }
        },

        // Add or update a question in the lesson
        addOrUpdateQuestionInLesson(state, action: PayloadAction<{ lessonId: string, question: TQuestionResult }>) {
            const { lessonId, question } = action.payload;
            const lessonIndex = state.lessons.findIndex((lesson) => lesson.lessonId === lessonId);

            if (lessonIndex !== -1) {
                const questionIndex = state.lessons[lessonIndex].questions.findIndex(
                    (q) => q.questionId === question.questionId
                );

                if (questionIndex !== -1) {
                    // If question exists, update it
                    state.lessons[lessonIndex].questions[questionIndex] = question;
                } else {
                    // If question doesn't exist, add it
                    state.lessons[lessonIndex].questions.push(question);
                }
            } else {
                // If lesson doesn't exist, create it with the question
                state.lessons.push({ lessonId, questions: [question] });
            }
        },

        // Remove a question from a lesson
        removeQuestionFromLesson(state, action: PayloadAction<{ lessonId: string, questionId: string }>) {
            const { lessonId, questionId } = action.payload;
            const lessonIndex = state.lessons.findIndex((lesson) => lesson.lessonId === lessonId);

            if (lessonIndex !== -1) {
                state.lessons[lessonIndex].questions = state.lessons[lessonIndex].questions.filter(
                    (question) => question.questionId !== questionId
                );  // Remove question from the lesson
            }
        },

    },
});

export const {
    setLessonQuestions,
    addOrUpdateQuestionInLesson,
    removeQuestionFromLesson,
} = LessonQuestionSlice.actions;

export default LessonQuestionSlice.reducer;
