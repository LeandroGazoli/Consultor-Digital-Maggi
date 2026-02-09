
import React, { useState, useEffect, useRef } from 'react';
import { AppView, Vehicle, Appointment, Campaign } from './types';
import Layout from './components/Layout';
import SpecificationDoc from './components/SpecificationDoc';
import { MOCK_VEHICLES, UNITS, SERVICES, MOCK_CAMPAIGNS } from './constants';
import { 
  Search, MessageCircle, Phone, MapPin, ChevronRight, 
  Calendar as CalendarIcon, ChevronLeft, Sparkles, Car, 
  Tag, FileText, CircleDollarSign, Users2, ArrowRight, 
  Heart, Store, Send, Loader2, ExternalLink, CarFront, ShieldCheck, Newspaper,
  History, Award, Zap, Wrench, Target, Eye, Star, Clock, CheckCircle2, Filter, Info,
  Flame, Gift
} from 'lucide-react';
import { getFastVehicleRecommendation, startMaggiChat, getUnitsWithMaps } from './services/geminiService';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>(AppView.HOME);
  const [userProfileInput, setUserProfileInput] = useState('');
  const [fastRec, setFastRec] = useState('');
  const [isFastLoading, setIsFastLoading] = useState(false);
  const [npsValue, setNpsValue] = useState<number | null>(null);
  
  // Agendamento State
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Estoque State
  const [selectedStockUnit, setSelectedStockUnit] = useState('Itu');
  const [stockCategory, setStockCategory] = useState<'ALL' | 'NEW' | 'USED'>('ALL');

  // Ofertas State
  const [offersCategory, setOffersCategory] = useState<'ALL' | 'SALES' | 'SERVICE'>('ALL');

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
    { label: 'Revisão', icon: CalendarIcon, color: 'text-[#0071C2]', view: AppView.SCHEDULE },
    { label: 'Estoque', icon: Car, color: 'text-[#0071C2]', view: AppView.STOCK },
    { label: 'Veículo', icon: CarFront, color: 'text-[#0071C2]', view: AppView.MY_VEHICLE },
    { label: 'Ofertas', icon: Tag, color: 'text-[#f89a1e]', view: AppView.OFFERS },
    { label: 'Financiar', icon: CircleDollarSign, color: 'text-[#0071C2]' },
    { label: 'Consórcio', icon: Users2, color: 'text-[#0071C2]' },
    { label: 'Lojas', icon: Store, color: 'text-[#0071C2]', view: AppView.UNITS },
    { label: 'Novidades', icon: Newspaper, color: 'text-[#0071C2]', view: AppView.HOME },
  ];

  const differentials = [
    { label: 'Tradição', desc: '+40 anos de história', icon: History },
    { label: 'Confiança', desc: 'Garantia de procedência', icon: Award },
    { label: 'Agilidade', desc: 'Crédito aprovado rápido', icon: Zap },
    { label: 'Qualidade', desc: 'Oficinas especializadas', icon: Wrench },
  ];

  const institutional = [
    { title: 'Missão', text: 'Oferecer soluções em mobilidade com excelência, transparência e confiança.', icon: Target },
    { title: 'Visão', text: 'Ser o maior e mais inovador grupo automotivo, referência em satisfação no Brasil.', icon: Eye },
    { title: 'Valores', text: 'Ética, Paixão por Carros, Foco no Cliente e Responsabilidade Socioambiental.', icon: Heart },
  ];

  const timeSlots = ['08:00', '09:30', '10:00', '13:30', '14:00', '15:30', '16:00', '17:00'];

  const renderHome = () => (
    <div className="space-y-8 p-6 animate-in fade-in duration-500 pb-20">
      <div className="relative group mx-0.5">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
        <input 
          type="text" 
          placeholder="O que você busca hoje?" 
          className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0071C2]/5 text-sm font-medium transition-all"
        />
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2.5">
          {actions.slice(0, 6).map((action, i) => (
            <button 
              key={i}
              onClick={() => action.view ? setActiveView(action.view) : null}
              className="flex flex-col items-center justify-center py-6 px-2 bg-white border border-gray-50 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.015)] hover:border-blue-100 transition-all active:scale-95 group"
            >
              <div className={`mb-2 transition-all ${action.color} group-hover:scale-110`}>
                <action.icon size={22} strokeWidth={1.8} />
              </div>
              <span className="text-[8px] font-bold text-gray-400 text-center uppercase tracking-wider leading-none">
                {action.label}
              </span>
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-2 gap-2.5">
          {actions.slice(6, 8).map((action, i) => (
            <button 
              key={i}
              onClick={() => action.view ? setActiveView(action.view) : null}
              className="flex items-center gap-4 p-5 bg-white border border-gray-50 rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.02)] hover:border-blue-100 transition-all active:scale-95 group"
            >
              <div className={`transition-all ${action.color} group-hover:scale-110`}>
                <action.icon size={24} strokeWidth={2} />
              </div>
              <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.15em] leading-none">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#0071C2] p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden mx-0.5">
        <div className="absolute -top-10 -right-10 opacity-5"><Sparkles size={160} /></div>
        <div className="relative z-10">
            <h3 className="text-[10px] font-black flex items-center gap-2.5 uppercase tracking-[0.3em]">
                <Sparkles size={14} className="text-[#f89a1e]" /> Assistente Maggi
            </h3>
            <div className="mt-6 flex gap-2.5">
                <input 
                  value={userProfileInput}
                  onChange={(e) => setUserProfileInput(e.target.value)}
                  placeholder="No que posso ajudar?"
                  className="flex-1 bg-white/10 border border-white/10 rounded-xl px-6 py-4 text-sm focus:outline-none placeholder:text-blue-100/30"
                />
                <button onClick={handleFastAsk} disabled={isFastLoading} className="bg-[#f89a1e] p-4 rounded-xl shadow-lg active:scale-90 transition-transform">
                  {isFastLoading ? <Loader2 className="animate-spin" size={20} /> : <ChevronRight size={20} />}
                </button>
            </div>
            {fastRec && (
                <div className="mt-6 p-5 bg-white/5 rounded-2xl border border-white/5 animate-in slide-in-from-top-2">
                    <p className="text-xs font-medium leading-relaxed italic opacity-90">"{fastRec}"</p>
                </div>
            )}
        </div>
      </div>

      <div className="space-y-4 px-0.5 relative group">
        <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.25em] pl-1">Por que escolher a Maggi?</h3>
        <div className="relative">
          <div className="absolute top-0 right-0 bottom-4 w-12 bg-gradient-to-l from-[#fcfdfe] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-1 top-1/2 -translate-y-1/2 z-20 animate-pulse text-[#0071C2]/30 group-hover:text-[#0071C2]/60 transition-colors">
            <ChevronRight size={18} strokeWidth={3} />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x">
            {differentials.map((diff, i) => (
              <div 
                key={i} 
                className="min-w-[140px] snap-start p-5 bg-white border border-gray-50 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.01)] flex flex-col gap-3"
              >
                <div className="text-[#0071C2]">
                  <diff.icon size={20} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-[#0a1d37] uppercase tracking-tight leading-none mb-1">{diff.label}</p>
                  <p className="text-[8px] text-gray-400 font-bold uppercase leading-tight tracking-tighter">{diff.desc}</p>
                </div>
              </div>
            ))}
            <div className="min-w-[10px] flex-shrink-0"></div>
          </div>
        </div>
      </div>

      <div className="space-y-5 px-0.5 mt-10">
        <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.25em] pl-1">Nossa Identidade</h3>
        <div className="space-y-3">
          {institutional.map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-50 shadow-[0_2px_15px_rgba(0,0,0,0.01)] flex gap-5 items-start">
              <div className="p-3 bg-blue-50/50 rounded-2xl text-[#0071C2]">
                <item.icon size={22} strokeWidth={2} />
              </div>
              <div>
                <h4 className="text-[11px] font-black text-[#0a1d37] uppercase tracking-wider mb-1">{item.title}</h4>
                <p className="text-[10px] text-gray-500 font-medium leading-relaxed">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 px-0.5">
        <div className="bg-gray-50/50 rounded-[2.5rem] p-8 border border-gray-100 text-center">
          {npsValue === null ? (
            <>
              <Star size={24} className="text-[#f89a1e] mx-auto mb-4" />
              <h3 className="text-[10px] font-black text-[#0a1d37] uppercase tracking-[0.2em] mb-2">Avalie sua experiência</h3>
              <p className="text-[9px] text-gray-400 font-bold uppercase mb-6">Em uma escala de 0 a 10, o quanto recomendaria o app Maggi?</p>
              <div className="flex justify-between gap-1 overflow-x-auto pb-2 scrollbar-hide">
                {[...Array(11).keys()].map((num) => (
                  <button 
                    key={num}
                    onClick={() => setNpsValue(num)}
                    className="w-8 h-8 flex-shrink-0 rounded-full bg-white border border-gray-100 text-[10px] font-black text-gray-400 hover:border-[#0071C2] hover:text-[#0071C2] transition-all active:scale-90"
                  >
                    {num}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="py-4 animate-in zoom-in-95 duration-300">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck size={24} className="text-green-500" />
              </div>
              <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Obrigado pelo seu feedback!</p>
              <button 
                onClick={() => setNpsValue(null)} 
                className="mt-4 text-[8px] font-black text-[#0071C2] uppercase tracking-widest underline opacity-50"
              >
                Avaliar novamente
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="py-10 text-center opacity-20">
        <p className="text-[8px] font-black uppercase tracking-[0.5em] text-[#0071C2]">Empresas Maggi &copy; 2024</p>
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="p-8 space-y-8 animate-in fade-in h-full bg-white rounded-t-[3rem] mt-4 min-h-[85vh] shadow-sm">
      <div className="flex justify-between items-center px-2">
        <h2 className="text-2xl font-black text-[#0a1d37] uppercase tracking-tighter">Agendamento</h2>
        <div className="p-2.5 bg-blue-50 rounded-xl text-[#0071C2]"><CalendarIcon size={28} /></div>
      </div>

      {!isConfirmed ? (
        <div className="space-y-8 animate-in slide-in-from-bottom-2">
          {/* Última Unidade Visitada */}
          <div className="space-y-4">
            <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.25em] pl-2">Sua Unidade Habitual</h3>
            <button className="w-full bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100 flex items-center justify-between group active:scale-[0.98] transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#0071C2] shadow-sm"><Store size={22} /></div>
                <div className="text-left">
                  <p className="text-[12px] font-black text-[#0a1d37] uppercase tracking-tight">Maggi Itu - Matriz</p>
                  <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">Última visita: 12 Out 2023</p>
                </div>
              </div>
              <div className="p-3 bg-white rounded-full text-[#0071C2] shadow-sm group-hover:bg-[#0071C2] group-hover:text-white transition-colors">
                <ChevronRight size={16} />
              </div>
            </button>
          </div>

          {/* Calendário Simplificado */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.25em]">Selecione o Dia (Nov)</h3>
              <p className="text-[8px] font-black text-[#0071C2] uppercase">Ver mais</p>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                <div key={i} className="text-center text-[8px] font-black text-gray-300 uppercase py-2">{d}</div>
              ))}
              {[...Array(14).keys()].map((day) => {
                const dayNum = day + 15; // Mocking Nov 15th onwards
                const isSelected = selectedDate === dayNum;
                const isWeekend = (dayNum % 7 === 0 || dayNum % 7 === 1);
                return (
                  <button 
                    key={dayNum}
                    disabled={isWeekend}
                    onClick={() => setSelectedDate(dayNum)}
                    className={`h-12 rounded-2xl text-[11px] font-black transition-all flex items-center justify-center border
                      ${isWeekend ? 'bg-gray-50 border-transparent text-gray-200 cursor-not-allowed' : 
                        isSelected ? 'bg-[#0071C2] border-[#0071C2] text-white shadow-lg' : 'bg-white border-gray-50 text-gray-700 hover:border-blue-100 shadow-[0_2px_10px_rgba(0,0,0,0.01)]'}
                    `}
                  >
                    {dayNum}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Horários */}
          {selectedDate && (
            <div className="space-y-4 animate-in fade-in zoom-in-95">
              <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.25em] pl-2">Horários Disponíveis</h3>
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map((time) => {
                  const isSelected = selectedTime === time;
                  return (
                    <button 
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-3 rounded-xl text-[9px] font-black transition-all border flex items-center justify-center gap-1.5
                        ${isSelected ? 'bg-[#0071C2] border-[#0071C2] text-white' : 'bg-gray-50 border-transparent text-gray-500 hover:bg-white hover:border-blue-100'}
                      `}
                    >
                      <Clock size={10} /> {time}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Botão Confirmar */}
          <div className="pt-4">
            <button 
              disabled={!selectedDate || !selectedTime}
              onClick={() => setIsConfirmed(true)}
              className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-lg transition-all active:scale-95
                ${!selectedDate || !selectedTime ? 'bg-gray-100 text-gray-300' : 'bg-[#0071C2] text-white shadow-[#0071C2]/20'}
              `}
            >
              Confirmar Agendamento
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in-95">
          <div className="w-24 h-24 bg-green-50 rounded-[2.5rem] flex items-center justify-center text-green-500 mb-8 shadow-inner">
            <CheckCircle2 size={48} />
          </div>
          <h3 className="text-xl font-black text-[#0a1d37] uppercase tracking-tight mb-4">Agendamento Realizado!</h3>
          <p className="text-xs text-gray-400 font-medium px-10 leading-relaxed mb-10 italic">
            Sua revisão para o dia <strong>{selectedDate} de Novembro</strong> às <strong>{selectedTime}</strong> na unidade <strong>Maggi Itu</strong> foi confirmada.
          </p>
          <div className="space-y-3 w-full">
            <button 
              onClick={() => {setIsConfirmed(false); setActiveView(AppView.HOME);}}
              className="w-full bg-[#0071C2] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-lg"
            >
              Voltar ao Início
            </button>
            <button className="w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] text-[#0071C2] border border-blue-50">
              Adicionar ao Calendário
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderStock = () => {
    const filteredVehicles = MOCK_VEHICLES.filter(v => {
      const unitMatch = v.unit.toLowerCase().includes(selectedStockUnit.toLowerCase());
      const categoryMatch = stockCategory === 'ALL' || v.type === stockCategory;
      return unitMatch && categoryMatch;
    });

    return (
      <div className="p-8 space-y-8 animate-in fade-in h-full bg-white rounded-t-[3rem] mt-4 min-h-[85vh] shadow-sm pb-32">
        <div className="flex justify-between items-center px-2">
          <h2 className="text-2xl font-black text-[#0a1d37] uppercase tracking-tighter">Estoque</h2>
          <div className="p-2.5 bg-blue-50 rounded-xl text-[#0071C2]"><Car size={28} /></div>
        </div>

        {/* Seletor de Concessionária */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.25em]">Escolher Unidade</h3>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-2">
            {UNITS.map((unit) => (
              <button
                key={unit}
                onClick={() => setSelectedStockUnit(unit)}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap border
                  ${selectedStockUnit === unit ? 'bg-[#0071C2] border-[#0071C2] text-white shadow-lg' : 'bg-white border-gray-100 text-gray-400'}
                `}
              >
                {unit}
              </button>
            ))}
          </div>
        </div>

        {/* Categorias */}
        <div className="flex bg-gray-100/50 p-1 rounded-2xl">
          <button 
            onClick={() => setStockCategory('ALL')}
            className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${stockCategory === 'ALL' ? 'bg-white text-[#0071C2] shadow-sm' : 'text-gray-400'}`}
          >
            Todos
          </button>
          <button 
            onClick={() => setStockCategory('NEW')}
            className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${stockCategory === 'NEW' ? 'bg-white text-[#0071C2] shadow-sm' : 'text-gray-400'}`}
          >
            Novos (0km)
          </button>
          <button 
            onClick={() => setStockCategory('USED')}
            className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${stockCategory === 'USED' ? 'bg-white text-[#0071C2] shadow-sm' : 'text-gray-400'}`}
          >
            Seminovos
          </button>
        </div>

        {/* Lista de Veículos */}
        <div className="space-y-6">
          {filteredVehicles.length > 0 ? (
            filteredVehicles.map((vehicle) => (
              <div key={vehicle.id} className="group animate-in slide-in-from-bottom-2 bg-white rounded-[2.5rem] border border-gray-50 shadow-[0_4px_30px_rgba(0,0,0,0.02)] overflow-hidden transition-all active:scale-[0.98]">
                <div className="relative h-56 overflow-hidden">
                  <img src={vehicle.image} alt={vehicle.model} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-sm ${vehicle.type === 'NEW' ? 'bg-[#0071C2] text-white' : 'bg-[#f89a1e] text-white'}`}>
                      {vehicle.type === 'NEW' ? '0km' : 'Seminovo'}
                    </span>
                  </div>
                  <button className="absolute bottom-4 right-4 p-3 bg-white/90 backdrop-blur rounded-full text-red-500 shadow-lg active:scale-90 transition-transform">
                    <Heart size={18} />
                  </button>
                </div>
                <div className="p-8 space-y-4">
                  <div>
                    <p className="text-[9px] font-black text-[#0071C2] uppercase tracking-[0.2em] mb-1">{vehicle.brand}</p>
                    <h3 className="text-xl font-black text-[#0a1d37] leading-tight uppercase tracking-tight">{vehicle.model}</h3>
                  </div>
                  
                  <div className="flex gap-4 border-y border-gray-50 py-4">
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} className="text-gray-300" />
                      <span className="text-[10px] font-bold text-gray-400">{vehicle.year}</span>
                    </div>
                    <div className="flex items-center gap-1.5 border-l border-gray-100 pl-4">
                      <MapPin size={14} className="text-gray-300" />
                      <span className="text-[10px] font-bold text-gray-400">{vehicle.km === 0 ? '0 km' : `${vehicle.km.toLocaleString()} km`}</span>
                    </div>
                  </div>

                  <div className="flex items-end justify-between pt-2">
                    <div>
                      <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">A partir de</p>
                      <p className="text-2xl font-black text-[#0a1d37]">R$ {vehicle.price.toLocaleString('pt-BR')}</p>
                    </div>
                    <button className="p-4 bg-gray-50 rounded-2xl text-[#0071C2] active:scale-90 transition-transform">
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
              <Car size={64} className="mb-4 text-gray-300" strokeWidth={1} />
              <p className="font-black uppercase text-[10px] tracking-[0.3em]">Nenhum veículo encontrado nesta unidade.</p>
              <button 
                onClick={() => setSelectedStockUnit('Itu')}
                className="mt-4 text-[9px] font-black text-[#0071C2] uppercase underline tracking-widest"
              >
                Ver matriz Itu
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderOffers = () => {
    const filteredOffers = MOCK_CAMPAIGNS.filter(c => 
      offersCategory === 'ALL' || c.type === offersCategory
    );

    return (
      <div className="p-8 space-y-8 animate-in fade-in h-full bg-white rounded-t-[3rem] mt-4 min-h-[85vh] shadow-sm pb-32">
        <div className="flex justify-between items-center px-2">
          <h2 className="text-2xl font-black text-[#0a1d37] uppercase tracking-tighter">Ofertas</h2>
          <div className="p-2.5 bg-orange-50 rounded-xl text-[#f89a1e]"><Tag size={28} /></div>
        </div>

        {/* Categorias de Oferta */}
        <div className="flex bg-gray-100/50 p-1 rounded-2xl">
          <button 
            onClick={() => setOffersCategory('ALL')}
            className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${offersCategory === 'ALL' ? 'bg-white text-[#f89a1e] shadow-sm' : 'text-gray-400'}`}
          >
            Todas
          </button>
          <button 
            onClick={() => setOffersCategory('SALES')}
            className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${offersCategory === 'SALES' ? 'bg-white text-[#f89a1e] shadow-sm' : 'text-gray-400'}`}
          >
            Veículos
          </button>
          <button 
            onClick={() => setOffersCategory('SERVICE')}
            className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${offersCategory === 'SERVICE' ? 'bg-white text-[#f89a1e] shadow-sm' : 'text-gray-400'}`}
          >
            Pós-Venda
          </button>
        </div>

        {/* Lista de Campanhas */}
        <div className="space-y-8">
          {filteredOffers.map((camp) => (
            <div key={camp.id} className="group relative bg-white rounded-[3rem] border border-gray-50 shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden animate-in slide-in-from-bottom-3 transition-all active:scale-[0.98]">
              <div className="relative h-64">
                <img src={camp.image} alt={camp.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {camp.badge && (
                  <div className="absolute top-6 left-6 flex gap-2">
                    <span className="bg-[#f89a1e] text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                      <Flame size={12} /> {camp.badge}
                    </span>
                  </div>
                )}

                <div className="absolute bottom-6 left-8 right-8 text-white">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-80">Campanha Maggi</p>
                  <h3 className="text-xl font-black uppercase leading-tight tracking-tight">{camp.title}</h3>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <p className="text-sm text-gray-500 font-medium leading-relaxed italic border-l-2 border-[#f89a1e] pl-4">{camp.subtitle}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-400">
                    <CalendarIcon size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Válido até {camp.validUntil}</span>
                  </div>
                  <button 
                    onClick={() => camp.type === 'SERVICE' ? setActiveView(AppView.SCHEDULE) : setActiveView(AppView.CHAT)}
                    className="bg-[#0071C2] text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg active:scale-95 transition-all"
                  >
                    {camp.type === 'SERVICE' ? 'Agendar agora' : 'Tenho interesse'}
                    <ChevronRight size={14} strokeWidth={3} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredOffers.length === 0 && (
            <div className="py-24 text-center opacity-30">
              <Gift size={64} className="mx-auto mb-4" strokeWidth={1} />
              <p className="font-black uppercase text-[10px] tracking-[0.3em]">Nenhuma oferta disponível no momento.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderMyVehicle = () => (
    <div className="p-8 space-y-8 animate-in fade-in h-full bg-white rounded-t-[3rem] mt-4 min-h-[85vh] shadow-sm">
      <div className="flex justify-between items-center px-2">
        <h2 className="text-2xl font-black text-[#0a1d37] uppercase tracking-tighter">Meu Veículo</h2>
        <div className="p-2.5 bg-blue-50 rounded-xl text-[#0071C2]"><CarFront size={28} /></div>
      </div>
      <div className="bg-gray-50/40 p-10 rounded-[2.5rem] border border-gray-100 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm mb-8 border border-gray-50">
          <ShieldCheck size={40} className="text-[#0071C2]" />
        </div>
        <h3 className="text-xl font-black text-[#0a1d37] uppercase mb-3 leading-tight">Histórico de Revisão</h3>
        <p className="text-xs text-gray-400 font-medium mb-10 leading-relaxed px-6 italic">Cadastre seu veículo para gerenciar revisões e garantir o valor de revenda.</p>
        <button className="w-full bg-[#0071C2] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-lg active:scale-95 transition-all">
          Adicionar Veículo
        </button>
      </div>
    </div>
  );

  const renderChat = () => (
    <div className="flex flex-col h-full bg-white rounded-t-[3rem] mt-4 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-gray-50 flex justify-between items-center">
        <h2 className="text-xl font-black text-[#0a1d37] uppercase tracking-tighter">MaggiBot AI</h2>
        <div className="flex gap-1.5 items-center">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <Sparkles className="text-[#0071C2]" size={20} />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {chatMessages.length === 0 && (
          <div className="text-center py-20 opacity-30">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MessageCircle size={32} className="text-gray-300" />
            </div>
            <p className="font-black text-lg uppercase tracking-widest">Consultor Online</p>
            <p className="text-[9px] font-bold mt-2 uppercase">Como podemos ajudar hoje?</p>
          </div>
        )}
        {chatMessages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-5 rounded-2xl text-sm leading-relaxed ${
              m.role === 'user' ? 'bg-[#0071C2] text-white rounded-tr-none shadow-sm' : 'bg-gray-100 text-gray-800 rounded-tl-none border border-gray-50'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isChatLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-5 rounded-2xl rounded-tl-none"><Loader2 className="animate-spin text-[#0071C2]" size={18} /></div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <div className="p-6 border-t border-gray-50 bg-white">
        <div className="flex gap-3">
          <input 
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Digite sua dúvida..."
            className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-6 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#0071C2]/10"
          />
          <button onClick={handleSendMessage} className="bg-[#0071C2] text-white p-4 rounded-xl shadow-lg active:scale-90 transition-transform">
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderUnits = () => (
    <div className="p-8 space-y-8 animate-in fade-in h-full bg-white rounded-t-[3rem] shadow-sm mt-4 min-h-[85vh]">
        <div className="flex justify-between items-center px-2">
            <h2 className="text-2xl font-black text-[#0a1d37] uppercase tracking-tighter">Lojas Maggi</h2>
            <div className="p-2.5 bg-blue-50 rounded-xl text-[#0071C2]"><MapPin size={28} /></div>
        </div>
        {isMapsLoading ? (
          <div className="flex flex-col items-center py-24 gap-6 opacity-30">
            <Loader2 className="animate-spin" size={48} />
            <p className="font-black uppercase text-[10px] tracking-[0.3em]">Buscando unidades...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {mapsData.text && (
              <div className="p-6 bg-blue-50/30 rounded-2xl border border-blue-50 text-xs leading-relaxed text-gray-500 italic">
                {mapsData.text}
              </div>
            )}
            {UNITS.map((unit, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center justify-between shadow-[0_4px_15px_rgba(0,0,0,0.01)] hover:border-blue-100/50 transition-all active:scale-[0.98]">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-[#0071C2] font-black text-xl">{unit.charAt(0)}</div>
                        <div>
                            <p className="text-md font-black text-[#0a1d37] uppercase tracking-tight">{unit}</p>
                            <p className="text-[9px] text-green-500 font-bold uppercase tracking-widest mt-1">Aberto agora</p>
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl text-[#0071C2] active:scale-90 transition-transform"><Phone size={20} /></div>
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
      case AppView.SCHEDULE: return renderSchedule();
      case AppView.STOCK: return renderStock();
      case AppView.OFFERS: return renderOffers();
      case AppView.PROFILE: return <div className="p-24 text-center font-black opacity-10 text-[10px] tracking-[0.4em] uppercase">Área do Cliente</div>;
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
