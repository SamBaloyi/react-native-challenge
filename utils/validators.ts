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

/**
 * Validates a form's values against a set of validation rules.
 *
 * @template T - A generic type representing the shape of the form values.
 * @param values - An object containing the form's values, where each key corresponds to a field name.
 * @param rules - An object containing validation functions for each field. Each function takes the field's value as input
 *                and returns a string describing the validation error, or `null` if the value is valid.
 * @returns An object containing validation errors for each field. If a field is valid, its value will be `null`.
 *
 * @example
 * const values = { username: "JohnDoe", age: 25 };
 * const rules = {
 *   username: (value) => value.length < 3 ? "Username must be at least 3 characters long" : null,
 *   age: (value) => value < 18 ? "Age must be at least 18" : null,
 * };
 *
 * const errors = validateForm(values, rules);
 * // errors: { username: null, age: null }
 */
export const validateForm = <T extends Record<string, any>>(
  values: T,
  rules: Record<keyof T, (value: any) => string | null>
): Record<keyof T, string | null> => {
  const errors: Partial<Record<keyof T, string | null>> = {};

  for (const key in rules) {
    if (Object.prototype.hasOwnProperty.call(rules, key)) {
      const error = rules[key](values[key]);
      if (error) {
        errors[key] = error;
      }
    }
  }

  return errors as Record<keyof T, string | null>;
};
