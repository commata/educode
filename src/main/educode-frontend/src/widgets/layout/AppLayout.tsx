import { Outlet } from 'react-router-dom';
import { Header } from '@/widgets/layout/Header';
import { Sidebar } from '@/widgets/layout/Sidebar';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-[1600px]">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
