const warn = console.warn;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
console.warn = jest.fn((message?: any, ...optionalParams: any[]) => {
    const ignoreMessages = [
        'There is already an app instance mounted on the host container.'
    ];
    if(!ignoreMessages.some(m => message.includes(m))) {
        warn(message, ...optionalParams);
    }
});
