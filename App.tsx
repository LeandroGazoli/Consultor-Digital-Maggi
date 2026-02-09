
import React, { useState, useEffect, useRef } from 'react';
import { AppView, Vehicle, Appointment } from './types';
import Layout from './components/Layout';
import SpecificationDoc from './components/SpecificationDoc';
import { MOCK_VEHICLES, UNITS } from './constants';
import { 
  Search, MessageCircle, Phone, MapPin, ChevronRight, 
  Calendar as CalendarIcon, ChevronLeft, Sparkles, Car, 
  Tag, FileText, CircleDollarSign, Users2, ArrowRight, 
  Heart, Store, Send, Loader2, ExternalLink, CarFront, ShieldCheck, Newspaper
} from 'lucide-react';
import { getFastVehicleRecommendation, startMaggiChat, getUnitsWithMaps } from './services/geminiService';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>(AppView.HOME);
  const [userProfileInput, setUserProfileInput] = useState('');
  const [fastRec, setFastRec] = useState('');
  const [isFastLoading, setIsFastLoading] = useState(false);
  
  const [chatMessages, setChatMessages] = useState<{role: 'user'|'model', text: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [mapsData, setMapsData] = useState<{text: string, links: any[]}>({text: '', links: []});
  const [isMapsLoading, setIsMapsLoading] = useState(false);

  useEffect(() => {
    if (activeView === AppView.UNITS && !mapsData.text) {
      handleLoadMaps();
    }
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeView, chatMessages, mapsData]);

  const handleFastAsk = async () => {
    if (!userProfileInput) return;
    setIsFastLoading(true);
    const rec = await getFastVehicleRecommendation(userProfileInput);
    setFastRec(rec);
    setIsFastLoading(false);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const newMessages = [...chatMessages, { role: 'user' as const, text: chatInput }];
    setChatMessages(newMessages);
    setChatInput('');
    setIsChatLoading(true);
    const response = await startMaggiChat(newMessages);
    setChatMessages([...newMessages, { role: 'model' as const, text: response || 'Desculpe, tive um problema.' }]);
    setIsChatLoading(false);
  };

  const handleLoadMaps = async () => {
    setIsMapsLoading(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const data = await getUnitsWithMaps(pos.coords.latitude, pos.coords.longitude);
      setMapsData(data);
      setIsMapsLoading(false);
    }, async () => {
      const data = await getUnitsWithMaps();
      setMapsData(data);
      setIsMapsLoading(false);
    });
  };

  const actions = [
    { label: 'Revisão', icon: CalendarIcon, color: 'text-[#0071C2]', bgColor: 'bg-blue-50', view: AppView.SCHEDULE },
    { label: 'Estoque', icon: Car, color: 'text-[#0071C2]', bgColor: 'bg-blue-50', view: AppView.STOCK },
    { label: 'Veículo', icon: CarFront, color: 'text-[#0071C2]', bgColor: 'bg-blue-50', view: AppView.MY_VEHICLE },
    { label: 'Ofertas', icon: Tag, color: 'text-[#f89a1e]', bgColor: 'bg-orange-50', view: AppView.HOME },
    { label: 'Financiar', icon: CircleDollarSign, color: 'text-[#0071C2]', bgColor: 'bg-blue-50' },
    { label: 'Consórcio', icon: Users2, color: 'text-[#0071C2]', bgColor: 'bg-blue-50' },
    { label: 'Lojas', icon: Store, color: 'text-[#0071C2]', bgColor: 'bg-blue-50', view: AppView.UNITS },
    { label: 'Novidades', icon: Newspaper, color: 'text-cyan-600', bgColor: 'bg-cyan-50', view: AppView.HOME },
  ];

  const renderHome = () => (
    <div className="space-y-10 p-6 animate-in fade-in duration-500">
      <div className="relative group mx-1">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="O que você busca hoje?" 
          className="w-full pl-14 pr-6 py-5 bg-white border border-gray-100 rounded-[2.2rem] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0071C2]/5 text-sm font-medium transition-all"
        />
      </div>

      {/* Grid de Ações Rápidas - Aproveitamento Máximo de Box */}
      <div className="space-y-6">
        {/* Primeiras duas linhas de 3 */}
        <div className="grid grid-cols-3 gap-5">
          {actions.slice(0, 6).map((action, i) => (
            <button 
              key={i}
              onClick={() => action.view ? setActiveView(action.view) : null}
              className="flex flex-col items-center justify-center p-4 bg-white border border-gray-100/50 rounded-[3.2rem] shadow-sm hover:shadow-xl hover:border-blue-100 transition-all active:scale-95 group min-h-[145px]"
            >
              <div className={`w-22 h-22 rounded-[2.5rem] flex items-center justify-center mb-3 transition-all ${action.bgColor} ${action.color} group-hover:scale-105 shadow-inner`}>
                <action.icon size={38} strokeWidth={2.2} />
              </div>
              <span className="text-[10px] font-black text-gray-600 text-center uppercase tracking-tight leading-none px-1">
                {action.label}
              </span>
            </button>
          ))}
        </div>
        
        {/* Última linha de 2 (Destaque Ampliado) */}
        <div className="grid grid-cols-2 gap-5">
          {actions.slice(6, 8).map((action, i) => (
            <button 
              key={i}
              onClick={() => action.view ? setActiveView(action.view) : null}
              className="flex flex-col items-center justify-center p-6 bg-white border border-gray-100/50 rounded-[3.5rem] shadow-sm hover:shadow-xl hover:border-blue-100 transition-all active:scale-95 group min-h-[160px]"
            >
              <div className={`w-28 h-28 rounded-[2.8rem] flex items-center justify-center mb-4 transition-all ${action.bgColor} ${action.color} group-hover:scale-105 shadow-inner`}>
                <action.icon size={46} strokeWidth={2.2} />
              </div>
              <span className="text-[13px] font-black text-gray-700 text-center uppercase tracking-[0.18em] leading-none">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Assistente Maggi AI */}
      <div className="bg-[#0071C2] p-10 rounded-[4rem] text-white shadow-2xl relative overflow-hidden mx-1">
        <div className="absolute -top-10 -right-10 opacity-10"><Sparkles size={180} /></div>
        <div className="relative z-10">
            <h3 className="text-xs font-black flex items-center gap-3 uppercase tracking-[0.4em]">
                <Sparkles size={16} className="text-[#f89a1e]" /> Assistente Maggi
            </h3>
            <div className="mt-8 flex gap-3">
                <input 
                  value={userProfileInput}
                  onChange={(e) => setUserProfileInput(e.target.value)}
                  placeholder="Preciso de ajuda com..."
                  className="flex-1 bg-white/10 border border-white/20 rounded-[1.8rem] px-8 py-5 text-sm focus:outline-none placeholder:text-blue-100/40"
                />
                <button onClick={handleFastAsk} disabled={isFastLoading} className="bg-[#f89a1e] p-5 rounded-[1.5rem] shadow-xl active:scale-90 transition-transform">
                  {isFastLoading ? <Loader2 className="animate-spin" size={24} /> : <ChevronRight size={24} />}
                </button>
            </div>
            {fastRec && (
                <div className="mt-8 p-7 bg-white/10 rounded-[3rem] animate-in slide-in-from-top-4 border border-white/5 shadow-inner">
                    <p className="text-sm font-medium leading-relaxed italic opacity-95">"{fastRec}"</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );

  const renderMyVehicle = () => (
    <div className="p-8 space-y-8 animate-in fade-in h-full bg-white rounded-t-[4rem] mt-6 min-h-[85vh] shadow-inner">
      <div className="flex justify-between items-center px-4">
        <h2 className="text-3xl font-black text-[#0a1d37] uppercase tracking-tighter">Meu Veículo</h2>
        <div className="p-3 bg-blue-50 rounded-2xl text-[#0071C2]"><CarFront size={32} /></div>
      </div>
      <div className="bg-gray-50/50 p-12 rounded-[4rem] border border-gray-100 flex flex-col items-center text-center">
        <div className="w-28 h-28 bg-white rounded-[2.5rem] flex items-center justify-center shadow-xl mb-10">
          <ShieldCheck size={56} className="text-[#0071C2]" />
        </div>
        <h3 className="text-2xl font-black text-[#0a1d37] uppercase mb-4 leading-tight">Mantenha seu Maggi Novo</h3>
        <p className="text-sm text-gray-400 font-medium mb-12 leading-relaxed px-8 italic">Cadastre seu veículo para gerenciar revisões e garantir o melhor valor de revenda com histórico oficial.</p>
        <button className="w-full bg-[#0071C2] text-white py-7 rounded-[2.5rem] font-black uppercase tracking-[0.25em] text-[11px] shadow-2xl active:scale-95 transition-all">
          Adicionar Veículo
        </button>
      </div>
    </div>
  );

  const renderChat = () => (
    <div className="flex flex-col h-full bg-white rounded-t-[4rem] mt-6 shadow-inner">
      <div className="p-12 border-b border-gray-50 flex justify-between items-center">
        <h2 className="text-2xl font-black text-[#0a1d37] uppercase tracking-tighter">MaggiBot AI</h2>
        <div className="flex gap-1.5 items-center">
          <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
          <Sparkles className="text-[#0071C2]" size={24} />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-10 space-y-8">
        {chatMessages.length === 0 && (
          <div className="text-center py-24 opacity-20">
            <div className="w-24 h-24 bg-gray-100 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-inner">
                <MessageCircle size={48} className="text-gray-400" />
            </div>
            <p className="font-black text-2xl uppercase tracking-[0.2em]">Consultor Digital</p>
            <p className="text-[10px] font-black mt-3 tracking-widest uppercase">Estamos online para você</p>
          </div>
        )}
        {chatMessages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-7 rounded-[2.5rem] text-sm leading-relaxed shadow-sm ${
              m.role === 'user' ? 'bg-[#0071C2] text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200/50'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isChatLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-7 rounded-[2.5rem] rounded-tl-none border border-gray-200/50"><Loader2 className="animate-spin text-[#0071C2]" size={24} /></div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <div className="p-10 border-t border-gray-50 bg-white">
        <div className="flex gap-4">
          <input 
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Pergunte ao especialista..."
            className="flex-1 bg-gray-50 border border-gray-100 rounded-[2rem] px-8 py-5 focus:outline-none focus:ring-1 focus:ring-[#0071C2]/20 shadow-inner"
          />
          <button onClick={handleSendMessage} className="bg-[#0071C2] text-white p-6 rounded-[1.8rem] shadow-xl active:scale-90 transition-transform">
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderUnits = () => (
    <div className="p-8 space-y-10 animate-in fade-in h-full bg-white rounded-t-[4rem] shadow-inner mt-6 min-h-[85vh]">
        <div className="flex justify-between items-center px-4">
            <h2 className="text-3xl font-black text-[#0a1d37] uppercase tracking-tighter">Lojas Maggi</h2>
            <div className="p-3 bg-blue-50 rounded-2xl text-[#0071C2]"><MapPin size={32} /></div>
        </div>
        {isMapsLoading ? (
          <div className="flex flex-col items-center py-32 gap-8 opacity-30">
            <Loader2 className="animate-spin" size={64} />
            <p className="font-black uppercase text-[11px] tracking-[0.4em]">Sincronizando unidades...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {mapsData.text && (
              <div className="p-10 bg-blue-50/40 rounded-[3rem] border border-blue-50 text-sm leading-relaxed text-gray-600 italic shadow-sm">
                {mapsData.text}
              </div>
            )}
            {UNITS.map((unit, i) => (
                <div key={i} className="bg-white p-8 rounded-[3rem] border border-gray-100 flex items-center justify-between shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-[0.98]">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center text-[#0071C2] font-black text-3xl shadow-inner">{unit.charAt(0)}</div>
                        <div>
                            <p className="text-lg font-black text-[#0a1d37] uppercase tracking-tight">{unit}</p>
                            <p className="text-[10px] text-green-500 font-black uppercase tracking-widest mt-2 flex items-center gap-2">
                              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Aberto agora
                            </p>
                        </div>
                    </div>
                    <div className="p-6 bg-blue-50 rounded-[1.8rem] text-[#0071C2] active:scale-90 transition-transform shadow-sm"><Phone size={24} /></div>
                </div>
            ))}
          </div>
        )}
    </div>
  );

  const renderContent = () => {
    switch (activeView) {
      case AppView.HOME: return renderHome();
      case AppView.CHAT: return renderChat();
      case AppView.MY_VEHICLE: return renderMyVehicle();
      case AppView.UNITS: return renderUnits();
      case AppView.PROFILE: return <div className="p-24 text-center font-black opacity-10 text-[11px] tracking-[0.6em] uppercase">Área Exclusiva Maggi</div>;
      case AppView.SCHEDULE: return <div className="p-24 text-center font-black opacity-10 text-[11px] tracking-[0.6em] uppercase">Gestão de Agendamentos</div>;
      case AppView.SPEC: return <SpecificationDoc />;
      default: return renderHome();
    }
  };

  return (
    <Layout activeView={activeView} setActiveView={setActiveView}>
      {renderContent()}
    </Layout>
  );
};

export default App;
