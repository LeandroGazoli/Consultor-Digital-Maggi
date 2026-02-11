
export enum AppView {
  HOME = 'home',
  SCHEDULE = 'schedule',
  STOCK = 'stock',
  MY_VEHICLE = 'my_vehicle',
  INSURANCE = 'insurance',
  CONSORTIUM = 'consortium',
  UNITS = 'units',
  PROFILE = 'profile',
  CHAT = 'chat'
}

export interface Unit {
  id: string;
  name: string;
  state: string;
  city: string;
  brands: string[];
  address: string;
  phone: string;
  distance?: number;
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

export interface ServiceHistory {
  id: string;
  date: string;
  description: string;
  unit: string;
  price: number;
}
