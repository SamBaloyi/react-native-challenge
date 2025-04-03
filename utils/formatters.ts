/**
 * Formats a given Date object into a localized string representation.
 *
 * The formatted string includes the year, abbreviated month, day, 
 * hour, and minute in the 'en-US' locale.
 *
 * @param date - The Date object to format.
 * @returns A string representing the formatted date and time.
 */
export const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };


/**
 * Truncates a given text to a specified maximum length and appends an ellipsis ('...') if the text exceeds that length.
 *
 * @param text - The input string to be truncated.
 * @param maxLength - The maximum allowed length of the truncated string.
 * @returns The truncated string with an ellipsis if it exceeds the maximum length, or the original string if it does not.
 */
  export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };
  
/**
 * Formats a number by adding commas as thousand separators.
 *
 * @param num - The number to be formatted.
 * @returns A string representation of the number with commas as thousand separators.
 */
  export const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };