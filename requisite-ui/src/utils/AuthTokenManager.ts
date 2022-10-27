const LOCAL_STORAGE_KEY_ACCESS_TOKEN = 'REQUISITE_AUTH_TOKEN';

export function getAuthToken(): string {
    return localStorage.getItem(LOCAL_STORAGE_KEY_ACCESS_TOKEN) as string;
}

export function setAuthToken(authToken: string): void {
    localStorage.setItem(LOCAL_STORAGE_KEY_ACCESS_TOKEN, authToken);
}

export function removeAuthToken(): void {
    localStorage.removeItem(LOCAL_STORAGE_KEY_ACCESS_TOKEN);
}
