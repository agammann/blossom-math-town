export const COUNT_ROUNDS = [3, 5, 2, 7, 10, 4, 8, 1, 6, 9];
export const SNACK_ROUNDS = [5, 7, 2, 9, 0, 10, 1, 6, 3, 8, 4];
export const WORDS = ['zero','one','two','three','four','five','six','seven','eight','nine','ten'];
export function checkCount(expected, answer) {
  return Number.isInteger(expected) && expected >= 1 && expected <= 10 && Number.isInteger(answer) && answer === expected;
}
export function snackResult(given, added) {
  if (!Number.isInteger(given) || !Number.isInteger(added) || given < 0 || given > 10 || added < 0 || added > 10 - given) throw new RangeError('Invalid ten-frame');
  return {total:given + added, needed:10 - given, correct:given + added === 10};
}
export function roundValue(kind, set, index) {
  const sequence = kind === 'count' ? COUNT_ROUNDS : SNACK_ROUNDS;
  return sequence[(set * 5 + index) % sequence.length];
}
