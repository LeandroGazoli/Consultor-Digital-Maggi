
import React from 'react';

const SpecificationDoc: React.FC = () => {
  return (
    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section>
        <h2 className="text-2xl font-black text-[#0a1d37] border-b-4 border-[#1473e6] pb-2 inline-block uppercase tracking-tight">1. Brand Identity</h2>
        <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#1473e6] text-white text-center shadow-lg">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Primary Color</p>
                <p className="font-bold text-sm">#1473E6 (Azul)</p>
            </div>
            <div className="p-4 rounded-xl bg-[#f89a1e] text-white text-center shadow-lg">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Accent Color</p>
                <p className="font-bold text-sm">#F89A1E (Laranja)</p>
            </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-black text-[#0a1d37] uppercase tracking-tight">2. Financial Modules</h2>
        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-3">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#1473e6] flex items-center justify-center font-bold">1</div>
                <p className="text-sm font-bold text-gray-700">Simulador de Crédito em Tempo Real.</p>
            </div>
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#f89a1e] flex items-center justify-center font-bold">2</div>
                <p className="text-sm font-bold text-gray-700">Consulta de Cotas de Consórcio Maggi.</p>
            </div>
        </div>
      </section>

      <div className="bg-blue-50 p-6 rounded-3xl text-center border border-blue-100">
        <p className="text-[10px] text-[#1473e6] font-black uppercase tracking-[0.3em] mb-2">Maggi Conversion Stack</p>
        <p className="text-sm text-gray-600 font-medium italic">"Transformando interesse em mobilidade com segurança e tradição."</p>
      </div>
    </div>
  );
};

export default SpecificationDoc;
