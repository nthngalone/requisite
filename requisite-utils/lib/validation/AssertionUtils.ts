/**
 * Assertion utilities based on the fail-fast design pattern
 * https://martinfowler.com/ieeeSoftware/failFast.pdf
 */

import { isBlank } from '../lang/StringUtils';

export class AssertionError extends Error {
    constructor(message: string) {
        super(`AssertionError: ${message}`);
    }
}

export function assertExists(obj: unknown, name: string): void {
    if ((obj === undefined) || (obj === null)) {
        throw new AssertionError(`${name} does not exist`);
    }
}

export function assertIsNotEmptyList(list: unknown[], name: string): void {
    assertExists(list, name);
    if (!list.length || list.length === 0) {
        throw new AssertionError(`${name} is an empty list`);
    }
}

export function assertIsNotBlank(val: string, name: string): void {
    if (isBlank(val)) {
        throw new AssertionError(`${name} is blank`);
    }
}

export function assertTrue(val: boolean, name: string): void {
    if (val !== true) {
        throw new AssertionError(`${name} is NOT true`);
    }
}

export function assertFalse(val: boolean, name: string): void {
    if (val !== false) {
        throw new AssertionError(`${name} is NOT false`);
    }
}
