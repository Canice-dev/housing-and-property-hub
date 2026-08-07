export const formatPrice = (value: number): string => {
  if (value >= 1000000) {
    const naira = (value / 1000000).toFixed(1).replace(/\.0$/, "");
    return `₦${naira}M`;
  }
  if (value >= 100000) {
    const l = (value / 1000).toFixed(1).replace(/\.0$/, "");
    return `₦${l}K`;
  }
  return `₦${value.toLocaleString()}`;
};
