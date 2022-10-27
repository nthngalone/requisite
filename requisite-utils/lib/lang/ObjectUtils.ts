import { isNotBlank } from './StringUtils';

export function clone<T>(obj: T): T {
    return (obj !== null && obj !== undefined) ? JSON.parse(JSON.stringify(obj)) : obj;
}

export function get(obj: unknown, property: string): unknown {
    let val = obj;
    if (obj !== null && obj !== undefined && isNotBlank(property)) {
        const props = property.split('.');
        props.every((prop) => {
            val = (val as { [key:string]: unknown })[prop];
            return val;
        });
    }
    return val;
}

export function before(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    obj: Record<string, (...params: any) => unknown>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    method: string, advice: (...params: any) => any[] | void
): void {
    const origMethod = obj[method];
    obj[method] = (...args: unknown[]) => {
        const newArgs = advice.apply(obj, args);
        args = newArgs ? newArgs : args;
        return origMethod.apply(obj, args);
    };
}
