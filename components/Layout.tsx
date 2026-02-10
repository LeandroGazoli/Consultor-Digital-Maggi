
import React from 'react';
import { AppView } from '../types';
import { Home, User, MessageSquare, Calendar } from 'lucide-react';

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
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-2xl overflow-hidden relative border-x border-gray-200">
      {/* Header Institucional */}
      <header className="bg-white border-b border-gray-50 px-6 py-6 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center cursor-pointer" onClick={() => setActiveView(AppView.HOME)}>
          <svg width="150" height="46" viewBox="0 0 320 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M135 68C126.5 76 113.5 82 98 82C66 82 40 56 40 24C40 -8 66 -34 98 -34C114 -34 128 -27 138 -16" 
                  stroke="#0071C2" strokeWidth="15" strokeLinecap="round" transform="translate(0, 26)" />
            <text x="68" y="74" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="62" fill="#0071C2" style={{ letterSpacing: '-0.05em' }}>MAGGI</text>
            <text x="175" y="18" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="21" fill="#0071C2" style={{ letterSpacing: '0.12em' }}>EMPRESAS</text>
          </svg>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-32 bg-[#fcfdfe]">
        {children}
      </main>

      {/* Bottom Navigation - Ultra Clean & Integrated */}
      <nav className="fixed bottom-0 left-0 right-0 md:relative bg-white/95 backdrop-blur-2xl border-t border-gray-100 safe-area-bottom z-50 max-w-md mx-auto shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
        <div className="grid grid-cols-4 w-full py-4 px-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex flex-col items-center justify-center transition-all duration-300 group ${
                  isActive ? 'text-[#0071C2]' : 'text-gray-400'
                }`}
              >
                <div className={`transition-all duration-300 ${isActive ? 'scale-110' : 'group-active:scale-90'}`}>
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 1.8} />
                </div>
                
                <span className={`mt-1 text-[9px] font-bold tracking-[0.1em] leading-tight transition-all duration-300 uppercase text-center ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
