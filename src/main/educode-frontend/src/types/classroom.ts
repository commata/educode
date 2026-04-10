export interface Classroom {
  id: number;
  name: string;
  description: string;
  inviteCode: string;
  educatorId: number;
  educatorName: string;
  createdAt: string;
}

export interface JoinClassroomRequest {
  inviteCode: string;
}

export interface CreateClassroomRequest {
  name: string;
  description: string;
}

export interface ClassroomStudent {
  id: number;
  name: string;
  email: string;
  joinedAt: string;
}
