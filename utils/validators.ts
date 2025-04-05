/**
 * Checks if a given string is empty or contains only whitespace characters.
 *
 * @param value - The string to be checked.
 * @returns `true` if the string is empty or contains only whitespace, otherwise `false`.
 */
export const isEmpty = (value: string): boolean => {
  return value.trim() === "";
};

/**
 * Checks if a given string can be converted to a valid number.
 *
 * @param value - The string to be checked.
 * @returns `true` if the string can be converted to a number, otherwise `false`.
 */
export const isNumber = (value: string): boolean => {
  if (!value) return false;
  return !isNaN(Number(value));
};

/**
 * Validates whether the given string is a valid email address.
 *
 * @param email - The email address to validate.
 * @returns `true` if the email address is valid, otherwise `false`.
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
