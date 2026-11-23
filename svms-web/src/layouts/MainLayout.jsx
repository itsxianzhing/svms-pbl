import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LogOut, X } from 'lucide-react';
import { navigation } from '@/config/navigation';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '@/components/ui/Avatar';
import { useEffect, useRef, useState } from 'react';

function Brand() { return <div className="flex items-center gap-3 px-2 py-2"><span className="flex size-10 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white">S</span><span className="text-lg font-semibold tracking-tight text-slate-900">SVMS</span></div>; }
function MenuContent({ user, logout, close = () => {} }) { return <><div className="flex items-center justify-between"><Brand /><button className="flex size-11 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 lg:hidden" aria-label="Tutup menu" onClick={close}><X size={20} /></button></div><nav className="mt-8 space-y-1">{navigation.filter((n) => n.roles.includes(user.role)).map((n) => { const I = n.icon; return <NavLink key={n.path} to={n.path} onClick={close} className={({ isActive }) => `relative flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm transition motion-reduce:transition-none ${isActive ? 'bg-indigo-50 font-medium text-indigo-700 before:absolute before:-left-4 before:h-6 before:w-1 before:rounded-r-full before:bg-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}><I size={18} />{n.label}</NavLink>; })}</nav><div className="mt-auto border-t border-slate-100 pt-4"><div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3"><Avatar name={user.name} className="size-9" /><div className="min-w-0"><p className="truncate text-sm font-medium text-slate-900">{user.name}</p><p className="text-xs text-slate-500">{user.role}</p></div></div><button onClick={logout} className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm text-slate-600 hover:bg-rose-50 hover:text-rose-700"><LogOut size={18} />Keluar</button></div></>; }
function MobileNavigation({ user }) {
  const items = navigation.filter((item) => item.roles.includes(user.role));
  return <nav className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-3 right-3 z-30 rounded-full border border-slate-200/90 bg-white/95 px-2.5 py-2 shadow-[0_8px_30px_rgb(15_23_42_/_0.14)] backdrop-blur lg:hidden" aria-label="Navigasi utama">
    <div className="mx-auto flex max-w-md items-stretch justify-around gap-1">
      {items.map((item) => { const Icon = item.icon; return <NavLink key={item.path} to={item.path} end={item.path === '/'} className={({ isActive }) => `flex min-h-12 min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[11px] font-medium transition motion-reduce:transition-none ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}>
        {({ isActive }) => <><Icon size={19} strokeWidth={isActive ? 2.5 : 2} /><span className="max-w-full truncate">{item.label}</span></>}
      </NavLink>; })}
    </div>
  </nav>;
}
export function MainLayout() {
  const { user, logout } = useAuth(); const loc = useLocation(); const item = navigation.find((x) => loc.pathname.startsWith(x.path)); const [profileOpen, setProfileOpen] = useState(false); const profileRef = useRef(null);
  useEffect(() => {
    if (!profileOpen) return undefined;
    const closeOnOutsideClick = (event) => { if (!profileRef.current?.contains(event.target)) setProfileOpen(false); };
    const closeOnEscape = (event) => { if (event.key === 'Escape') setProfileOpen(false); };
    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => { document.removeEventListener('pointerdown', closeOnOutsideClick); document.removeEventListener('keydown', closeOnEscape); };
  }, [profileOpen]);
  return <div className="min-h-dvh lg:flex"><aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-slate-200/80 bg-white p-4 lg:flex"><MenuContent user={user} logout={logout} /></aside><section className="min-w-0 flex-1"><header className="sticky top-0 z-40 flex min-h-16 items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur sm:px-6"><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-900">{item?.label || 'SVMS'}</p><p className="hidden text-xs text-slate-500 sm:block">Kelola aktivitas Anda dengan rapi</p></div><div className="flex items-center gap-3" ref={profileRef}><button type="button" className="flex size-11 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 sm:hidden" aria-label="Buka menu profil" aria-expanded={profileOpen} aria-haspopup="menu" onClick={() => setProfileOpen((open) => !open)}><Avatar name={user.name} className="size-9" /></button><div className="hidden items-center gap-3 sm:flex"><Avatar name={user.name} className="size-9" /><div className="text-right"><p className="text-sm font-medium text-slate-900">{user.name}</p><p className="text-xs font-medium text-slate-500">{user.role}</p></div></div>{profileOpen && <div className="absolute right-4 top-[calc(100%+0.5rem)] z-50 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl sm:hidden" role="menu"><div className="border-b border-slate-100 px-3 py-2"><p className="truncate text-sm font-medium text-slate-900">{user.name}</p><p className="text-xs text-slate-500">{user.role}</p></div><button type="button" role="menuitem" onClick={logout} className="mt-2 flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-rose-700 transition hover:bg-rose-50 focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"><LogOut size={18} aria-hidden="true" />Keluar</button></div>}</div></header><main className="page-enter mx-auto min-w-0 max-w-6xl p-4 pb-[calc(6rem+env(safe-area-inset-bottom))] sm:p-6 sm:pb-[calc(6rem+env(safe-area-inset-bottom))] lg:p-8 lg:pb-8"><Outlet /></main></section><MobileNavigation user={user} /></div>;
}
