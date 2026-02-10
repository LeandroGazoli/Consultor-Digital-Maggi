
import React, { useState, useEffect, useRef } from 'react';
import { AppView, Vehicle, Appointment, Campaign, Unit } from './types';
import Layout from './components/Layout';
import SpecificationDoc from './components/SpecificationDoc';
import { MOCK_VEHICLES, UNITS, SERVICES, MOCK_CAMPAIGNS, MOCK_UNITS, BRANDS } from './constants';
import { 
  Search, MessageCircle, Phone, MapPin, ChevronRight, 
  Calendar as CalendarIcon, Sparkles, Car, 
  Tag, CircleDollarSign, Users2, ArrowRight, 
  Heart, Store, Send, Loader2, ExternalLink, CarFront, ShieldCheck, Newspaper,
  History, Award, Zap, Wrench, Target, Eye, Star, Clock, CheckCircle2, Filter, Info,
  Flame, Gift, PiggyBank, HandCoins, ShieldEllipsis, BadgePercent, Navigation,
  User, Settings, LogOut, Bell, FileText, Quote, Trophy, Rocket, Briefcase,
  SearchCode, Fingerprint, Bike, Truck, Tractor, Home as HomeIcon, Landmark, X,
  Droplets, Activity, Hammer, RefreshCw, AlertCircle, ChevronLeft
} from 'lucide-react';
import { getFastVehicleRecommendation, startMaggiChat, getUnitsWithMaps } from './services/geminiService';

type DnaType = 'mission' | 'vision' | 'values' | null;
type SchedulingStep = 'LIST' | 'DATES' | 'QUESTIONS' | 'SUCCESS';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>(AppView.HOME);
  const [userProfileInput, setUserProfileInput] = useState('');
  const [fastRec, setFastRec] = useState('');
  const [isFastLoading, setIsFastLoading] = useState(false);
  const [userNps, setUserNps] = useState<number | null>(null);
  const [npsSubmitted, setNpsSubmitted] = useState(false);
  
  const [chatMessages, setChatMessages] = useState<{role: 'user'|'model', text: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  
  const [consortiumGroup, setConsortiumGroup] = useState('');
  const [consortiumQuota, setConsortiumQuota] = useState('');
  const [isConsortiumLoading, setIsConsortiumLoading] = useState(false);
  
  const [selectedDna, setSelectedDna] = useState<DnaType>(null);

  // Estados de Agendamento/Serviços/Ofertas
  const [currentUnit, setCurrentUnit] = useState<Unit>(MOCK_UNITS[0]);
  const [schedulingStep, setSchedulingStep] = useState<SchedulingStep>('LIST');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [proposedDates, setProposedDates] = useState<string[]>(['', '', '']);
  const [revQuestionnaire, setRevQuestionnaire] = useState({ plate: '', km: '', obs: '' });
  const [isChangingUnit, setIsChangingUnit] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const diffScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleFastAsk = async () => {
    if (!userProfileInput) return;
    setIsFastLoading(true);
    const rec = await getFastVehicleRecommendation(userProfileInput);
    setFastRec(rec);
    setIsFastLoading(false);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return;
    const userMsg = chatInput.trim();
    const newMessages = [...chatMessages, { role: 'user' as const, text: userMsg }];
    setChatMessages(newMessages);
    setChatInput('');
    setIsChatLoading(true);
    try {
      const response = await startMaggiChat(newMessages);
      setChatMessages([...newMessages, { role: 'model' as const, text: response || 'Desculpe, tive um problema.' }]);
    } catch (e) {
      setChatMessages([...newMessages, { role: 'model' as const, text: 'Ops! O MaggiBot está descansando. Tente em instantes.' }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleConsortiumAccess = () => {
    if (!consortiumGroup || !consortiumQuota) return;
    setIsConsortiumLoading(true);
    setTimeout(() => {
      setIsConsortiumLoading(false);
      alert(`Acessando informações da Cota ${consortiumQuota} no Grupo ${consortiumGroup}...`);
    }, 1500);
  };

  const openWhatsApp = (msg: string) => {
    const url = `https://wa.me/5511999999999?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const handleNpsSubmit = (score: number) => {
    setUserNps(score);
    setNpsSubmitted(true);
    setTimeout(() => setNpsSubmitted(false), 3000);
  };

  const scrollDifferentials = () => {
    if (diffScrollRef.current) {
      const container = diffScrollRef.current;
      const scrollAmount = 180;
      const isAtEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 10;
      if (isAtEnd) container.scrollTo({ left: 0, behavior: 'smooth' });
      else container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const dnaContent = {
    mission: {
      title: 'Nossa Missão',
      icon: Target,
      text: 'Prover as melhores soluções de mobilidade, superando as expectativas de nossos clientes através de um atendimento de excelência e confiança.'
    },
    vision: {
      title: 'Nossa Visão',
      icon: Eye,
      text: 'Ser o grupo de concessionárias mais admirado do Brasil, liderando a transformação do setor automotivo com inovação e sustentabilidade.'
    },
    values: {
      title: 'Nossos Valores',
      icon: Award,
      text: 'Ética Absoluta em todos os negócios, Foco total no Cliente, Inovação constante nos processos e valorização da nossa Gente Maggi.'
    }
  };

  const renderDnaModal = () => {
    if (!selectedDna) return null;
    const content = dnaContent[selectedDna];
    const Icon = content.icon;

    return (
      <div className="fixed inset-0 z-[100] flex items-end justify-center animate-in fade-in duration-300">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedDna(null)} />
        <div className="relative bg-white w-full max-md rounded-t-[3rem] p-10 shadow-2xl animate-in slide-in-from-bottom-20 duration-500">
          <button 
            onClick={() => setSelectedDna(null)}
            className="absolute top-8 right-8 p-3 bg-gray-50 rounded-full text-gray-400 active:scale-90 transition-transform"
          >
            <X size={20} />
          </button>
          
          <div className="space-y-6">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-[#0071C2]">
              <Icon size={32} />
            </div>
            <div>
              <h3 className="text-xl font-black text-[#0a1d37] uppercase tracking-tighter mb-4">{content.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-medium italic">"{content.text}"</p>
            </div>
            <div className="pt-4">
              <button 
                onClick={() => setSelectedDna(null)}
                className="w-full bg-[#0071C2] text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em]"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderHome = () => (
    <div className="space-y-8 p-6 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center px-0.5">
        <div>
          <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Bem-vindo à</h2>
          <h1 className="text-2xl font-black text-[#0a1d37] tracking-tighter">Experiência Maggi</h1>
        </div>
      </div>

      <div className="relative h-56 w-full rounded-[2.5rem] overflow-hidden shadow-2xl group cursor-pointer active:scale-[0.98] transition-all" onClick={() => setActiveView(AppView.OFFERS)}>
        <img 
          src="https://images.unsplash.com/photo-1617469767053-d3b508a0d182?q=80&w=1200&auto=format&fit=crop" 
          alt="BYD Dolphin Mini" 
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1d37]/90 via-[#0a1d37]/20 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <span className="bg-[#f89a1e] text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest mb-2 inline-block shadow-lg">Lançamento</span>
          <h2 className="text-xl font-black text-white uppercase tracking-tight leading-tight">BYD Dolphin Mini<br/>O Futuro é Agora</h2>
          <p className="text-white/70 text-[10px] font-medium mt-1">Reserve o seu com bônus de R$ 5.000,00</p>
        </div>
        <div className="absolute top-6 right-6 p-3 bg-white/20 backdrop-blur-md rounded-2xl text-white">
          <Zap size={20} />
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { label: 'Serviços', icon: CalendarIcon, color: 'text-[#0071C2]', view: AppView.SCHEDULE },
            { label: 'Carro Novo', icon: Car, color: 'text-[#0071C2]', view: AppView.STOCK },
            { label: 'Meu Carro', icon: CarFront, color: 'text-[#0071C2]', view: AppView.MY_VEHICLE },
            { label: 'Ofertas', icon: Tag, color: 'text-[#f89a1e]', view: AppView.OFFERS },
            { label: 'Financiar', icon: CircleDollarSign, color: 'text-[#0071C2]', action: () => openWhatsApp("Olá! Gostaria de uma simulação.") },
            { label: 'Consórcio', icon: Users2, color: 'text-[#0071C2]', view: AppView.CONSORTIUM },
          ].map((action, i) => (
            <button key={i} onClick={() => action.view ? setActiveView(action.view) : (action.action ? action.action() : null)} className="flex flex-col items-center justify-center py-6 px-2 bg-white border border-gray-50 rounded-2xl shadow-sm hover:border-blue-100 transition-all active:scale-95 group">
              <div className={`mb-2 transition-all ${action.color} group-hover:scale-110`}><action.icon size={22} strokeWidth={1.8} /></div>
              <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest text-center">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#0071C2] p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden mx-0.5">
        <div className="absolute -top-10 -right-10 opacity-5"><Sparkles size={160} /></div>
        <div className="relative z-10">
            <h3 className="text-[10px] font-black flex items-center gap-2.5 uppercase tracking-[0.3em]"><Sparkles size={14} className="text-[#f89a1e]" /> Assistente Maggi</h3>
            <div className="mt-6 flex gap-2.5">
                <input value={userProfileInput} onChange={(e) => setUserProfileInput(e.target.value)} placeholder="No que posso ajudar?" className="flex-1 bg-white/10 border border-white/10 rounded-xl px-6 py-4 text-sm focus:outline-none placeholder:text-blue-100/40" />
                <button onClick={handleFastAsk} disabled={isFastLoading} className="bg-[#f89a1e] p-4 rounded-xl shadow-lg active:scale-90 transition-transform">
                  {isFastLoading ? <Loader2 className="animate-spin" size={20} /> : <ChevronRight size={20} />}
                </button>
            </div>
            {fastRec && <div className="mt-6 p-5 bg-white/5 rounded-2xl border border-white/5 italic text-xs animate-in slide-in-from-top-2">"{fastRec}"</div>}
        </div>
      </div>

      <div className="space-y-4 px-0.5 relative group">
        <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.25em] pl-1">Por que a Maggi?</h3>
        <div className="relative">
          <button onClick={scrollDifferentials} className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg border border-gray-50 text-[#0071C2] active:scale-90 transition-all hover:bg-white">
            <ChevronRight size={20} strokeWidth={3} />
          </button>
          <div ref={diffScrollRef} className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x">
            {[
              { label: 'Tradição', desc: '+40 anos', icon: History },
              { label: 'Confiança', desc: 'Garantia real', icon: Award },
              { label: 'Agilidade', desc: 'Aprovação rápida', icon: Zap },
              { label: 'Qualidade', desc: 'Oficinas Maggi', icon: Wrench },
              { label: 'Missão', desc: 'Sua mobilidade', icon: Target },
            ].map((diff, i) => (
              <div key={i} className="min-w-[140px] snap-start p-5 bg-white border border-gray-50 rounded-2xl shadow-sm flex flex-col gap-3">
                <div className="text-[#0071C2]"><diff.icon size={20} /></div>
                <div>
                  <p className="text-[10px] font-black text-[#0a1d37] uppercase mb-1">{diff.label}</p>
                  <p className="text-[8px] text-gray-400 font-bold uppercase">{diff.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4 px-0.5">
        <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.25em] pl-1">Nosso DNA</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 bg-white border border-gray-50 rounded-2xl text-center cursor-pointer active:bg-gray-50 transition-colors" onClick={() => setSelectedDna('mission')}>
            <Target size={18} className="mx-auto mb-2 text-[#0071C2]" />
            <p className="text-[8px] font-black uppercase text-[#0a1d37]">Missão</p>
          </div>
          <div className="p-4 bg-white border border-gray-50 rounded-2xl text-center cursor-pointer active:bg-gray-50 transition-colors" onClick={() => setSelectedDna('vision')}>
            <Eye size={18} className="mx-auto mb-2 text-[#0071C2]" />
            <p className="text-[8px] font-black uppercase text-[#0a1d37]">Visão</p>
          </div>
          <div className="p-4 bg-white border border-gray-50 rounded-2xl text-center cursor-pointer active:bg-gray-50 transition-colors" onClick={() => setSelectedDna('values')}>
            <Award size={18} className="mx-auto mb-2 text-[#0071C2]" />
            <p className="text-[8px] font-black uppercase text-[#0a1d37]">Valores</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSchedule = () => {
    const servicesList = [
      { name: 'Revisão Periódica', icon: RefreshCw, desc: 'Mantenha sua garantia e segurança' },
      { name: 'Troca de Óleo', icon: Droplets, desc: 'Lubrificação e filtros em dia' },
      { name: 'Diagnóstico/Barulho', icon: Activity, desc: 'Identificação técnica de falhas' },
      { name: 'Recall', icon: AlertCircle, desc: 'Verificações gratuitas de fábrica' },
      { name: 'Funilaria/Pintura', icon: Hammer, desc: 'Estética e reparos estruturais' },
    ];

    const handleServiceClick = (service: string) => {
      setSelectedService(service);
      if (service === 'Revisão Periódica') {
        setSchedulingStep('DATES');
      } else {
        openWhatsApp(`Olá! Gostaria de agendar ${service} na unidade ${currentUnit.name}.`);
      }
    };

    const handleConfirmDates = () => {
      if (proposedDates.some(d => !d)) return;
      setSchedulingStep('QUESTIONS');
    };

    const handleFinalSubmit = () => {
      if (!revQuestionnaire.plate || !revQuestionnaire.km) return;
      setSchedulingStep('SUCCESS');
    };

    const resetFlow = () => {
      setSchedulingStep('LIST');
      setSelectedService(null);
      setProposedDates(['', '', '']);
      setRevQuestionnaire({ plate: '', km: '', obs: '' });
    };

    return (
      <div className="p-8 space-y-8 animate-in fade-in bg-white rounded-t-[3rem] mt-4 min-h-[85vh] pb-32">
        {schedulingStep === 'LIST' && (
          <>
            <div className="text-center space-y-3">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-[#0071C2]">
                <Wrench size={40} />
              </div>
              <h2 className="text-2xl font-black text-[#0a1d37] uppercase tracking-tighter">Serviços Maggi</h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Excelência em Pós-Venda</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#0071C2] text-white rounded-xl shadow-md"><Store size={18} /></div>
                <div>
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loja Selecionada</h4>
                  <p className="text-sm font-black text-[#0a1d37]">{currentUnit.name}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-[11px] font-black text-[#0a1d37] uppercase tracking-[0.3em] border-l-4 border-[#0071C2] pl-4">Escolha o Serviço</h3>
              <div className="space-y-3">
                {servicesList.map((service, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleServiceClick(service.name)}
                    className="w-full flex items-center justify-between p-5 bg-white border border-gray-100 rounded-[2rem] shadow-sm active:scale-[0.98] transition-all group hover:border-[#0071C2]/30"
                  >
                    <div className="flex items-center gap-4 text-left">
                      <div className="p-3 bg-gray-50 rounded-xl text-[#0071C2] group-hover:bg-[#0071C2] group-hover:text-white transition-colors">
                        <service.icon size={20} />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-[#0a1d37] uppercase">{service.name}</h4>
                        <p className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">{service.desc}</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-gray-300" />
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={() => setIsChangingUnit(true)}
              className="w-full py-4 text-[10px] font-black text-[#0071C2] uppercase tracking-[0.2em] border border-[#0071C2]/20 rounded-2xl flex items-center justify-center gap-2 active:bg-blue-50 transition-colors"
            >
              <RefreshCw size={14} /> Trocar Concessionária Maggi
            </button>
          </>
        )}

        {schedulingStep === 'DATES' && (
          <div className="space-y-8 animate-in slide-in-from-right duration-300">
            <div className="flex items-center gap-4">
              <button onClick={() => setSchedulingStep('LIST')} className="p-2 text-gray-400"><ChevronLeft size={24} /></button>
              <h3 className="text-lg font-black text-[#0a1d37] uppercase tracking-tighter">Proponha 3 Datas</h3>
            </div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-relaxed">Indique três datas preferenciais e nossa equipe confirmará a melhor opção para você.</p>
            
            <div className="space-y-4">
              {[0, 1, 2].map(i => (
                <div key={i} className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-gray-400 ml-1">Opção {i + 1}</label>
                  <input 
                    type="date" 
                    value={proposedDates[i]}
                    onChange={(e) => {
                      const newDates = [...proposedDates];
                      newDates[i] = e.target.value;
                      setProposedDates(newDates);
                    }}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 font-bold text-[#0a1d37]" 
                  />
                </div>
              ))}
            </div>

            <button 
              onClick={handleConfirmDates}
              disabled={proposedDates.some(d => !d)}
              className="w-full bg-[#0071C2] text-white py-6 rounded-3xl text-xs font-black uppercase tracking-[0.3em] shadow-xl active:scale-95 transition-all disabled:opacity-30"
            >
              Próximo Passo <ArrowRight size={20} className="inline ml-2" />
            </button>
          </div>
        )}

        {schedulingStep === 'QUESTIONS' && (
          <div className="space-y-8 animate-in slide-in-from-right duration-300">
            <div className="flex items-center gap-4">
              <button onClick={() => setSchedulingStep('DATES')} className="p-2 text-gray-400"><ChevronLeft size={24} /></button>
              <h3 className="text-lg font-black text-[#0a1d37] uppercase tracking-tighter">Sobre o Veículo</h3>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-gray-400 ml-1 tracking-widest">Placa do Carro</label>
                <input 
                  type="text" 
                  placeholder="Ex: ABC-1234"
                  value={revQuestionnaire.plate}
                  onChange={(e) => setRevQuestionnaire({...revQuestionnaire, plate: e.target.value.toUpperCase()})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:outline-none font-bold placeholder:text-gray-300"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-gray-400 ml-1 tracking-widest">KM Atual</label>
                <input 
                  type="number" 
                  placeholder="Ex: 25000"
                  value={revQuestionnaire.km}
                  onChange={(e) => setRevQuestionnaire({...revQuestionnaire, km: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:outline-none font-bold placeholder:text-gray-300"
                />
              </div>
            </div>

            <button 
              onClick={handleFinalSubmit}
              disabled={!revQuestionnaire.plate || !revQuestionnaire.km}
              className="w-full bg-[#f89a1e] text-white py-6 rounded-3xl text-xs font-black uppercase tracking-[0.3em] shadow-xl active:scale-95 transition-all disabled:opacity-30"
            >
              Solicitar Agendamento <Rocket size={20} className="inline ml-2" />
            </button>
          </div>
        )}

        {schedulingStep === 'SUCCESS' && (
          <div className="text-center py-10 space-y-6 animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500">
              <CheckCircle2 size={50} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-[#0a1d37] uppercase tracking-tight">Solicitação Enviada!</h3>
              <p className="text-xs text-gray-400 font-bold uppercase leading-relaxed px-4">Recebemos seu pedido para a unidade {currentUnit.name}. Retornaremos em breve.</p>
            </div>
            <button 
              onClick={resetFlow}
              className="w-full bg-[#0071C2] text-white py-6 rounded-3xl text-xs font-black uppercase tracking-[0.3em]"
            >
              Voltar aos Serviços
            </button>
          </div>
        )}

        {isChangingUnit && (
          <div className="fixed inset-0 z-[110] flex items-end justify-center animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsChangingUnit(false)} />
            <div className="relative bg-white w-full max-w-md rounded-t-[3rem] p-10 shadow-2xl animate-in slide-in-from-bottom-20 duration-500 max-h-[80vh] overflow-y-auto text-[#0a1d37]">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-black uppercase tracking-tight">Escolha outra Maggi</h3>
                <button onClick={() => setIsChangingUnit(false)} className="p-2 text-gray-300"><X size={20} /></button>
              </div>
              <div className="space-y-3">
                {MOCK_UNITS.map(u => (
                  <button 
                    key={u.id}
                    onClick={() => { setCurrentUnit(u); setIsChangingUnit(false); }}
                    className={`w-full p-6 rounded-2xl border text-left flex items-center justify-between transition-all ${currentUnit.id === u.id ? 'border-[#0071C2] bg-blue-50/50' : 'border-gray-100 hover:border-blue-100'}`}
                  >
                    <div>
                      <h4 className="text-sm font-black">{u.name}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">{u.city} - {u.state}</p>
                    </div>
                    {currentUnit.id === u.id && <CheckCircle2 size={18} className="text-[#0071C2]" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderOffers = () => {
    // Algoritmo de Prioridade:
    // 1. Pós-venda (SERVICE)
    // 2. Carro Zero (SALES + badge "Novo 0km")
    // 3. Multimarcas (SALES + outros)
    const getPriority = (c: Campaign) => {
      if (c.type === 'SERVICE') return 1;
      if (c.badge === 'Novo 0km') return 2;
      return 3;
    };

    const sortedCampaigns = [...MOCK_CAMPAIGNS].sort((a, b) => getPriority(a) - getPriority(b));

    return (
      <div className="p-8 space-y-10 animate-in fade-in bg-white rounded-t-[3rem] mt-4 min-h-[85vh] pb-32">
        <div className="text-center space-y-3">
          <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto text-[#f89a1e]">
            <Tag size={40} />
          </div>
          <h2 className="text-2xl font-black text-[#0a1d37] uppercase tracking-tighter">Ofertas Maggi</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Oportunidades em {currentUnit.name}</p>
        </div>

        <div className="space-y-6">
          {sortedCampaigns.map((camp, i) => {
            const isService = camp.type === 'SERVICE';
            const isZero = camp.badge === 'Novo 0km';
            
            return (
              <div key={camp.id} className="relative group overflow-hidden rounded-[2.5rem] shadow-xl border border-gray-100 animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="h-48 overflow-hidden relative">
                  <img src={camp.image} alt={camp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-6 left-6 flex gap-2">
                    <span className={`px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg ${
                      isService ? 'bg-blue-600 text-white' : isZero ? 'bg-orange-500 text-white' : 'bg-green-600 text-white'
                    }`}>
                      {camp.badge}
                    </span>
                  </div>
                  {isService && (
                    <div className="absolute top-6 right-6 p-2 bg-white/20 backdrop-blur-md rounded-xl text-white">
                      <Wrench size={16} />
                    </div>
                  )}
                </div>
                
                <div className="p-8 bg-white space-y-4">
                  <div>
                    <h3 className="text-lg font-black text-[#0a1d37] uppercase tracking-tight leading-tight">{camp.title}</h3>
                    <p className="text-xs text-gray-400 font-medium mt-2 leading-relaxed">{camp.subtitle}</p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock size={12} />
                      <span className="text-[9px] font-black uppercase tracking-widest">Até {camp.validUntil}</span>
                    </div>
                    <button 
                      onClick={() => openWhatsApp(`Olá! Vi a oferta "${camp.title}" e tenho interesse.`)}
                      className="bg-[#0071C2] text-white px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-transform"
                    >
                      Aproveitar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 text-center">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
            Campanhas exclusivas para clientes da unidade {currentUnit.name}.<br/>Sujeito a disponibilidade de estoque.
          </p>
        </div>
      </div>
    );
  };

  const renderConsortium = () => (
    <div className="p-8 space-y-10 animate-in fade-in bg-white rounded-t-[3rem] mt-4 min-h-[85vh] pb-32">
      <div className="text-center space-y-3">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-[#0071C2]">
          <PiggyBank size={40} />
        </div>
        <h2 className="text-2xl font-black text-[#0a1d37] uppercase tracking-tighter">Consórcio Maggi</h2>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">O Plano Certo para Você</p>
      </div>

      <div className="bg-[#0071C2] p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10"><Fingerprint size={120} /></div>
        <div className="relative z-10 space-y-6">
          <div className="space-y-1">
            <h3 className="text-sm font-black uppercase tracking-wider">Área do Consorciado</h3>
            <p className="text-[10px] text-blue-100/60 font-medium uppercase tracking-widest">Acesse seu contrato agora</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] ml-1 opacity-70">Grupo</label>
              <input 
                type="text" 
                value={consortiumGroup}
                onChange={(e) => setConsortiumGroup(e.target.value)}
                placeholder="Ex: 0045"
                className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:bg-white/20 transition-all placeholder:text-blue-100/30 font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] ml-1 opacity-70">Cota</label>
              <input 
                type="text" 
                value={consortiumQuota}
                onChange={(e) => setConsortiumQuota(e.target.value)}
                placeholder="Ex: 120"
                className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:bg-white/20 transition-all placeholder:text-blue-100/30 font-bold"
              />
            </div>
            <button 
              onClick={handleConsortiumAccess}
              disabled={isConsortiumLoading || !consortiumGroup || !consortiumQuota}
              className="w-full bg-[#f89a1e] text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isConsortiumLoading ? <Loader2 className="animate-spin" size={18} /> : <>Consultar Minha Cota <ChevronRight size={16} /></>}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-[11px] font-black text-[#0a1d37] uppercase tracking-[0.3em] border-l-4 border-[#0071C2] pl-4">Setores que Atendemos</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Car, label: 'Carros' },
            { icon: Bike, label: 'Motos' },
            { icon: Truck, label: 'Caminhões' },
            { icon: Tractor, label: 'Maquinário' }, 
            { icon: HomeIcon, label: 'Casa/Imóvel' },
            { icon: Landmark, label: 'Serviços' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center justify-center p-5 bg-gray-50 border border-gray-100 rounded-[2rem] text-center gap-2 group hover:bg-white hover:border-blue-200 transition-all shadow-sm">
              <div className="text-[#0071C2] group-hover:scale-110 transition-transform"><item.icon size={24} /></div>
              <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4">
        <button 
          onClick={() => openWhatsApp("Olá! Quero fazer uma simulação de consórcio.")}
          className="w-full bg-[#0071C2] text-white py-6 rounded-3xl text-xs font-black uppercase tracking-[0.3em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          Faça sua Simulação <Rocket size={20} />
        </button>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="p-8 space-y-10 animate-in fade-in bg-white rounded-t-[3rem] mt-4 min-h-[85vh] pb-32">
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 bg-[#0071C2] rounded-3xl flex items-center justify-center text-white text-2xl font-black shadow-lg">JD</div>
        <div>
          <h2 className="text-xl font-black text-[#0a1d37] uppercase tracking-tight">João da Silva</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Cliente Maggi desde 2018</p>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-[11px] font-black text-[#0071C2] uppercase tracking-[0.3em] border-l-4 border-[#0071C2] pl-4">Institucional</h3>
        <div className="space-y-4">
          <button onClick={() => setSelectedDna('mission')} className="w-full text-left p-6 bg-gray-50 rounded-[2rem] border border-gray-100 shadow-sm active:scale-[0.98] transition-all">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-white rounded-xl text-[#0071C2] shadow-sm"><Rocket size={20} /></div>
              <h4 className="text-sm font-black text-[#0a1d37] uppercase tracking-wider">Nossa Missão</h4>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed font-medium italic">"Prover as melhores soluções de mobilidade..."</p>
          </button>
          <button onClick={() => setSelectedDna('vision')} className="w-full text-left p-6 bg-gray-50 rounded-[2rem] border border-gray-100 shadow-sm active:scale-[0.98] transition-all">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-white rounded-xl text-[#0071C2] shadow-sm"><Eye size={20} /></div>
              <h4 className="text-sm font-black text-[#0a1d37] uppercase tracking-wider">Nossa Visão</h4>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed font-medium italic">"Ser o grupo de concessionárias mais admirado do Brasil..."</p>
          </button>
          <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-white rounded-xl text-[#0071C2] shadow-sm"><Briefcase size={20} /></div>
              <h4 className="text-sm font-black text-[#0a1d37] uppercase tracking-wider">Nossos Valores</h4>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {['Ética Absoluta', 'Foco no Cliente', 'Inovação', 'Gente Maggi'].map(v => (
                <div key={v} onClick={() => setSelectedDna('values')} className="bg-white px-4 py-2 rounded-xl text-[9px] font-black text-[#0a1d37] border border-gray-100 uppercase text-center shadow-sm cursor-pointer">{v}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button className="w-full flex items-center justify-between p-6 bg-red-50 text-red-500 rounded-3xl font-black uppercase text-[10px] tracking-widest mt-12 active:scale-95 transition-transform">
        Sair da Conta <LogOut size={18} />
      </button>
    </div>
  );

  const renderMaggiBot = () => (
    <div className="flex flex-col h-full bg-white animate-in slide-in-from-right duration-300">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
        <div>
          <h2 className="text-lg font-black text-[#0a1d37] uppercase tracking-tighter flex items-center gap-2">MaggiBot 3.0 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /></h2>
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Seu concierge inteligente</p>
        </div>
        <div className="p-3 bg-blue-50 rounded-2xl text-[#0071C2]"><Sparkles size={20} /></div>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30">
        {chatMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-40 py-20">
            <div className="p-6 bg-white rounded-full shadow-sm"><MessageCircle size={40} className="text-[#0071C2]" /></div>
            <p className="text-xs font-medium max-w-[200px]">Olá! Sou o MaggiBot. No que posso te ajudar hoje?</p>
          </div>
        )}
        {chatMessages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-1`}>
            <div className={`max-w-[85%] p-4 rounded-[1.5rem] text-sm shadow-sm ${msg.role === 'user' ? 'bg-[#0071C2] text-white rounded-tr-none' : 'bg-white border border-gray-100 text-[#0a1d37] rounded-tl-none'}`}>{msg.text}</div>
          </div>
        ))}
        {isChatLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-white border border-gray-100 p-4 rounded-[1.5rem] rounded-tl-none shadow-sm"><Loader2 className="animate-spin text-[#0071C2]" size={16} /></div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <div className="p-6 bg-white border-t border-gray-100 pb-24">
        <div className="flex gap-3 bg-gray-50 border border-gray-100 rounded-2xl p-2 pl-6">
          <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Pergunte sobre carros..." className="flex-1 bg-transparent border-none focus:outline-none text-sm py-3 font-medium" />
          <button onClick={handleSendMessage} disabled={isChatLoading || !chatInput.trim()} className="bg-[#0071C2] text-white p-4 rounded-xl shadow-lg active:scale-90 transition-transform disabled:opacity-30"><Send size={18} /></button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeView) {
      case AppView.HOME: return renderHome();
      case AppView.CHAT: return renderMaggiBot();
      case AppView.MY_VEHICLE: return <div className="p-8"><h2 className="text-2xl font-black uppercase text-[#0a1d37]">Meu Veículo</h2></div>; 
      case AppView.UNITS: return <div className="p-8"><h2 className="text-2xl font-black uppercase text-[#0a1d37]">Nossas Lojas</h2></div>;
      case AppView.PROFILE: return renderProfile();
      case AppView.STOCK: return <div className="p-8"><h2 className="text-2xl font-black uppercase text-[#0a1d37]">Carro Novo Maggi</h2></div>;
      case AppView.OFFERS: return renderOffers();
      case AppView.SCHEDULE: return renderSchedule();
      case AppView.CONSORTIUM: return renderConsortium();
      default: return renderHome();
    }
  };

  return (
    <Layout activeView={activeView} setActiveView={setActiveView}>
      {renderContent()}
      {renderDnaModal()}
    </Layout>
  );
};

export default App;
