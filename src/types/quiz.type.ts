export interface GenerateQuizData {
  problemName: string; // 문제명
  problemAnswer: number; // 답안
  problemCommentary: string; // 해설
  problemChoices: string[]; // 선지
}

export type GenerateQuizType = '객관식' | '주관식';
