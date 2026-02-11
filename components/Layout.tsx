
import React from 'react';
import { AppView } from '../types';
import { Home, User, MessageSquare, Calendar, Bell } from 'lucide-react';
import { COLORS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  activeView: AppView;
  setActiveView: (view: AppView) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView }) => {
  const navItems = [
    { id: AppView.HOME, icon: Home, label: 'Início' },
    { id: AppView.SCHEDULE, icon: Calendar, label: 'Serviços' },
    { id: AppView.CHAT, icon: MessageSquare, label: 'Chat' },
    { id: AppView.PROFILE, icon: User, label: 'Perfil' },
  ];

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-2xl overflow-hidden relative border-x border-gray-100">
      {/* Header: Fundo Azul, Logo Branco */}
      <header className="bg-[#1473e6] px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <div className="flex items-center cursor-pointer transition-transform active:scale-95" onClick={() => setActiveView(AppView.HOME)}>
          <svg width="120" height="34" viewBox="0 0 320 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M135 68C126.5 76 113.5 82 98 82C66 82 40 56 40 24C40 -8 66 -34 98 -34C114 -34 128 -27 138 -16" 
                  stroke="white" strokeWidth="15" strokeLinecap="round" transform="translate(0, 26)" />
            <text x="68" y="74" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="62" fill="white" style={{ letterSpacing: '-0.05em' }}>MAGGI</text>
            <text x="175" y="18" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="21" fill="white" style={{ letterSpacing: '0.12em' }}>EMPRESAS</text>
          </svg>
        </div>
        <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white/80 border border-white/20 active:scale-90 transition-all hover:bg-white/20">
                <Bell size={18} />
            </button>
            <button 
                onClick={() => setActiveView(AppView.PROFILE)}
                className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#1473e6] active:scale-90 transition-all shadow-sm"
            >
                <User size={18} />
            </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-[#fafafa]">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 md:relative bg-white border-t border-gray-100 safe-area-bottom z-50 max-w-md mx-auto shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <div className="grid grid-cols-4 w-full py-3 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex flex-col items-center justify-center transition-all duration-200 group relative ${
                  isActive ? 'text-[#1473e6]' : 'text-gray-400'
                }`}
              >
                <div className={`transition-all duration-200 ${isActive ? 'scale-110' : 'group-active:scale-90'}`}>
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={`mt-1 text-[9px] font-bold transition-all duration-200 uppercase ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                  {item.label}
                </span>
                {isActive && (
                    <div className="absolute -bottom-3 w-1 h-1 bg-[#1473e6] rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
