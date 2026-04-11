import { apiClient } from '@/api/client';
import type {
  Classroom,
  ClassroomStudent,
  CreateClassroomRequest,
  JoinClassroomRequest,
} from '@/types/classroom';

interface ClassroomListResponse {
  classrooms: Classroom[];
}

export async function createClassroom(payload: CreateClassroomRequest) {
  const { data } = await apiClient.post<Classroom>('/api/classrooms', payload);
  return data;
}

export async function getMyClassrooms() {
  const { data } = await apiClient.get<ClassroomListResponse>('/api/classrooms/my');
  return data.classrooms;
}

export async function joinClassroom(payload: JoinClassroomRequest) {
  const { data } = await apiClient.post<Classroom>('/api/classrooms/join', payload);
  return data;
}

export async function getClassroom(classroomId: number) {
  const { data } = await apiClient.get<Classroom>(`/api/classrooms/${classroomId}`);
  return data;
}

export async function getClassroomStudents(classroomId: number) {
  const { data } = await apiClient.get<ClassroomStudent[]>(
    `/api/classrooms/${classroomId}/students`,
  );
  return data;
}

export async function removeClassroomStudent(classroomId: number, studentId: number) {
  await apiClient.delete(`/api/classrooms/${classroomId}/students/${studentId}`);
}