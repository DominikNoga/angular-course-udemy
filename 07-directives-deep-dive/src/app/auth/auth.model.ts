export const PERMISSIONS = {
    ADMIN: 'admin',
    USER: 'user',
    GUEST: 'guest'
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

// How this works:
/* 
    - typof PERMISSIONS: returns this object:
        {
            ADMIN: 'admin',
            USER: 'user',
            GUEST: 'guest'
        }
    - keyof typeof PERMISSIONS: returns this string union type: "ADMIN" | "USER" | "GUEST"

    - combining those two we are getting each value of the PERMISSIONS object as a type

    - Final result: 'admin' | 'user' | 'guest';
*/