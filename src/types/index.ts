export type Unit = 'kg' | 'tonne' | 'crate' | 'sack' | 'bunch';

export type Availability = 'surplus' | 'not_surplus';

export type ProduceCondition =
  | 'fresh_good'
  | 'cosmetically_damaged'
  | 'overripe'
  | 'rotten_decayed'
  | 'uncertain';

export type DestinationType =
  | 'buyer_retailer'
  | 'food_donation'
  | 'food_processor'
  | 'juice_vendor'
  | 'composting';

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
  availability: Availability;
  condition: ProduceCondition;
}

export interface Destination {
  id: string;
  name: string;
  destinationType: DestinationType;
  acceptedConditions: ProduceCondition[];
  location: string;
  state: string;
  minQuantity: number | null;
  maxQuantity: number | null;
  unit: string | null;
  contact: string;
  verified: boolean;
}

export interface Recommendation {
  classification: string;
  reason: string;
  recommendedDestinationType: DestinationType | null;
  destinationTypeLabel: string;
  nextAction: string;
  matchedDestinations: Destination[];
  inspectionRequired: boolean;
  humanConsumptionBlocked: boolean;
  noDestinationFound: boolean;
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
