import { z } from 'zod';

export const testCaseSchema = z.object({
  inputData: z.string().min(1, 'Enter the test input.'),
  expectedOutput: z.string().min(1, 'Enter the expected output.'),
  isHidden: z.boolean(),
});

export const problemFormSchema = z.object({
  title: z.string().min(1, 'Enter a problem title.'),
  content: z.string().min(10, 'Enter at least 10 characters of problem content.'),
  timeLimit: z.coerce.number().min(100, 'Time limit must be at least 100ms.'),
  memoryLimit: z.coerce.number().min(16, 'Memory limit must be at least 16MB.'),
  testCases: z.array(testCaseSchema).min(1, 'Add at least one test case.'),
});

export type ProblemFormValues = z.infer<typeof problemFormSchema>;
