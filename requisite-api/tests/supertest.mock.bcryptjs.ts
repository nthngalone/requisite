jest.mock('bcryptjs', () => {
    return {
        hashSync(s: string): string {
            return s;
        },
        compareSync(s1: string, s2: string) {
            return s1 === s2;
        }
    };
});
