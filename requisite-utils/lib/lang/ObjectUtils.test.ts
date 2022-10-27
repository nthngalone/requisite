import { clone, get, before } from './ObjectUtils';

describe('lang/ObjectUtils:clone', () => {

    it('returns null for null', () => {
        expect(clone(null)).toBeNull();
    });

    it('returns undefined for undefined', () => {
        expect(clone(undefined)).toBeUndefined();
    });

    it('returns an empty string for empty string', () => {
        expect(clone('')).toBe('');
    });

    it('returns a cloned object', () => {
        const obj = { obj: { field: 1 } };
        const cloned = clone(obj);
        expect(cloned === obj).toBeFalsy();
        expect(cloned).toEqual(obj);
    });

    it('returns a cloned array', () => {
        const arr = [ 1, 2, 3 ];
        const cloned = clone(arr);
        expect(cloned === arr).toBeFalsy();
        expect(cloned).toEqual(arr);
    });

});

describe('lang/ObjectUtils:get', () => {

    it('returns null for null', () => {
        expect(get(null, 'a')).toBeNull();
    });

    it('returns undefined for undefined', () => {
        expect(get(undefined, 'a')).toBeUndefined();
    });

    it('returns undefined for an unknown property', () => {
        expect(get({}, 'a')).toBeUndefined();
    });

    it('returns the value for a known property', () => {
        expect(get({ a: 1 }, 'a')).toBe(1);
    });

    it('returns the value for a known chained property', () => {
        expect(get({ a: { b: 1 } }, 'a.b')).toBe(1);
    });

    it('returns undefined for an unknown intermediate chained property', () => {
        expect(get({ a: 1 }, 'a.b.c')).toBeUndefined();
    });

    it('returns original object for blank property', () => {
        expect(get(1, '')).toBe(1);
    });

});

describe('lang/ObjectUtils:before', () => {

    it('executes advice before the original method', () => {
        const order: string[] = [];
        const method = jest.fn(() => { order.push('original'); });
        const advice = jest.fn(() => { order.push('advice'); });
        const obj = { method };
        before(obj, 'method', advice);
        obj.method();
        expect(advice).toHaveBeenCalled();
        expect(method).toHaveBeenCalled();
        expect(order.length).toBe(2);
        expect(order[0]).toBe('advice');
        expect(order[1]).toBe('original');
    });

    it('sends response from advice as params to the original method', () => {
        const method = jest.fn();
        const advice = jest.fn(() => { return [1, 2, 3]; });
        const obj = { method };
        before(obj, 'method', advice);
        obj.method();
        expect(advice).toHaveBeenCalled();
        expect(method).toHaveBeenCalledWith(1, 2, 3);
    });

    it('sends original params to original method if advice does not return params', () => {
        const method = jest.fn();
        const advice = jest.fn();
        const obj = { method };
        before(obj, 'method', advice);
        obj.method(1, 2, 3);
        expect(advice).toHaveBeenCalled();
        expect(method).toHaveBeenCalledWith(1, 2, 3);
    });

    it('returns response from the original method', () => {
        const method = (name: string) => { return `hello-${name}`; };
        const advice = jest.fn(() => { return ['requisite']; });
        const obj = { method };
        before(obj, 'method', advice);
        const message = obj.method('world');
        expect(message).toBe('hello-requisite');
    });
});
