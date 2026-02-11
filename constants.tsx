
import { Vehicle, Unit } from './types';

export const COLORS = {
  primary: '#1473e6', // Azul Maggi
  secondary: '#f89a1e', // Laranja Maggi
  dark: '#0a1d37',
  light: '#f4f7fa',
};

export const MOCK_UNITS: Unit[] = [
  { id: 'u1', name: 'Maggi Itu Matriz', state: 'SP', city: 'Itu', brands: ['Volkswagen', 'Toyota'], address: 'Av. Tiradentes, 1000', phone: '(11) 4013-9000', distance: 2.5 },
  { id: 'u2', name: 'Maggi Indaiatuba', state: 'SP', city: 'Indaiatuba', brands: ['Volkswagen', 'BYD'], address: 'Av. Visconde de Indaiatuba, 500', phone: '(19) 3801-8000', distance: 15.2 },
  { id: 'u3', name: 'Maggi Salto', state: 'SP', city: 'Salto', brands: ['Toyota'], address: 'Rua Nove de Julho, 120', phone: '(11) 4602-7000', distance: 8.7 },
  { id: 'u4', name: 'Maggi Sorocaba', state: 'SP', city: 'Sorocaba', brands: ['Volkswagen', 'Jeep'], address: 'Av. Dom Aguirre, 2000', phone: '(15) 3212-9000', distance: 32.1 },
];

export const MOCK_VEHICLES: Vehicle[] = [
  {
    id: '1',
    brand: 'Volkswagen',
    model: 'Nivus Highline 200 TSI',
    year: '2024/2024',
    km: 0,
    price: 149990,
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=800&auto=format&fit=crop',
    type: 'NEW',
    transmission: 'Automático',
    fuel: 'Flex',
    unit: 'Maggi Itu Matriz'
  },
  {
    id: '2',
    brand: 'Toyota',
    model: 'Corolla Cross XRE',
    year: '2024/2025',
    km: 0,
    price: 182900,
    image: 'https://images.unsplash.com/photo-1625231334168-35067f8853ed?q=80&w=800&auto=format&fit=crop',
    type: 'NEW',
    transmission: 'Automático',
    fuel: 'Híbrido',
    unit: 'Maggi Indaiatuba'
  },
  {
    id: '4',
    brand: 'Volkswagen',
    model: 'T-Cross Comfortline',
    year: '2021/2021',
    km: 42000,
    price: 112900,
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=800&auto=format&fit=crop',
    type: 'USED',
    transmission: 'Automático',
    fuel: 'Flex',
    unit: 'Maggi Salto'
  },
];

export const MOCK_CAMPAIGNS = [
  {
    id: 'c1',
    title: 'Festival de Seminovos',
    subtitle: 'Taxas a partir de 0% em 24x',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop',
    cta: 'Ver Ofertas'
  },
  {
    id: 'c2',
    title: 'Revisão Premiada',
    subtitle: 'Ganhe 10% de desconto em peças',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=800&auto=format&fit=crop',
    cta: 'Agendar'
  },
  {
    id: 'c3',
    title: 'Novo BYD King',
    subtitle: 'O híbrido que mudou o mercado',
    image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=800&auto=format&fit=crop',
    cta: 'Conhecer'
  }
];

export const SERVICE_OPTIONS = [
  { id: 'oil', label: 'Troca de Óleo', icon: 'droplet', description: 'Lubrificantes originais e filtros novos.' },
  { id: 'tire', label: 'Pneu', icon: 'disc', description: 'Troca, alinhamento e balanceamento.' },
  { id: 'revision', label: 'Revisão', icon: 'clipboard-list', description: 'Revisão periódica por quilometragem.' },
  { id: 'trip', label: 'Check-up Pré-Viagem', icon: 'map-pin', description: 'Segurança total para sua família na estrada.' }
];

export const INSURANCE_CATEGORIES = [
  { id: 'auto', label: 'Automóveis', icon: 'car', description: 'Proteção completa para seu veículo.' },
  { id: 'home', label: 'Residencial', icon: 'home', description: 'Segurança para sua casa e família.' },
  { id: 'life', label: 'Vida', icon: 'heart', description: 'Cuidado para quem você mais ama.' },
  { id: 'business', label: 'Empresarial', icon: 'briefcase', description: 'Proteja o futuro do seu negócio.' },
  { id: 'agro', label: 'Agrícola', icon: 'tractor', description: 'Seguro rural para sua produção.' },
  { id: 'equip', label: 'Equipamentos', icon: 'wrench', description: 'Proteção para máquinas e ferramentas.' }
];

export const DNA = {
  mission: "Prover as melhores soluções de mobilidade, superando as expectativas de nossos clientes através de um atendimento de excelência e confiança.",
  vision: "Ser o grupo de concessionárias mais admirado do Brasil, liderando a transformação do setor automotivo com inovação e sustentabilidade.",
  values: "Ética Absoluta em todos os negócios, Foco total no Cliente, Inovação constante nos processos e valorização da nossa Gente Maggi."
};

export const DIFFERENTIALS = [
  { title: 'Segurança Garantida', desc: 'Todos os veículos passam por rigorosa perícia cautelar e revisão mecânica completa.', icon: 'shield' },
  { title: 'Tradição Maggi', desc: 'Mais de 40 anos de história entregando confiança e os melhores negócios do mercado.', icon: 'award' },
  { title: 'Pós-Venda Premium', desc: 'Assistência técnica especializada com peças originais e profissionais certificados pelas montadoras.', icon: 'check' }
];
