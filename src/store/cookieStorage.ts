import { setCookie, getCookie, deleteCookie } from 'cookies-next';

export const cookieStorage = {
    getItem: (name: string) => {
        const value = getCookie(name);
        return value ? JSON.parse(value as string) : null;
    },
    setItem: (name: string, value: any) => {
        const expires = new Date();
        expires.setDate(expires.getDate() + 3);
        setCookie(name, JSON.stringify(value), { expires });
    },
    removeItem: (name: string) => {
        deleteCookie(name);
    },
};
