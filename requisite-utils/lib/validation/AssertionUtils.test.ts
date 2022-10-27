import { assertExists, assertIsNotBlank, AssertionError, assertTrue, assertFalse, assertIsNotEmptyList } from './AssertionUtils';

describe('validation/AssertionUtils:assertExists', () => {

    it('throws an AssertionError for an undefined value', () => {
        expect(() => { assertExists(undefined, 'undefined'); }).toThrow(AssertionError);
    });

    it('throws an AssertionError for a null value', () => {
        expect(() => { assertExists(null, 'null'); }).toThrow(AssertionError);
    });

    it('does not throw an Error for an object', () => {
        expect(() => { assertExists({}, 'obj'); }).not.toThrow();
    });

    it('does not throw an Error for an empty string', () => {
        expect(() => { assertExists('', '""'); }).not.toThrow();
    });

    it('does not throw an Error for a populated string', () => {
        expect(() => { assertExists('123', '"123"'); }).not.toThrow();
    });

    it('does not throw an Error for a number', () => {
        expect(() => { assertExists(1, '1'); }).not.toThrow();
    });

    it('does not throw an Error for a boolean', () => {
        expect(() => { assertExists(true, 'boolean'); }).not.toThrow();
        expect(() => { assertExists(false, 'boolean'); }).not.toThrow();
    });

});

describe('validation/AssertionUtils:assertIsNotEmptyList', () => {

    it('throws an AssertionError for an undefined value', () => {
        expect(() => { assertIsNotEmptyList(undefined, 'undefined'); }).toThrow(AssertionError);
    });

    it('throws an AssertionError for a null value', () => {
        expect(() => { assertIsNotEmptyList(null, 'null'); }).toThrow(AssertionError);
    });

    it('throws an AssertionError for an empty list', () => {
        expect(() => { assertIsNotEmptyList([], '[]'); }).toThrow(AssertionError);
    });

    it('does not throw an Error for a populated string', () => {
        expect(() => { assertIsNotEmptyList(['123'], '["123"]'); }).not.toThrow();
    });

});

describe('validation/AssertionUtils:assertIsNotBlank', () => {

    it('throws an AssertionError for an undefined value', () => {
        expect(() => { assertIsNotBlank(undefined, 'undefined'); }).toThrow(AssertionError);
    });

    it('throws an AssertionError for a null value', () => {
        expect(() => { assertIsNotBlank(null, 'null'); }).toThrow(AssertionError);
    });

    it('throws an AssertionError for an empty string', () => {
        expect(() => { assertIsNotBlank('', '""'); }).toThrow(AssertionError);
    });

    it('throws an AssertionError for a blank string', () => {
        expect(() => { assertIsNotBlank('   ', '"   "'); }).toThrow(AssertionError);
    });

    it('does not throw an Error for a populated string', () => {
        expect(() => { assertIsNotBlank('123', '"123"'); }).not.toThrow();
    });

});

describe('validation/AssertionUtils:assertTrue', () => {

    it('throws an AssertionError for an undefined value', () => {
        expect(() => { assertTrue(undefined, 'undefined'); }).toThrow(AssertionError);
    });

    it('throws an AssertionError for a null value', () => {
        expect(() => { assertTrue(null, 'null'); }).toThrow(AssertionError);
    });

    it('throws an AssertionError for false', () => {
        expect(() => { assertTrue(false, 'false'); }).toThrow(AssertionError);
    });

    it('does not throw an Error for true', () => {
        expect(() => { assertTrue(true, 'true'); }).not.toThrow();
    });

});

describe('validation/AssertionUtils:assertFalse', () => {

    it('throws an AssertionError for an undefined value', () => {
        expect(() => { assertFalse(undefined, 'undefined'); }).toThrow(AssertionError);
    });

    it('throws an AssertionError for a null value', () => {
        expect(() => { assertFalse(null, 'null'); }).toThrow(AssertionError);
    });

    it('throws an AssertionError for true', () => {
        expect(() => { assertFalse(true, 'true'); }).toThrow(AssertionError);
    });

    it('does not throw an Error for false', () => {
        expect(() => { assertFalse(false, 'false'); }).not.toThrow();
    });

});
