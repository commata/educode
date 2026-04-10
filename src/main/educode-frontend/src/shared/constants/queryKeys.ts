export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  classrooms: {
    my: ['classrooms', 'my'] as const,
    detail: (classroomId: number) => ['classrooms', classroomId] as const,
    students: (classroomId: number) => ['classrooms', classroomId, 'students'] as const,
  },
  problems: {
    my: ['problems', 'my'] as const,
    detail: (problemId: number) => ['problems', problemId] as const,
  },
  assignments: {
    my: ['assignments', 'my'] as const,
    byClassroom: (classroomId: number) => ['classrooms', classroomId, 'assignments'] as const,
    detail: (assignmentId: number) => ['assignments', assignmentId] as const,
    status: (assignmentId: number) => ['assignments', assignmentId, 'submissions-status'] as const,
  },
  submissions: {
    my: ['submissions', 'my'] as const,
    detail: (submissionId: number) => ['submissions', submissionId] as const,
  },
};
