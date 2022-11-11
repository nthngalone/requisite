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

export function compare(str1: string, str2: string) {
    if (str1 < str2) {
        return -1;
    }
    if (str1 > str2) {
        return 1;
    }
    return 0;
}
