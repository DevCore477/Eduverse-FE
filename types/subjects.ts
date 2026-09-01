
export type TRSubject = {
  id: string
  name: string
  code: string
  description: string
  journey_type: string
  created_at: Date
  academic_year_id: string
}

export type TLevelItem = {
  id: string;
  title: string;
  level: number;
  isLocked: boolean;
  isCurrent: boolean;
  isCompleted: boolean;
  stars: number;
  isLesson: boolean
};

export type TStepInfo = {
  step: {
    id: string;
    stepType: string;
    orderIndex: number;
  };
  lesson: {
    id: string;
    title: string;
    subjectId: string;
  };
  content: {
    media: {
      id: string;
      backgroundImageUrl: string | null;
      ttsAudioUrl: string | null;
      karaokeJson: any | null;
      videoUrl: string | null;
      skipAvailableAfterSeconds: number;
      extras: {
        text: string;
        voice: string;
        language: string;
        [key: string]: any; // For any additional properties in extras
      };
    };
  };
}

export type TSubjectKey =
  | "arabic"
  | "french"
  | "english"
  | "history"
  | "islamic"
  | "math"
  | "music"
  | "science"
  | "geography"
  | "civic"
  | "general";

export const LEVEL_POSITIONS = [
  { left: 0.4, top: 0.82 },
  { left: 0.53, top: 0.68 },
  { left: 0.23, top: 0.54 },
  { left: 0.6, top: 0.46 },
  { left: 0.36, top: 0.3 },
];

export const SLIDER_LEVEL_POSITIONS = [
  { left: 0.55, top: 0.74 },
  { left: 0.26, top: 0.56 },
  { left: 0.62, top: 0.4 },
  { left: 0.26, top: 0.22 },
  { left: 0.54, top: 0.07 },
];