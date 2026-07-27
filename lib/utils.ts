export const formatPrice = (value: number): string => {
  if (value >= 10000000) {
    const naira = (value / 10000000).toFixed(1).replace(/\.0$/, "");
    return `₦${naira}M`;
  }
  if (value >= 100000) {
    const l = (value / 100000).toFixed(1).replace(/\.0$/, "");
    return `₦${l}K`;
  }
  return `₦${value.toLocaleString()}`;
};
