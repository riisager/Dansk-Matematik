export interface StoryData {
  title: string;
  story_text: string;
  real_world_fact: string;
  math_problem: {
    question: string;
    answer: number;
    unit?: string;
  };
  reading_question: {
    question: string;
    options: string[];
    correct_option_index: number;
  };
}

export interface ScoreEntry {
  id: string;
  title: string;
  timestamp: number;
  points: number;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}