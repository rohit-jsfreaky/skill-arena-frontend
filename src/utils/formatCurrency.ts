export const formatCurrency = (amount: number): string => {
  if (amount >= 10000000) { // 1 Crore or more
    return `${(amount / 10000000).toFixed(1)}Cr`;
  }
  if (amount >= 100000) { // 1 Lakh or more
    return `${(amount / 100000).toFixed(1)}L`;
  }
  if (amount >= 1000) { // 1 Thousand or more
    return `${(amount / 1000).toFixed(1)}K`;
  }
  return amount.toString();
};