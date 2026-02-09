
export enum AppView {
  HOME = 'home',
  SCHEDULE = 'schedule',
  STOCK = 'stock',
  FAVORITES = 'favorites',
  UNITS = 'units',
  PROFILE = 'profile',
  SPEC = 'spec',
  CHAT = 'chat',
  MY_VEHICLE = 'my_vehicle',
  OFFERS = 'offers',
  CONSORTIUM = 'consortium'
}

export interface Unit {
  id: string;
  name: string;
  state: string;
  city: string;
  brands: string[];
  address: string;
  phone: string;
  distance?: number; // em km
}

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: string;
  km: number;
  price: number;
  image: string;
  type: 'NEW' | 'USED';
  transmission: string;
  fuel: string;
  unit: string;
}

export interface Campaign {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  validUntil: string;
  type: 'SALES' | 'SERVICE';
  badge?: string;
}

export interface Appointment {
  id: string;
  unit: string;
  brand: string;
  service: string;
  date: string;
  time: string;
  vehiclePlate?: string;
}
