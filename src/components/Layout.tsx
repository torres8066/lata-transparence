import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Wrench, FilePlus, NotebookTabs } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col md:flex-row font-sans">
      {/* Sidebar for Desktop / Top Nav for Mobile */}
      <nav className="bg-neutral-900 text-white w-full md:w-64 flex flex-col pt-6 md:min-h-screen md:sticky md:top-0 border-b md:border-b-0 md:border-r border-neutral-800 z-10">
        <div className="px-6 pb-6 flex items-center gap-4 border-b border-neutral-800">
          <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center font-bold text-xl tracking-tighter shadow-lg shadow-orange-600/20">
            LG
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight leading-none text-neutral-100">LATA Garage</h1>
            <span className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest mt-1 block">Espace Atelier</span>
          </div>
        </div>
        
        <div className="flex px-4 py-4 md:flex-col gap-2 overflow-x-auto scoldbar-hide">
          <NavLink to="/" icon={<NotebookTabs size={20} />} label="Dossiers Clients" active={location.pathname === "/"} />
          <NavLink to="/nouveau" icon={<FilePlus size={20} />} label="Nouveau Rapport" active={location.pathname === "/nouveau"} />
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}

function NavLink({ to, icon, label, active }: { to: string, icon: React.ReactNode, label: string, active: boolean }) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm whitespace-nowrap",
        active 
          ? "bg-neutral-800 text-orange-400 shadow-sm border border-neutral-700/50" 
          : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
      )}
    >
      {icon}
      {label}
    </Link>
  );
}
