export type FairSplitInput = {
  total: number;
  people: number;
  drinkers: number;
  cups: number;
  cupPrice: number;
};

export type FairSplitResult = {
  nondrinkerPay: number;
  drinkerPay: number;
  drinkerPayPlusOneCount: number;
  nonDrinkers: number;
  totalCheck: number;
};

export function calculateFairSplit(input: FairSplitInput): FairSplitResult {
  const { total, people, drinkers, cups, cupPrice } = input;

  validateInput(input);

  const nonDrinkers = people - drinkers;
  const extra = drinkers * cups * cupPrice;
  const basePool = total - extra;
  const base = basePool / people;

  const nondrinkerFloor = Math.floor(base);
  const drinkerFloor = Math.floor(base + cups * cupPrice);

  const floorSum = nondrinkerFloor * nonDrinkers + drinkerFloor * drinkers;
  let remainder = total - floorSum;

  let nondrinkerPay = nondrinkerFloor;
  let drinkerPay = drinkerFloor;
  let drinkerPayPlusOneCount = 0;

  if (remainder > 0) {
    if (drinkers > 0) {
      const addPerDrinker = Math.floor(remainder / drinkers);
      drinkerPay += addPerDrinker;
      remainder -= addPerDrinker * drinkers;

      drinkerPayPlusOneCount = remainder;
      remainder = 0;
    } else {
      const addPerNonDrinker = Math.floor(remainder / nonDrinkers);
      nondrinkerPay += addPerNonDrinker;
      remainder -= addPerNonDrinker * nonDrinkers;
    }
  }

  const totalCheck =
    nondrinkerPay * nonDrinkers +
    drinkerPay * drinkers +
    drinkerPayPlusOneCount +
    remainder;

  return {
    nondrinkerPay,
    drinkerPay,
    drinkerPayPlusOneCount,
    nonDrinkers,
    totalCheck,
  };
}

function validateInput(input: FairSplitInput): void {
  const { total, people, drinkers, cups, cupPrice } = input;

  for (const [key, value] of Object.entries({ total, people, drinkers, cups, cupPrice })) {
    if (!Number.isFinite(value)) {
      throw new Error(`${key} must be a finite number.`);
    }
  }

  if (people <= 0) {
    throw new Error('people must be greater than 0.');
  }

  if (drinkers < 0 || drinkers > people) {
    throw new Error('drinkers must be between 0 and people.');
  }

  if (total < 0 || cups < 0 || cupPrice < 0) {
    throw new Error('total, cups and cupPrice must be 0 or greater.');
  }

  for (const [key, value] of Object.entries({ total, people, drinkers, cups, cupPrice })) {
    if (!Number.isInteger(value)) {
      throw new Error(`${key} must be an integer.`);
    }
  }
}
