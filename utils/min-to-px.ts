/**
 * @param {number} min - Date in miliseconds
 */
export const minToPx = (min: number): number => {
  return Math.floor(min / 60000 / 15) * 20;
};
