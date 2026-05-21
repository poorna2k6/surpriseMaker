import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  House,
  Images,
  Calendar,
  Heart,
  Film,
  BookOpen,
  Download,
} from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import InstallButton from '../pwa/InstallButton';

const NAV_ITEMS = [
  { label: 'Home',      icon: House,     path: '/' },
  { label: 'Memories',  icon: Images,    path: '/memories' },
  { label: 'Timeline',  icon: Calendar,  path: '/timeline' },
  { label: 'Messages',  icon: Heart,     path: '/messages' },
  { label: 'Video',     icon: Film,      path: '/video' },
  { label: 'Album',     icon: BookOpen,  path: '/album' },
  { label: 'Output',    icon: Download,  path: '/output' },
];

function NavItem({ item, active, mobile }) {
  const Icon = item.icon;

  if (mobile) {
    return (
      <Link
        to={item.path}
        className={clsx(
          'flex flex-col items-center justify-center gap-0.5 flex-1 py-2 transition-all duration-200',
          active ? 'opacity-100' : 'opacity-50 hover:opacity-75'
        )}
      >
        <Icon
          size={20}
          className={clsx(
            'transition-colors duration-200',
            active ? 'text-pink-400' : 'text-purple-300'
          )}
        />
        <span
          className={clsx(
            'text-[10px] font-medium leading-none transition-all duration-200',
            active ? 'gradient-text' : 'text-purple-300'
          )}
        >
          {item.label}
        </span>
        {active && (
          <motion.div
            layoutId="mobile-active-dot"
            className="absolute bottom-1.5 w-1 h-1 rounded-full bg-pink-400"
          />
        )}
      </Link>
    );
  }

  // Desktop sidebar item
  return (
    <Link
      to={item.path}
      className={clsx(
        'relative flex items-center gap-3 px-4 py-3 rounded-xl mx-2 transition-all duration-200 group',
        active
          ? 'glass text-purple-100'
          : 'text-purple-300 hover:text-purple-100 hover:bg-white/5'
      )}
    >
      {active && (
        <motion.div
          layoutId="sidebar-active-bg"
          className="absolute inset-0 rounded-xl glass"
          style={{ zIndex: 0 }}
        />
      )}
      <Icon
        size={20}
        className={clsx(
          'relative z-10 transition-colors duration-200 flex-shrink-0',
          active ? 'text-pink-400' : 'text-purple-400 group-hover:text-purple-200'
        )}
      />
      <span
        className={clsx(
          'relative z-10 text-sm font-medium transition-colors duration-200',
          active ? 'gradient-text' : ''
        )}
      >
        {item.label}
      </span>
      {active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-gradient-to-b from-pink-400 to-purple-500 rounded-full" />
      )}
    </Link>
  );
}

export function AppLayout() {
  const location = useLocation();

  const isActive = (path) =>
    path === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(path);

  return (
    <div className="min-h-dvh" style={{ background: '#0d0618' }}>
      {/* ── Desktop sidebar ───────────────────────────────────────────────── */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-60 flex-col z-40 glass border-r border-purple-900/40">
        {/* App name / logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-purple-900/30">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center glow-rose flex-shrink-0">
            <Heart size={18} className="text-white fill-white animate-heartbeat" />
          </div>
          <div>
            <p className="font-display text-base font-semibold text-purple-100 leading-tight">
              Anniversary
            </p>
            <p className="text-[11px] text-purple-400 leading-tight">Studio</p>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 pt-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.path}
              item={item}
              active={isActive(item.path)}
              mobile={false}
            />
          ))}
        </nav>

        {/* Install button at bottom */}
        <div className="px-4 pb-6 pt-3 border-t border-purple-900/30">
          <InstallButton size="sm" variant="ghost" showLabel={true} />
        </div>
      </aside>

      {/* ── Main content area ─────────────────────────────────────────────── */}
      <main className="lg:ml-60 min-h-dvh safe-bottom-nav lg:safe-bottom">
        <Outlet />
      </main>

      {/* ── Mobile bottom navigation ──────────────────────────────────────── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-purple-900/40 safe-bottom">
        <div className="flex items-stretch relative">
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.path}
              item={item}
              active={isActive(item.path)}
              mobile={true}
            />
          ))}
        </div>
      </nav>
    </div>
  );
}

export default AppLayout;
