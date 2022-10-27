export async function asyncForEachParallel(
    array: unknown[],
    callback: (item: unknown, index?: number, arrRef?: unknown[]) => Promise<unknown>
): Promise<unknown[]> {
    return Promise.all(array.map((item: unknown, index: number) => {
        return new Promise((resolve, reject) => {
            callback(item, index, array).then(resolve).catch(reject);
        });
    }));
}

export async function asyncForEachSerial(
    array: unknown[],
    callback: (item: unknown, index?: number, arrRef?: unknown[]) => Promise<unknown>
): Promise<unknown[]> {
    return new Promise<unknown[]>((resolve, reject) => {
        const results: unknown[] = [];
        (array.reduce((
            promise: Promise<unknown>,
            item: unknown,
            index: number
        ): Promise<unknown> => {
            return promise.then(() => {
                return new Promise((resolveInner, rejectInner) => {
                    callback(item, index, array).then((result) => {
                        results.push(result);
                        resolveInner(result);
                    }).catch(rejectInner);
                });
            });
        }, Promise.resolve()) as Promise<unknown>).then(() => {
            resolve(results);
        }).catch(reject);
    });
}
