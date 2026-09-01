export interface DeviceInfo {
    name: string;
    type: 'ios' | 'android';
    model: string;
    brand: string;
    systemVersion: string;
    appVersion: string;
}

export interface DeviceSession {
    id: string;
    deviceToken: string;
    deviceInfo: DeviceInfo;
    lastActiveAt: string;
    isCurrentDevice: boolean;
    platform: string;
}

export interface DeviceLoginResponse {
    user: {
        id: string;
        email?: string;
        firstName: string;
        lastName: string;
    };
    token: string;
    sessionId: string;
    subscription?: {
        plan: {
            maxDevices: number;
        };
    };
    maxDevices: number;
}

export interface ActiveDevicesResponse {
    devices: DeviceSession[];
    total: number;
    maxDevices: number;
}

export interface DeviceLoginRequest {
    firebaseUid: string;
    deviceToken: string;
    deviceInfo: DeviceInfo;
}

export interface AuthTokens {
    idToken: string;
    deviceToken: string;
    refreshToken?: string;
}

export interface SessionData {
    userId: string;
    sessionId: string;
    maxDevices: number;
    planType: 'basic' | 'family' | 'trial';
}

export type DeviceLimitType = 'basic' | 'family';

export const DEVICE_LIMITS: Record<DeviceLimitType, number> = {
    basic: 1,
    family: 3,
};

export enum AuthErrorCodes {
    DEVICE_LIMIT_EXCEEDED = 'DEVICE_LIMIT_EXCEEDED',
    SESSION_INVALIDATED = 'SESSION_INVALIDATED',
    TOKEN_EXPIRED = 'TOKEN_EXPIRED',
    TOKEN_INVALID = 'TOKEN_INVALID',
    TOKEN_MISSING = 'TOKEN_MISSING',
    NETWORK_ERROR = 'NETWORK_ERROR',
}

export interface AuthError {
    code: AuthErrorCodes;
    message: string;
    maxDevices?: number;
    currentDevices?: number;
}
