import type { Role } from '@/types/auth';

export const NAV_BY_ROLE: Record<Role, Array<{ label: string; to: string }>> = {
  STUDENT: [
    { label: '홈', to: '/student/dashboard' },
    { label: '내 학습방 목록', to: '/student/dashboard' },
    { label: '마이페이지', to: '/mypage' },
  ],
  EDUCATOR: [
    { label: '홈', to: '/educator/dashboard' },
    { label: '문제 생성', to: '/problems/new' },
    { label: '마이페이지', to: '/mypage' },
  ],
};
