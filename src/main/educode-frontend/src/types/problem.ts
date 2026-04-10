export interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface Problem {
  id: number;
  title: string;
  descriptionMarkdown: string;
  timeLimitMs: number;
  memoryLimitMb: number;
  testCases: TestCase[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProblemRequest {
  title: string;
  descriptionMarkdown: string;
  timeLimitMs: number;
  memoryLimitMb: number;
  testCases: TestCase[];
}

export type UpdateProblemRequest = CreateProblemRequest;
