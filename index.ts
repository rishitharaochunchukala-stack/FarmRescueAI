export type Unit = 'kg' | 'tonne' | 'crate' | 'sack' | 'bunch';

export interface Produce {
  id: string;
  farmerName: string;
  cropName: string;
  category: string;
  quantity: number;
  unit: Unit;
  price: number;
  location: string;
  contact: string;
  image: string;
  urgent: boolean;
  harvestDate: string;
  description?: string;
}

export interface AIResponse {
  question: string;
  answer: string;
  suggestions: string[];
  timestamp: string;
}

export type Page =
  | 'home'
  | 'dashboard'
  | 'marketplace'
  | 'list-produce'
  | 'rescue'
  | 'ai'
  | 'about'
  | 'contact';
