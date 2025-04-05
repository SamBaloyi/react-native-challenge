import { isEmpty, isNumber, isValidEmail } from '../validators';

describe('validators', () => {
    describe('isEmpty', () => {
        it('should return true for an empty string', () => {
            expect(isEmpty('')).toBe(true);
        });

        it('should return true for a string with only whitespace', () => {
            expect(isEmpty('   ')).toBe(true);
        });

        it('should return false for a non-empty string', () => {
            expect(isEmpty('hello')).toBe(false);
        });
    });

    describe('isNumber', () => {
        it('should return true for a valid number string', () => {
            expect(isNumber('123')).toBe(true);
        });

        it('should return false for a string with non-numeric characters', () => {
            expect(isNumber('123abc')).toBe(false);
        });

        it('should return false for an empty string', () => {
            expect(isNumber('')).toBe(false);
        });
    });

    describe('isValidEmail', () => {
        it('should return true for a valid email address', () => {
            expect(isValidEmail('test@example.com')).toBe(true);
        });

        it('should return false for an invalid email address', () => {
            expect(isValidEmail('invalid-email')).toBe(false);
        });

        it('should return false for an empty string', () => {
            expect(isValidEmail('')).toBe(false);
        });
    });
});