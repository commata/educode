import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage } from '@/pages/auth/LoginPage';
import { SignupPage } from '@/pages/auth/SignupPage';
import { StudentDashboardPage } from '@/pages/student/StudentDashboardPage';
import { EducatorDashboardPage } from '@/pages/educator/EducatorDashboardPage';
import { ClassroomDetailPage } from '@/pages/classrooms/ClassroomDetailPage';
import { ProblemCreatePage } from '@/pages/problems/ProblemCreatePage';
import { AssignmentWorkspacePage } from '@/pages/assignments/AssignmentWorkspacePage';
import { AssignmentStatusPage } from '@/pages/assignments/AssignmentStatusPage';
import { MyPage } from '@/pages/common/MyPage';
import { NotFoundPage } from '@/pages/common/NotFoundPage';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { RoleRoute } from '@/routes/RoleRoute';
import { AppLayout } from '@/widgets/layout/AppLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: '/mypage',
            element: <MyPage />,
          },
          {
            element: <RoleRoute allowedRoles={['STUDENT']} />,
            children: [
              {
                path: '/student/dashboard',
                element: <StudentDashboardPage />,
              },
              {
                path: '/assignments/:assignmentId/workspace',
                element: <AssignmentWorkspacePage />,
              },
            ],
          },
          {
            element: <RoleRoute allowedRoles={['EDUCATOR']} />,
            children: [
              {
                path: '/educator/dashboard',
                element: <EducatorDashboardPage />,
              },
              {
                path: '/problems/new',
                element: <ProblemCreatePage />,
              },
              {
                path: '/assignments/:assignmentId/status',
                element: <AssignmentStatusPage />,
              },
            ],
          },
          {
            path: '/classrooms/:classroomId',
            element: <ClassroomDetailPage />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
