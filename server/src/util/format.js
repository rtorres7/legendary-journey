const formatValue = (value) => {
  if (value >= 1e9) {
    return (value / 1e9).toFixed(1) + "b"; // For billions
  }
  if (value >= 1e6) {
    return (value / 1e6).toFixed(1) + "m"; // For millions
  }
  if (value >= 1e3) {
    return (value / 1e3).toFixed(1) + "k"; // For thousands
  }
  return value.toString(); // For tens and hundreds
};

module.exports = {
  formatValue,
};
