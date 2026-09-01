import { Question } from "@/types/questions";

/**
 * Sample questions data for testing and development
 * In production, these would come from your API
 */
export const SAMPLE_QUESTIONS: Question[] = [
  {
    id: "a4f38731-9258-456e-8b3b-2f31d749a5ae",
    challenge_json: {
      type: "true_false",
      hints: {
        wrong: "Compare the tens and ones digits carefully.",
        correct: "Right, 125 is larger.",
      },
      answer: true,
      points: 3,
      question: "125 is greater than 120",
    },
    points: 3,
    created_at: "2025-12-26T12:55:52.719Z",
  },
  // {
  //   id: "7ce84468-5b1e-40e2-8b13-85d6bdf5dcd2",
  //   challenge_json: {
  //     type: "multiple_choice",
  //     hints: {
  //       wrong: "Try adding the tens and ones separately.",
  //       correct: "Well done—adding the numbers correctly gives 125.",
  //     },
  //     answer: "125",
  //     points: 3,
  //     options: ["125", "115", "120", "130"],
  //     question: "What is 58 + 67?",
  //   },
  //   points: 3,
  //   created_at: "2025-12-26T12:55:52.897Z",
  // },
  // {
  //   id: "eea1c02a-9cf7-4b41-8331-aeb1bd7aaa60",
  //   challenge_json: {
  //     type: "fill_blank",
  //     hints: {
  //       wrong: "Recalculate the addition step by step.",
  //       correct: "Exactly! 58 + 67 equals 125.",
  //     },
  //     answer: ["125"],
  //     points: 3,
  //     content: {},
  //     question: "The sum of 58 and 67 is ____",
  //   },
  //   points: 3,
  //   created_at: "2025-12-26T12:55:53.128Z",
  // },
  // {
  //   id: "26afc153-23b5-4f40-9fa0-4b56064ba1bc",
  //   challenge_json: {
  //     type: "ordering",
  //     hints: {
  //       wrong: "Start by comparing the hundreds, tens, and ones digits.",
  //       correct: "Great job! You've ordered them correctly.",
  //     },
  //     answer: ["100", "110", "125"],
  //     points: 3,
  //     content: {
  //       items: ["125", "100", "110"],
  //     },
  //     question: "Order these numbers from smallest to largest",
  //   },
  //   points: 3,
  //   created_at: "2025-12-26T12:55:53.496Z",
  // },
  // {
  //   id: "473494fb-5c1d-462f-a0f3-2ceead4bf2b0",
  //   challenge_json: {
  //     type: "matching",
  //     hints: {
  //       wrong: "Review the addition problems and their results.",
  //       correct: "Excellent! The matches are correct.",
  //     },
  //     answer: {
  //       "45 + 55": "100",
  //       "58 + 67": "125",
  //       "30 + 40": "70",
  //     },
  //     points: 3,
  //     content: {
  //       pairs: [
  //         {
  //           left: "58 + 67",
  //           right: "125",
  //         },
  //         {
  //           left: "45 + 55",
  //           right: "100",
  //         },
  //         {
  //           left: "30 + 40",
  //           right: "70",
  //         },
  //       ],
  //     },
  //     question: "Match the addition problems to their sums",
  //   },
  //   points: 3,
  //   created_at: "2025-12-26T12:55:53.686Z",
  // },
  // {
  //   id: "63159cb5-f239-4b08-b968-5bc77c4e7940",
  //   challenge_json: {
  //     type: "image_choice",
  //     hints: {
  //       wrong: "Look closely at the digits in each image.",
  //       correct: "Well done! You picked the right image.",
  //     },
  //     answer: "125",
  //     points: 2,
  //     content: {
  //       images: [
  //         {
  //           id: "125",
  //           url: "https://via.placeholder.com/200x200.png?text=125",
  //         },
  //         {
  //           id: "120",
  //           url: "https://via.placeholder.com/200x200.png?text=120",
  //         },
  //         {
  //           id: "130",
  //           url: "https://via.placeholder.com/200x200.png?text=130",
  //         },
  //         {
  //           id: "115",
  //           url: "https://via.placeholder.com/200x200.png?text=115",
  //         },
  //       ],
  //     },
  //     question: "Choose the image that shows the result of 58 + 67",
  //   },
  //   points: 2,
  //   created_at: "2025-12-26T12:55:53.878Z",
  // },
];

/**
 * Sample questions for different subjects
 */
export const SAMPLE_QUESTIONS_BY_SUBJECT = {
  mathematics: SAMPLE_QUESTIONS,
  
  english: [
    {
      id: "eng-001",
      challenge_json: {
        type: "multiple_choice",
        hints: {
          wrong: "Remember, plural nouns end with -s or -es.",
          correct: "Great! 'Books' is the correct plural form.",
        },
        answer: "books",
        points: 2,
        options: ["book", "books", "bookes", "bookies"],
        question: "What is the plural form of 'book'?",
      },
      points: 2,
      created_at: "2025-12-26T12:55:52.719Z",
    },
    {
      id: "eng-002",
      challenge_json: {
        type: "true_false",
        hints: {
          wrong: "A verb is an action word.",
          correct: "Correct! 'Run' is indeed a verb.",
        },
        answer: true,
        points: 2,
        question: "The word 'run' is a verb",
      },
      points: 2,
      created_at: "2025-12-26T12:55:52.897Z",
    },
  ] as Question[],

  arabic: [
    {
      id: "ar-001",
      challenge_json: {
        type: "multiple_choice",
        hints: {
          wrong: "Think about the correct way to greet someone.",
          correct: "Perfect! مرحبا means hello.",
        },
        answer: "مرحبا",
        points: 2,
        options: ["مرحبا", "شكرا", "وداعا", "نعم"],
        question: "How do you say 'Hello' in Arabic?",
      },
      points: 2,
      created_at: "2025-12-26T12:55:52.719Z",
    },
  ] as Question[],
};

/**
 * Get sample questions by subject code
 */
export const getSampleQuestionsBySubject = (subjectCode: string): Question[] => {
  const code = subjectCode.toLowerCase();
  
  if (code.includes("math")) {
    return SAMPLE_QUESTIONS_BY_SUBJECT.mathematics;
  } else if (code.includes("en") || code.includes("english")) {
    return SAMPLE_QUESTIONS_BY_SUBJECT.english;
  } else if (code.includes("ar") || code.includes("arabic")) {
    return SAMPLE_QUESTIONS_BY_SUBJECT.arabic;
  }
  
  return SAMPLE_QUESTIONS;
};


