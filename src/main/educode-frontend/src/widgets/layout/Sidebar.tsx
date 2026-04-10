import { NavLink } from 'react-router-dom';
import { NAV_BY_ROLE } from '@/shared/constants/nav';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/shared/lib/cn';

export function Sidebar() {
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  return (
    <aside className="hidden w-64 border-r border-slate-200 bg-white px-4 py-6 lg:block">
      <nav className="space-y-2">
        {NAV_BY_ROLE[user.role].map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'block rounded-xl px-4 py-3 text-sm font-medium transition',
                isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100',
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
