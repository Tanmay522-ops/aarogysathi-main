// types/index.ts

export interface CustomJwtSessionClaims {
    metadata?: {
        role?: string;
        onboardingComplete?: boolean;
        [key: string]: any;
    };
    sub?: string;
    email?: string;
    [key: string]: any;
}