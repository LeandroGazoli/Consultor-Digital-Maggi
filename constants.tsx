
import { Vehicle, Campaign, Unit } from './types';

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
  { id: 'u5', name: 'Maggi Curitiba', state: 'PR', city: 'Curitiba', brands: ['Volkswagen'], address: 'Av. das Torres, 4500', phone: '(41) 3012-1000', distance: 410.5 },
  { id: 'u6', name: 'Maggi Londrina', state: 'PR', city: 'Londrina', brands: ['Toyota'], address: 'Av. Tiradentes, 2500', phone: '(43) 3371-2000', distance: 520.0 },
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
    unit: 'Itu - Matriz'
  },
  {
    id: '2',
    brand: 'Toyota',
    model: 'Corolla Cross XRE',
    year: '2022/2023',
    km: 24500,
    price: 158900,
    image: 'https://images.unsplash.com/photo-1625231334168-35067f8853ed?q=80&w=800&auto=format&fit=crop',
    type: 'USED',
    transmission: 'Automático',
    fuel: 'Flex',
    unit: 'Indaiatuba'
  },
  {
    id: '3',
    brand: 'BYD',
    model: 'Dolphin Mini',
    year: '2024/2025',
    km: 0,
    price: 115800,
    image: 'https://images.unsplash.com/photo-1711110058913-912f232f38cc?q=80&w=800&auto=format&fit=crop',
    type: 'NEW',
    transmission: 'Automático',
    fuel: 'Elétrico',
    unit: 'Itu - Shopping'
  }
];

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 'c1',
    title: 'Festival de Seminovos Maggi',
    subtitle: 'Taxas reduzidas de 0,99% a.m. e primeira parcela para 90 dias.',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200&auto=format&fit=crop',
    validUntil: '30/11/2024',
    type: 'SALES',
    badge: 'Oportunidade'
  },
  {
    id: 'c2',
    title: 'Revisão Maggi Toyota',
    subtitle: 'Mantenha sua garantia com parcelas em até 10x sem juros no cartão.',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=1200&auto=format&fit=crop',
    validUntil: '15/12/2024',
    type: 'SERVICE',
    badge: 'Pós-Venda'
  },
  {
    id: 'c3',
    title: 'BYD Dolphin Mini: Oferta Zero',
    subtitle: 'Bônus de R$ 5.000,00 na troca do seu usado por um 100% elétrico.',
    image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=1200&auto=format&fit=crop',
    validUntil: '20/11/2024',
    type: 'SALES',
    badge: 'Novo 0km'
  },
  {
    id: 'c4',
    title: 'Check-up de Verão Maggi',
    subtitle: 'Higienização do ar-condicionado + 25 itens inspecionados grátis.',
    image: 'https://images.unsplash.com/photo-1562621371-1d90467ae68d?q=80&w=1200&auto=format&fit=crop',
    validUntil: '31/12/2024',
    type: 'SERVICE',
    badge: 'Segurança'
  }
];

export const BRANDS = ['Fiat', 'Volkswagen', 'Toyota', 'BYD', 'Jeep', 'Peugeot', 'Citroën'];
export const UNITS = ['Itu', 'Indaiatuba', 'Salto', 'Porto Feliz', 'Sorocaba'];
export const SERVICES = ['Revisão Periódica', 'Troca de Óleo', 'Diagnóstico/Barulho', 'Recall', 'Funilaria/Pintura'];
