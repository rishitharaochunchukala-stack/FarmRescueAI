import type { Produce, Destination, Recommendation, ProduceCondition, DestinationType } from '@/types';

const DESTINATION_TYPE_LABELS: Record<DestinationType, string> = {
  buyer_retailer: 'Buyer / Retailer / Market',
  food_donation: 'Verified Food Donation Organisation',
  food_processor: 'Food Processor',
  juice_vendor: 'Juice Vendor / Smoothie Business',
  composting: 'Organic-Waste / Composting Facility',
};

export function getDestinationTypeLabel(type: DestinationType): string {
  return DESTINATION_TYPE_LABELS[type] ?? type;
}

function extractState(location: string): string | null {
  const parts = location.split(',').map((p) => p.trim());
  if (parts.length < 2) return null;
  const lastPart = parts[parts.length - 1];
  const knownStates = [
    'Maharashtra', 'Karnataka', 'Haryana', 'Punjab',
    'Madhya Pradesh', 'Gujarat', 'Rajasthan', 'Tamil Nadu',
    'Kerala', 'Andhra Pradesh', 'Telangana', 'Uttar Pradesh',
    'Bihar', 'West Bengal', 'Odisha', 'Assam', 'Chhattisgarh',
    'Jharkhand', 'Goa', 'Delhi', 'Jammu and Kashmir', 'Himachal Pradesh',
    'Uttarakhand', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
    'Sikkim', 'Tripura', 'Arunachal Pradesh',
  ];
  return knownStates.find((s) => lastPart.toLowerCase() === s.toLowerCase()) ?? null;
}

function quantityMatches(destination: Destination, produce: Produce): boolean {
  if (destination.minQuantity === null && destination.maxQuantity === null) {
    return true;
  }
  const qty = produce.quantity;
  const unitMatches = destination.unit === null || destination.unit === produce.unit;
  if (!unitMatches && destination.minQuantity !== null) {
    return true;
  }
  if (destination.minQuantity !== null && qty < destination.minQuantity) {
    return false;
  }
  if (destination.maxQuantity !== null && qty > destination.maxQuantity) {
    return false;
  }
  return true;
}

function matchDestinations(
  condition: ProduceCondition,
  produce: Produce,
  allDestinations: Destination[]
): Destination[] {
  return allDestinations.filter((d) => {
    if (!d.verified) return false;
    if (!d.acceptedConditions.includes(condition)) return false;
    if (!quantityMatches(d, produce)) return false;
    const produceState = extractState(produce.location);
    if (produceState && d.state && d.state.toLowerCase() !== produceState.toLowerCase()) {
      return false;
    }
    return true;
  });
}

const RULES: Record<
  ProduceCondition,
  {
    classification: string;
    reason: string;
    destinationType: DestinationType | null;
    nextAction: string;
    inspectionRequired: boolean;
    humanConsumptionBlocked: boolean;
  }
> = {
  fresh_good: {
    classification: 'Fresh surplus — ready for market',
    reason:
      'This produce is fresh and in good condition. It is safe for direct human consumption and suitable for sale to buyers, retailers, or donation to verified food relief organisations.',
    destinationType: 'buyer_retailer',
    nextAction:
      'List on the marketplace and contact buyers directly. Fresh surplus can also be donated to a verified food donation organisation in your region.',
    inspectionRequired: false,
    humanConsumptionBlocked: false,
  },
  cosmetically_damaged: {
    classification: 'Cosmetically damaged — safe but imperfect',
    reason:
      'This produce has surface blemishes or minor bruising but is still safe to eat or process. It is not suitable for standard retail sale at full price, but can be sold at a discount or sent to a food processor when it remains safe and suitable for that use.',
    destinationType: 'food_processor',
    nextAction:
      'Offer at a suitable discount (20–30% below original price) on the marketplace, or contact a food processor that accepts cosmetically damaged produce. Do not sell at full retail price.',
    inspectionRequired: false,
    humanConsumptionBlocked: false,
  },
  overripe: {
    classification: 'Overripe but still safe — highly perishable',
    reason:
      'This produce is past peak ripeness but remains safe for consumption. It is not suitable for retail sale but is ideal for juice production, smoothies, or food processing. Overripe produce deteriorates rapidly — urgency is high.',
    destinationType: 'juice_vendor',
    nextAction:
      'Contact juice vendors, smoothie businesses, or food processors that accept overripe produce immediately. Do not list for retail sale. Act within hours — perishability is critical.',
    inspectionRequired: false,
    humanConsumptionBlocked: false,
  },
  rotten_decayed: {
    classification: 'Spoiled — not safe for human consumption',
    reason:
      'This produce is moldy, fermented, contaminated, or decayed. It is NOT safe for human consumption under any circumstances. All human-consumption destinations (buyers, retailers, donation organisations, processors, juice vendors) are blocked. The only safe route is an organic-waste or composting facility.',
    destinationType: 'composting',
    nextAction:
      'Do NOT route this produce to any human-consumption destination. Contact an organic-waste or composting facility for safe disposal. Consuming or donating this produce is a health hazard.',
    inspectionRequired: false,
    humanConsumptionBlocked: true,
  },
  uncertain: {
    classification: 'Condition unclear — inspection required',
    reason:
      'The condition of this produce cannot be determined without physical inspection. No routing to any consumption or donation destination can be recommended until a qualified person has inspected the produce and confirmed its condition.',
    destinationType: null,
    nextAction:
      'Arrange for a physical inspection of the produce before any sale, donation, or disposal. Once the condition is confirmed, update this listing to receive the correct routing recommendation.',
    inspectionRequired: true,
    humanConsumptionBlocked: true,
  },
};

export function getRecommendation(
  produce: Produce,
  destinations: Destination[]
): Recommendation {
  const rule = RULES[produce.condition] ?? RULES.fresh_good;

  if (rule.inspectionRequired) {
    return {
      classification: rule.classification,
      reason: rule.reason,
      recommendedDestinationType: null,
      destinationTypeLabel: 'None — inspection required',
      nextAction: rule.nextAction,
      matchedDestinations: [],
      inspectionRequired: true,
      humanConsumptionBlocked: true,
      noDestinationFound: false,
    };
  }

  const matched = matchDestinations(produce.condition, produce, destinations);

  const typeLabel = rule.destinationType
    ? getDestinationTypeLabel(rule.destinationType)
    : 'None';

  return {
    classification: rule.classification,
    reason: rule.reason,
    recommendedDestinationType: rule.destinationType,
    destinationTypeLabel: typeLabel,
    nextAction: rule.nextAction,
    matchedDestinations: matched,
    inspectionRequired: false,
    humanConsumptionBlocked: rule.humanConsumptionBlocked,
    noDestinationFound: matched.length === 0,
  };
}
