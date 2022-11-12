import { isEmpty, isNotEmpty, isBlank, isNotBlank, compare } from './StringUtils';

describe('lang/StringUtils:isEmpty', () => {

    it('returns true for null', () => {
        expect(isEmpty(null)).toBeTruthy();
    });

    it('returns true for empty', () => {
        expect(isEmpty('')).toBeTruthy();
    });

    it('returns false for blank', () => {
        expect(isEmpty(' ')).toBeFalsy();
    });

    it('returns false for non-whitespace', () => {
        expect(isEmpty('abc')).toBeFalsy();
    });

});

describe('lang/StringUtils:isNotEmpty', () => {

    it('returns false for null', () => {
        expect(isNotEmpty(null)).toBeFalsy();
    });

    it('returns false for empty', () => {
        expect(isNotEmpty('')).toBeFalsy();
    });

    it('returns true for blank', () => {
        expect(isNotEmpty(' ')).toBeTruthy();
    });

    it('returns true for non-whitespace', () => {
        expect(isNotEmpty('abc')).toBeTruthy();
    });

});

describe('lang/StringUtils:isBlank', () => {

    it('returns true for null', () => {
        expect(isBlank(null)).toBeTruthy();
    });

    it('returns true for empty', () => {
        expect(isBlank('')).toBeTruthy();
    });

    it('returns true for blank', () => {
        expect(isBlank(' ')).toBeTruthy();
    });

    it('returns false for non-whitespace', () => {
        expect(isBlank('abc')).toBeFalsy();
    });

});

describe('lang/StringUtils:isNotBlank', () => {

    it('returns false for null', () => {
        expect(isNotBlank(null)).toBeFalsy();
    });

    it('returns false for empty', () => {
        expect(isNotBlank('')).toBeFalsy();
    });

    it('returns false for blank', () => {
        expect(isNotBlank(' ')).toBeFalsy();
    });

    it('returns true for non-whitespace', () => {
        expect(isNotBlank('abc')).toBeTruthy();
    });

});

describe('lang/StringUtils:compare', () => {

    it('returns -1 if param1 < param2', () => {
        expect(compare('a', 'b')).toBe(-1);
    });

    it('returns 1 if param1 > param2', () => {
        expect(compare('b', 'a')).toBe(1);
    });

    it('returns 0 if param1 === param2', () => {
        expect(compare('a', 'a')).toBe(0);
    });
});
