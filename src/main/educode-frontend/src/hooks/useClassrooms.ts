import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createClassroom,
  getClassroom,
  getClassroomStudents,
  getMyClassrooms,
  joinClassroom,
  removeClassroomStudent,
} from '@/api/classrooms';
import { queryKeys } from '@/shared/constants/queryKeys';

export function useMyClassroomsQuery() {
  return useQuery({
    queryKey: queryKeys.classrooms.my,
    queryFn: getMyClassrooms,
  });
}

export function useClassroomQuery(classroomId: number) {
  return useQuery({
    queryKey: queryKeys.classrooms.detail(classroomId),
    queryFn: () => getClassroom(classroomId),
    enabled: Number.isFinite(classroomId),
  });
}

export function useClassroomStudentsQuery(classroomId: number) {
  return useQuery({
    queryKey: queryKeys.classrooms.students(classroomId),
    queryFn: () => getClassroomStudents(classroomId),
    enabled: Number.isFinite(classroomId),
  });
}

export function useCreateClassroomMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createClassroom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.classrooms.my });
    },
  });
}

export function useJoinClassroomMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: joinClassroom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.classrooms.my });
    },
  });
}

export function useRemoveStudentMutation(classroomId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (studentId: number) => removeClassroomStudent(classroomId, studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.classrooms.students(classroomId),
      });
    },
  });
}
