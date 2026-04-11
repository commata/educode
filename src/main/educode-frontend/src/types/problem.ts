export interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface TestCaseRequest {
  inputData: string;
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
  content: string;
  timeLimit: number;
  memoryLimit: number;
  testCases: TestCaseRequest[];
}

export type UpdateProblemRequest = CreateProblemRequest;
