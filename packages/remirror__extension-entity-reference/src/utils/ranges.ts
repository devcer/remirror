import { EntityReferenceMetaData } from '../types';

/**
 * Helper function to extract the extreme boundaries of the passed array of highlights.
 * minimum `from` and the maximum `to`
 */
export const findMinMaxRange = (
  array: Array<Pick<EntityReferenceMetaData, 'from' | 'to'>>,
): [number, number] => {
  if (array.length === 0) {
    return [0, 0]; // Handle empty array case
  }

  let min = array[0].from;
  let max = array[0].to;

  for (const item of array) {
    min = Math.min(min, item.from);
    max = Math.max(max, item.to);
  }

  return [min, max];
};
