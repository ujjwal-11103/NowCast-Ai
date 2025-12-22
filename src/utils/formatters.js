
/**
 * Formats a number according to Indian Numbering System with dynamic scaling.
 * @param {number} value - The number to format.
 * @param {boolean} isCurrency - If true, adds '₹ ' prefix.
 * @returns {string} - The formatted string.
 */
export const formatIndianNumber = (value, isCurrency = false) => {
    if (value === null || value === undefined) return "N/A";

    const absValue = Math.abs(value);
    let formattedValue = value;
    let suffix = "";

    // 1 Crore = 1,00,00,000
    if (absValue >= 10000000) {
        formattedValue = (value / 10000000).toFixed(2);
        suffix = " Cr";
    }
    // 1 Lakh = 1,00,000
    else if (absValue >= 100000) {
        formattedValue = (value / 100000).toFixed(2);
        suffix = " L";
    }
    // 1 Thousand = 1,000
    else if (absValue >= 1000) {
        formattedValue = (value / 1000).toFixed(2);
        suffix = " K";
    } else {
        // Less than 1000, show actual value, possibly rounded to 2 decimals if it has decimals
        // or just toFixed(2) to be consistent with "Round to 2 decimal places" rule.
        // If it's an integer, maybe we don't need decimals? 
        // User rule: "Round to 2 decimal places". I will apply it broadly for consistency.
        formattedValue = value.toFixed(2);
        // If it's basically an integer (e.g. 500.00), maybe show 500?
        // User example: 45,600 -> 45.6 K.
        // Let's stick to .toFixed(2) and remove trailing zeros if user prefers, 
        // but strictly "Round to 2 decimal places" usually implies fixed precision.
        // I'll use parseFloat to strip trailing zeros for cleaner look if it's .00?
        // No, standard financial reporting often keeps .00. 
        // I will strict to .toFixed(2) for now.
        // However, for < 1000, e.g. 5 units, "5.00" might look weird if it's volume.
        // But for currency "₹ 5.00" is fine.
        // "Volume units like Liters (L) remain unchanged" -> This is a different rule.
        // I will output toFixed(2) always as per "Round to 2 decimal places".

        // Cleanup: Remove .00 if it's an integer? 
        // "45.6 K" (1 decimal in example despite 2 recommended?)
        // I will use Number(...).toFixed(2) then maybe parseFloat to remove redundant zeros if needed, 
        // but usually reports prefer fixed width.
        // I'll stick to string with 2 decimals.
    }

    // Remove .00 if user wants cleaner look? 
    // "12.5 L" in example. 12.50? 
    // I will convert to number and back to string to remove trailing zeros?
    // "Round to 2 decimal places" is the rule. 
    // "45,600 -> 45.6 K" (1 decimal).
    // "12,50,000 -> 12.5 L" (1 decimal).
    // "10,49,80,235 -> 104.98 Cr" (2 decimals).
    // It seems the rule is "Max 2 decimal places" or "Up to 2 decimal places, stripping trailing zeros".
    // I'll use `parseFloat(Number(...).toFixed(2))` which achieves this (e.g. 12.50 -> 12.5).

    const finalNum = parseFloat(formattedValue);

    if (isCurrency) {
        return `₹ ${finalNum}${suffix}`;
    }
    return `${finalNum}${suffix}`;
};
