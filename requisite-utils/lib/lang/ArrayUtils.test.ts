import { asyncForEachParallel, asyncForEachSerial } from './ArrayUtils';

describe('lang/ArrayUtils:asyncForEachParallel', () => {

    it('resolves an array of all resolved callback responses', async () => {
        const results = await asyncForEachParallel(
            [1, 2, 3],
            (item: unknown): Promise<unknown> => {
                return new Promise<unknown>((resolve) => {
                    resolve(`result: ${item}`);
                });
            }
        );
        expect(results).toStrictEqual([
            'result: 1',
            'result: 2',
            'result: 3'
        ]);
    });

    it('executes the callbacks in parallel but preserves order', async () => {
        const resolveOrder: unknown[] = [];
        const results = await asyncForEachParallel(
            [200, 500, 100],
            (item: unknown): Promise<unknown> => {
                return new Promise<unknown>((resolve) => {
                    setTimeout(() => {
                        const response = `result: ${item}`;
                        resolveOrder.push(response);
                        resolve(response);
                    }, item as number);
                });
            }
        );
        expect(results).toStrictEqual([
            'result: 200',
            'result: 500',
            'result: 100'
        ]);
        expect(resolveOrder).toStrictEqual([
            'result: 100',
            'result: 200',
            'result: 500'
        ]);
    });

    it('rejects with error from first rejected callback', async () => {
        await expect(async () => {
            await asyncForEachParallel(
                [1, 2, 3],
                (item: unknown): Promise<unknown> => {
                    return Promise.reject(`error: ${item}`);
                }
            );
        }).rejects.toBe('error: 1');
    });

});

describe('lang/ArrayUtils:asyncForEachSerial', () => {

    it('resolves an array of all resolved callback responses', async () => {
        const results = await asyncForEachSerial(
            [1, 2, 3],
            (item: unknown): Promise<unknown> => {
                return new Promise<unknown>((resolve) => {
                    resolve(`result: ${item}`);
                });
            }
        );
        expect(results).toStrictEqual([
            'result: 1',
            'result: 2',
            'result: 3'
        ]);
    });

    it('executes the callbacks in serial, regardless of how long each takes', async () => {
        const resolveOrder: unknown[] = [];
        const results = await asyncForEachSerial(
            [200, 500, 100],
            (item: unknown): Promise<unknown> => {
                return new Promise<unknown>((resolve) => {
                    setTimeout(() => {
                        const response = `result: ${item}`;
                        resolveOrder.push(response);
                        resolve(response);
                    }, item as number);
                });
            }
        );
        expect(results).toStrictEqual([
            'result: 200',
            'result: 500',
            'result: 100'
        ]);
        expect(resolveOrder).toStrictEqual([
            'result: 200',
            'result: 500',
            'result: 100'
        ]);
    });

    it('rejects with error from first rejected callback', async () => {
        await expect(async () => {
            await asyncForEachSerial(
                [1, 2, 3],
                (item: unknown): Promise<unknown> => {
                    return Promise.reject(`error: ${item}`);
                }
            );
        }).rejects.toBe('error: 1');
    });

});
