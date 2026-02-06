export const UtilityService = {
  formatNumber(value) {
    if (value >= 1_000_000) {
      return parseInt(value / 1_000_000) + "M";
    } else if (value >= 1_000) {
      return parseInt(value / 1_000) + "K";
    } else if (typeof value === "string") {
      return value.toString();
    } else {
      return parseInt(value);
    }
  },
  formatNumberInThousands(value) {
    return parseInt(value / 1_000) + "K";
  },

  formatNumberInThousandsOptimal(value) {
    // Check if the input is a range
    if (typeof value === "string" && value.includes("-")) {
      const [start, end] = value.split("-").map(Number); // Split and convert to numbers
      return `${(start / 1_000).toFixed(2)}K - ${(end / 1_000).toFixed(2)}K`;
    }

    // Format a single number
    return (value / 1_000).toFixed(2) + "K";
  },
};
