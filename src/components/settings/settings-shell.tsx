import { NavLink } from 'react-router-dom';
import { Link2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const SETTINGS_NAV = [
  { to: '/settings/broker', label: 'Broker Connections', icon: Link2 },
];

interface Props {
  children: React.ReactNode;
}

export function SettingsShell({ children }: Props) {
  return (
    <div className="flex gap-8">
      <aside className="w-48 shrink-0">
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Settings
        </p>
        <nav className="flex flex-col gap-1">
          {SETTINGS_NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
