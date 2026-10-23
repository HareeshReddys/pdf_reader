import type { InterviewApi } from './types';

declare global {
  interface Window {
    interviewAPI: InterviewApi;
  }
}

export {};
