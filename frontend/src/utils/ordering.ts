interface IOrdering<T> {
  positionBefore: (a: T) => T;
  positionAfter: (a: T) => T;
  positionBetween: (a: T, b: T) => T;
  positionsEqual: (a: T, b: T) => boolean;
  comparePositions: (a: T, b: T) => number;
  isValidPosition: (a: T) => boolean;
  BASE: T;
}

export const Ordering: IOrdering<number> = {
  positionBefore: (a) => Math.trunc(a / 2),
  positionAfter: (a) => a + 16384,
  positionBetween: (a, b) => Math.trunc((a + b) / 2),
  positionsEqual: (a, b) => a === b,
  comparePositions: (a, b) => a - b,
  isValidPosition: (a) => a > 1,
  BASE: 16384,
};
