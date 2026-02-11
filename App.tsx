
import React, { useState, useEffect, useRef } from 'react';
import { AppView, Vehicle, Unit } from './types';
import Layout from './components/Layout';
import { MOCK_VEHICLES, MOCK_UNITS, COLORS, DNA, DIFFERENTIALS, SERVICE_OPTIONS, INSURANCE_CATEGORIES, MOCK_CAMPAIGNS } from './constants';
import { 
  Search, MapPin, ChevronRight, Sparkles, Car, 
  Wrench, Target, Eye, Award, CheckCircle2, 
  X, Send, Loader2, User, LogOut, MessageSquareHeart,
  ShieldCheck, PieChart, History, FileText,
  Tractor, Bike, Truck, Home as HomeIcon, Shield,
  Droplet, Disc, ClipboardList, Heart, Briefcase, Calendar as CalendarIcon,
  Calculator
} from 'lucide-react';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>(AppView.HOME);
  const [selectedUnit, setSelectedUnit] = useState<string>(MOCK_UNITS[0].name);
  const [stockTab, setStockTab] = useState<'NEW' | 'USED'>('NEW');
  const [currentBanner, setCurrentBanner] = useState(0);

  // Estados do NPS
  const [userNps, setUserNps] = useState<number | null>(null);
  const [npsFeedback, setNpsFeedback] = useState('');
  const [npsStep, setNpsStep] = useState<'RATING' | 'FEEDBACK' | 'SUCCESS'>('RATING');
  const [showNpsBanner, setShowNpsBanner] = useState(true);

  // Efeito para o banner rotativo
  useEffect(() => {
    if (activeView === AppView.HOME) {
      const timer = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % MOCK_CAMPAIGNS.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [activeView]);

  const isFeedbackMandatory = userNps !== null && userNps <= 4;
  const isFeedbackRequired = userNps !== null && userNps >= 5 && userNps <= 7;

  const handleNpsSubmit = () => {
    if ((isFeedbackMandatory || isFeedbackRequired) && !npsFeedback.trim()) {
      alert("Por favor, descreva o motivo de sua nota para que possamos melhorar.");
      return;
    }
    setNpsStep('SUCCESS');
  };

  const openWhatsApp = (msg: string) => {
    const url = `https://wa.me/5511999999999?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const renderHome = () => (
    <div className="space-y-8 animate-in fade-in pb-32">
      {/* Banner Rotativo (Campanhas) */}
      <div className="relative h-64 w-full overflow-hidden">
        {MOCK_CAMPAIGNS.map((camp, idx) => (
          <div 
            key={camp.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentBanner ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
            <img src={camp.image} alt={camp.title} className="w-full h-full object-cover" />
            <div className="absolute bottom-10 left-8 z-20 space-y-2 max-w-[80%]">
              <span className="bg-[#1473e6] text-white text-[9px] font-black uppercase px-2 py-1 rounded-md tracking-widest">Campanha Ativa</span>
              <h2 className="text-2xl font-black text-white uppercase leading-tight">{camp.title}</h2>
              <p className="text-white/80 text-xs font-medium">{camp.subtitle}</p>
              <button className="mt-2 bg-white text-[#1473e6] px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg active:scale-95 transition-all">
                {camp.cta}
              </button>
            </div>
          </div>
        ))}
        {/* Indicadores do Banner */}
        <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center gap-1.5">
          {MOCK_CAMPAIGNS.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setCurrentBanner(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentBanner ? 'w-8 bg-white' : 'w-1.5 bg-white/40'}`}
            />
          ))}
        </div>
      </div>

      <div className="px-6 space-y-8">
        {/* 1. Botões de Ação Principal */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Serviços', icon: Wrench, view: AppView.SCHEDULE, color: 'text-blue-600' },
            { label: 'Carro Novo', icon: Car, view: AppView.STOCK, color: 'text-blue-600' },
            { label: 'Meu Carro', icon: History, view: AppView.MY_VEHICLE, color: 'text-blue-600' },
            { label: 'Seguros', icon: ShieldCheck, view: AppView.INSURANCE, color: 'text-blue-600' },
            { label: 'Consórcio', icon: PieChart, view: AppView.CONSORTIUM, color: 'text-blue-600' },
            { label: 'Lojas', icon: MapPin, view: AppView.UNITS, color: 'text-blue-600' },
          ].map((btn, i) => (
            <button 
              key={i} 
              onClick={() => setActiveView(btn.view)}
              className="flex items-center gap-4 p-5 bg-white border border-gray-100 rounded-3xl shadow-sm active:scale-95 transition-all"
            >
              <div className={`p-3 bg-blue-50 rounded-2xl ${btn.color}`}>
                <btn.icon size={22} />
              </div>
              <span className="text-xs font-black uppercase text-gray-900 tracking-tight">{btn.label}</span>
            </button>
          ))}
        </div>

        {/* 2. Diferenciais Empresas Maggi */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Diferenciais Empresas Maggi</h3>
          <div className="space-y-3">
            {DIFFERENTIALS.map((diff, i) => (
              <div key={i} className="flex items-start gap-4 p-5 bg-white border border-gray-50 rounded-3xl">
                <div className="p-3 bg-blue-50/50 rounded-2xl text-[#1473e6]">
                  {diff.icon === 'shield' ? <Shield size={20} /> : diff.icon === 'award' ? <Award size={20} /> : <CheckCircle2 size={20} />}
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-black uppercase text-gray-900">{diff.title}</h4>
                  <p className="text-[10px] text-gray-500 font-medium leading-relaxed">{diff.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. DNA Institucional */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Nosso DNA</h3>
          <div className="space-y-3">
            <div className="p-6 bg-blue-50/30 rounded-3xl border border-blue-100/50 space-y-3">
              <div className="flex items-center gap-2 text-[#1473e6]">
                <Target size={18} />
                <h4 className="text-[10px] font-black uppercase">Missão</h4>
              </div>
              <p className="text-[11px] text-gray-600 leading-relaxed font-medium italic">"{DNA.mission}"</p>
            </div>
            <div className="p-6 bg-blue-50/30 rounded-3xl border border-blue-100/50 space-y-3">
              <div className="flex items-center gap-2 text-[#1473e6]">
                <Eye size={18} />
                <h4 className="text-[10px] font-black uppercase">Visão</h4>
              </div>
              <p className="text-[11px] text-gray-600 leading-relaxed font-medium italic">"{DNA.vision}"</p>
            </div>
            <div className="p-6 bg-blue-50/30 rounded-3xl border border-blue-100/50 space-y-3">
              <div className="flex items-center gap-2 text-[#1473e6]">
                <Award size={18} />
                <h4 className="text-[10px] font-black uppercase">Valores</h4>
              </div>
              <p className="text-[11px] text-gray-600 leading-relaxed font-medium italic">"{DNA.values}"</p>
            </div>
          </div>
        </div>

        {/* 4. NPS Condicional */}
        {showNpsBanner && (
          <div className="p-8 bg-white border-2 border-blue-50 rounded-[2.5rem] shadow-xl space-y-6">
            {npsStep === 'RATING' && (
              <>
                <div className="text-center space-y-2">
                  <MessageSquareHeart size={32} className="text-[#f89a1e] mx-auto" />
                  <h3 className="text-sm font-black uppercase text-gray-900">Sua opinião é fundamental</h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Recomendaria as Empresas Maggi?</p>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {[0, 2, 4, 6, 8, 10].map((score) => (
                    <button
                      key={score}
                      onClick={() => { setUserNps(score); setNpsStep('FEEDBACK'); }}
                      className={`py-4 rounded-2xl text-xs font-black transition-all active:scale-90 ${
                        score <= 4 ? 'bg-red-50 text-red-500' : score <= 7 ? 'bg-orange-50 text-orange-500' : 'bg-green-50 text-green-600'
                      }`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
              </>
            )}

            {npsStep === 'FEEDBACK' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black uppercase text-gray-900">Nota {userNps} selecionada</h3>
                  <button onClick={() => setNpsStep('RATING')} className="text-[8px] font-bold text-blue-600 uppercase underline">Alterar</button>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase text-gray-400">
                    {userNps! >= 8 ? "Deseja deixar um elogio?" : "O que motivou sua nota? (Obrigatório)"}
                  </label>
                  <textarea 
                    value={npsFeedback}
                    onChange={(e) => setNpsFeedback(e.target.value)}
                    placeholder="Seu comentário aqui..."
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-xs focus:outline-none min-h-[100px]"
                  />
                </div>

                <button 
                  onClick={handleNpsSubmit}
                  className="w-full bg-[#1473e6] text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest"
                >
                  Enviar Avaliação
                </button>
              </div>
            )}

            {npsStep === 'SUCCESS' && (
              <div className="text-center py-6 space-y-4 animate-in zoom-in-95">
                <CheckCircle2 size={40} className="text-green-500 mx-auto" />
                <div>
                  <h3 className="text-sm font-black uppercase text-gray-900">Obrigado!</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Sua avaliação ajuda as Empresas Maggi a crescerem.</p>
                </div>
                <button onClick={() => setShowNpsBanner(false)} className="text-[9px] font-black text-blue-600 uppercase">Fechar</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderStock = () => (
    <div className="p-6 space-y-6 animate-in fade-in pb-24">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-gray-400 pl-1">Selecione sua Cidade / Unidade</label>
          <div className="relative">
            <select 
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="w-full bg-white border border-gray-100 rounded-2xl p-4 text-xs font-bold appearance-none shadow-sm focus:outline-none"
            >
              {MOCK_UNITS.map(u => <option key={u.id} value={u.name}>{u.city} - {u.name}</option>)}
            </select>
            <MapPin size={16} className="absolute right-4 top-4 text-gray-300 pointer-events-none" />
          </div>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-2xl">
          <button onClick={() => setStockTab('NEW')} className={`flex-1 py-3 text-[10px] font-black uppercase rounded-xl transition-all ${stockTab === 'NEW' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}>Estoque 0Km</button>
          <button onClick={() => setStockTab('USED')} className={`flex-1 py-3 text-[10px] font-black uppercase rounded-xl transition-all ${stockTab === 'USED' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}>Seminovos</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {MOCK_VEHICLES.filter(v => v.type === stockTab).map((v) => (
          <div key={v.id} className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm">
            <img src={v.image} alt={v.model} className="h-44 w-full object-cover" />
            <div className="p-6 flex justify-between items-center">
              <div>
                <h3 className="text-xs font-black text-gray-900 uppercase">{v.model}</h3>
                <p className="text-sm font-black text-[#1473e6] mt-1">R$ {v.price.toLocaleString('pt-BR')}</p>
                <p className="text-[8px] font-bold text-gray-400 uppercase mt-1">{v.unit}</p>
              </div>
              <button onClick={() => openWhatsApp(`Tenho interesse no ${v.model} da unidade ${v.unit}.`)} className="bg-[#1473e6] text-white p-3.5 rounded-2xl">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMyVehicle = () => (
    <div className="p-6 space-y-6 animate-in fade-in pb-24">
      <div className="p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm space-y-6">
        <div className="flex justify-between items-start border-b border-gray-50 pb-4">
          <div className="space-y-1">
            <h3 className="text-lg font-black uppercase text-gray-900 leading-tight">VW Nivus Highline</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Placa: ABC-1234 • Cinza Moonstone</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-2xl text-[#1473e6]">
            <Car size={24} />
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase text-gray-900 flex items-center gap-2">
            <History size={14} className="text-blue-600" /> Dados Detran
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-gray-50 rounded-2xl">
              <p className="text-[8px] font-black uppercase text-gray-400">IPVA 2024</p>
              <p className="text-[10px] font-black text-green-600 uppercase mt-1">Pago</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl">
              <p className="text-[8px] font-black uppercase text-gray-400">Licenciamento</p>
              <p className="text-[10px] font-black text-green-600 uppercase mt-1">Em dia</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-[10px] font-black uppercase text-gray-900 flex items-center gap-2">
            <CheckCircle2 size={14} className="text-blue-600" /> Histórico Maggi
          </h4>
          <div className="space-y-2">
            {[
              { date: '12/05/2024', desc: 'Revisão de 20.000km', unit: 'Maggi Itu' },
              { date: '10/11/2023', desc: 'Troca de Óleo', unit: 'Maggi Indaiatuba' }
            ].map((h, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-blue-50/20 rounded-2xl border border-blue-50/50">
                <div>
                  <p className="text-[10px] font-black text-gray-800 uppercase">{h.desc}</p>
                  <p className="text-[8px] font-bold text-gray-400 uppercase">{h.date} • {h.unit}</p>
                </div>
                <FileText size={16} className="text-blue-300" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <button onClick={() => setActiveView(AppView.SCHEDULE)} className="w-full py-5 bg-[#1473e6] text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100">Agendar Novo Serviço</button>
    </div>
  );

  const renderConsortium = () => (
    <div className="p-6 space-y-8 animate-in fade-in pb-24">
       <div className="text-center space-y-3 pt-4">
        <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center mx-auto text-[#1473e6] shadow-inner">
          <PieChart size={40} />
        </div>
        <h2 className="text-xl font-black uppercase tracking-tight text-gray-900">Maggi Consórcios</h2>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider px-8 leading-relaxed">Planeje sua conquista sem juros com as cartas de crédito Maggi.</p>
        
        {/* Botão Quero Simular */}
        <button 
          onClick={() => openWhatsApp("Olá, gostaria de realizar uma simulação de consórcio.")}
          className="flex items-center justify-center gap-3 bg-[#1473e6] text-white w-full py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.1em] shadow-xl shadow-blue-100 active:scale-95 transition-all mt-4"
        >
          <Calculator size={18} />
          Quero Simular
        </button>
      </div>

      <div className="p-6 bg-[#1473e6] rounded-[2.5rem] text-white shadow-xl space-y-6">
         <h3 className="text-[10px] font-black uppercase tracking-widest border-b border-white/20 pb-2">Suas Cartas</h3>
         <div className="space-y-3">
            <div className="bg-white/10 p-4 rounded-2xl border border-white/20">
              <div className="flex justify-between items-start">
                <p className="text-[8px] font-black uppercase opacity-60">Cota Automóveis</p>
                <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-green-500 rounded-full">Contemplada</span>
              </div>
              <p className="text-lg font-black mt-1">R$ 85.000,00</p>
            </div>
         </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Escolha sua modalidade</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Carros', icon: Car },
            { label: 'Motos', icon: Bike },
            { label: 'Caminhões', icon: Truck },
            { label: 'Agro', icon: Tractor },
            { label: 'Imóveis', icon: HomeIcon },
            { label: 'Serviços', icon: Wrench }
          ].map((m, i) => (
            <button key={i} className="flex flex-col items-center gap-3 p-6 bg-white border border-gray-100 rounded-3xl active:scale-95 transition-all shadow-sm">
              <m.icon size={24} className="text-[#1473e6]" />
              <span className="text-[9px] font-black uppercase text-gray-900">{m.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderInsurance = () => (
    <div className="p-6 space-y-8 animate-in fade-in pb-24">
      <div className="text-center space-y-3 pt-4">
        <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center mx-auto text-[#1473e6] shadow-inner">
          <ShieldCheck size={40} />
        </div>
        <h2 className="text-xl font-black uppercase tracking-tight text-gray-900">Maggi Seguros</h2>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider px-8 leading-relaxed">Proteção completa para o seu patrimônio com a segurança das Empresas Maggi.</p>
        
        {/* Botão Quero Simular */}
        <button 
          onClick={() => openWhatsApp("Olá, gostaria de realizar uma simulação de seguro.")}
          className="flex items-center justify-center gap-3 bg-[#1473e6] text-white w-full py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.1em] shadow-xl shadow-blue-100 active:scale-95 transition-all mt-4"
        >
          <Calculator size={18} />
          Quero Simular
        </button>
      </div>

      {/* Meus Seguros */}
      <div className="p-6 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-50 pb-4">
          <h3 className="text-[10px] font-black uppercase text-gray-400">Meus Seguros Ativos</h3>
          <span className="text-[8px] font-black bg-green-50 text-green-600 px-2 py-0.5 rounded-full uppercase">1 Ativo</span>
        </div>
        <div className="flex items-center gap-4">
           <div className="p-3 bg-blue-50 rounded-2xl text-[#1473e6]"><FileText size={20} /></div>
           <div>
              <h3 className="text-xs font-black uppercase text-gray-900">Seguro Auto Premium</h3>
              <p className="text-[8px] font-bold text-gray-400 uppercase">Azul Seguros • Até 15/12/2024</p>
           </div>
        </div>
        <button className="w-full py-3 bg-gray-50 rounded-xl text-[9px] font-black uppercase text-blue-600">Ver Apólice</button>
      </div>

      {/* Categorias de Seguros Maggi */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Nossas Soluções de Seguro</h3>
        <div className="grid grid-cols-2 gap-3">
          {INSURANCE_CATEGORIES.map((item) => {
            const Icon = {
              car: Car,
              home: HomeIcon,
              heart: Heart,
              briefcase: Briefcase,
              tractor: Tractor,
              wrench: Wrench
            }[item.icon] || Shield;

            return (
              <button 
                key={item.id} 
                onClick={() => openWhatsApp(`Olá, gostaria de saber mais sobre o Seguro ${item.label}.`)}
                className="flex flex-col items-center gap-3 p-6 bg-white border border-gray-100 rounded-3xl active:scale-95 transition-all shadow-sm text-center"
              >
                <div className="p-3 bg-blue-50 rounded-2xl text-[#1473e6]">
                  <Icon size={24} />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-gray-900 block">{item.label}</span>
                  <span className="text-[7px] font-bold text-gray-400 uppercase block leading-tight">{item.description}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="p-6 space-y-8 animate-in fade-in pb-24">
      <div className="text-center space-y-3 pt-4">
        <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center mx-auto text-[#1473e6] shadow-inner">
          <Wrench size={40} />
        </div>
        <h2 className="text-xl font-black uppercase tracking-tight text-gray-900">Agendamento Online</h2>
        <div className="flex items-center justify-center gap-2 bg-blue-50/50 py-2 px-4 rounded-full mx-auto w-fit">
          <MapPin size={12} className="text-[#1473e6]" />
          <span className="text-[9px] font-black uppercase text-gray-600">Agendando em: {selectedUnit}</span>
        </div>
      </div>

      {/* Escolha da Unidade (Contexto) */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-gray-400 pl-1">Alterar Unidade</label>
        <select 
          value={selectedUnit}
          onChange={(e) => setSelectedUnit(e.target.value)}
          className="w-full bg-white border border-gray-100 rounded-2xl p-4 text-xs font-bold appearance-none shadow-sm focus:outline-none"
        >
          {MOCK_UNITS.map(u => <option key={u.id} value={u.name}>{u.city} - {u.name}</option>)}
        </select>
      </div>

      {/* Opções de Serviços */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Selecione o Serviço</h3>
        <div className="grid grid-cols-2 gap-3">
          {SERVICE_OPTIONS.map((service) => {
            const Icon = {
              droplet: Droplet,
              disc: Disc,
              'clipboard-list': ClipboardList,
              'map-pin': MapPin
            }[service.icon] || Wrench;

            return (
              <button 
                key={service.id} 
                onClick={() => openWhatsApp(`Olá, gostaria de agendar uma ${service.label} na unidade ${selectedUnit}.`)}
                className="flex flex-col items-center gap-3 p-6 bg-white border border-gray-100 rounded-3xl active:scale-95 transition-all shadow-sm text-center"
              >
                <div className="p-3 bg-blue-50 rounded-2xl text-[#1473e6]">
                  <Icon size={24} />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-gray-900 block">{service.label}</span>
                  <span className="text-[7px] font-bold text-gray-400 uppercase block leading-tight">{service.description}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* CTA Adicional */}
      <div className="p-6 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200 text-center space-y-2">
        <p className="text-[9px] font-black uppercase text-gray-500">Precisa de outro serviço?</p>
        <button onClick={() => openWhatsApp(`Olá, preciso de um serviço específico para meu carro na unidade ${selectedUnit}.`)} className="text-xs font-black uppercase text-[#1473e6] underline">Falar com Consultor Técnico</button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeView) {
      case AppView.HOME: return renderHome();
      case AppView.STOCK: return renderStock();
      case AppView.MY_VEHICLE: return renderMyVehicle();
      case AppView.CONSORTIUM: return renderConsortium();
      case AppView.INSURANCE: return renderInsurance();
      case AppView.SCHEDULE: return renderSchedule();
      case AppView.UNITS: return (
        <div className="p-6 space-y-4 animate-in fade-in pb-24">
          <h2 className="text-sm font-black uppercase text-gray-900 pl-1">Unidades Empresas Maggi</h2>
          {MOCK_UNITS.map(unit => (
            <div key={unit.id} className="p-6 bg-white border border-gray-100 rounded-3xl space-y-3 shadow-sm group active:bg-blue-50/30 transition-colors">
              <h3 className="font-black uppercase text-[11px] text-[#1473e6] flex items-center gap-2"><MapPin size={14} /> {unit.name}</h3>
              <p className="text-[10px] text-gray-500 font-medium leading-tight">{unit.address} • {unit.city}/{unit.state}</p>
              <button onClick={() => openWhatsApp(`Contato unidade ${unit.name}`)} className="w-full py-3 bg-blue-50 rounded-xl text-[9px] font-black uppercase text-[#1473e6]">Contato Unidade</button>
            </div>
          ))}
        </div>
      );
      case AppView.CHAT: return <div className="p-8 text-center pt-20 animate-in fade-in">
        <Sparkles size={40} className="mx-auto text-blue-500 opacity-20" />
        <p className="text-[10px] font-black uppercase text-gray-400 mt-4">MaggiBot está em manutenção.</p>
      </div>;
      case AppView.PROFILE: return <div className="p-8 text-center pt-20 animate-in fade-in">
        <User size={40} className="mx-auto text-blue-500 opacity-20" />
        <p className="text-[10px] font-black uppercase text-gray-400 mt-4">Perfil do Usuário.</p>
      </div>;
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
