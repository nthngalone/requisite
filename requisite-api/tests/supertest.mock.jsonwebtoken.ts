jest.mock('jsonwebtoken', () => {
    return {
        sign: jest.fn(({ user }): string => {
            const { domain, userName } = user;
            return `im-a-signed-token-for-${domain}-${userName}`;
        }),
        verify: jest.fn((token: string) => {
            const [qualifier, domain, userName] = token.split('|');
            if (qualifier === 'valid') {
                return { user: { domain, userName } };
            } else {
                throw new Error(`[${token}] is invalid`);
            }
        })
    };
});
