import { formatDate, truncateText, formatNumber } from '../formatters';

describe('formatDate', () => {
    it('should format a date into a localized string representation', () => {
        const date = new Date('2023-03-15T14:30:00Z');
        const formattedDate = formatDate(date);
        expect(formattedDate).toBe('15 Mar 2023, 16:30');
    });
});

describe('truncateText', () => {
    it('should return the original text if it is shorter than or equal to the max length', () => {
        const text = 'Hello, world!';
        const result = truncateText(text, 20);
        expect(result).toBe(text);
    });

    it('should truncate the text and append ellipsis if it exceeds the max length', () => {
        const text = 'This is a very long text that needs truncation.';
        const result = truncateText(text, 10);
        expect(result).toBe('This is a ...');
    });
});

describe('formatNumber', () => {
    it('should format a number with commas as thousand separators', () => {
        const num = 1234567;
        const formattedNumber = formatNumber(num);
        expect(formattedNumber).toBe('1,234,567');
    });

    it('should handle numbers with no thousand separators', () => {
        const num = 123;
        const formattedNumber = formatNumber(num);
        expect(formattedNumber).toBe('123');
    });
});