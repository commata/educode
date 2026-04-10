import { z } from 'zod';

export const testCaseSchema = z.object({
  input: z.string().min(1, '입력값을 입력하세요.'),
  expectedOutput: z.string().min(1, '예상 출력값을 입력하세요.'),
  isHidden: z.boolean(),
});

export const problemFormSchema = z.object({
  title: z.string().min(1, '문제 제목을 입력하세요.'),
  descriptionMarkdown: z.string().min(10, '문제 본문을 10자 이상 입력하세요.'),
  timeLimitMs: z.coerce.number().min(100, '제한시간은 100ms 이상이어야 합니다.'),
  memoryLimitMb: z.coerce.number().min(16, '메모리 제한은 16MB 이상이어야 합니다.'),
  testCases: z.array(testCaseSchema).min(1, '테스트케이스를 최소 1개 이상 추가하세요.'),
});

export type ProblemFormValues = z.infer<typeof problemFormSchema>;
