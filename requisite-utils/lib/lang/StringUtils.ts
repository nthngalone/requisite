export function isEmpty(str: string): boolean {
    return !str || str.length === 0;
}

export function isNotEmpty(str: string): boolean {
    return !isEmpty(str);
}

export function isBlank(str: string): boolean {
    return !str || isEmpty(str.trim());
}

export function isNotBlank(str: string): boolean {
    return !isBlank(str);
}
