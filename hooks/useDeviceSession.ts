import { useState, useEffect, useCallback } from 'react';
import { DeviceSession, ActiveDevicesResponse } from '@/types/device';
import AuthService from '@/services/auth/deviceAuthService';

interface UseDeviceSessionReturn {
    devices: DeviceSession[];
    maxDevices: number;
    currentDevices: number;
    loading: boolean;
    error: string | null;
    logoutDevice: (deviceToken: string) => Promise<void>;
    logoutOthers: () => Promise<void>;
    refresh: () => Promise<void>;
}

export const useDeviceSession = (): UseDeviceSessionReturn => {
    const [devices, setDevices] = useState<DeviceSession[]>([]);
    const [maxDevices, setMaxDevices] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDevices = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response: ActiveDevicesResponse = await AuthService.getActiveDevices();
            
            setDevices(response.devices || []);
            setMaxDevices(response.maxDevices || 1);
        } catch (err: any) {
            console.error('Error fetching devices:', err);
            setError(err.message || 'Failed to fetch devices');
        } finally {
            setLoading(false);
        }
    }, []);

    const logoutDevice = useCallback(async (deviceToken: string) => {
        try {
            setLoading(true);
            await AuthService.logoutDevice(deviceToken);
            await fetchDevices();
        } catch (err: any) {
            console.error('Error logging out device:', err);
            setError(err.message || 'Failed to logout device');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchDevices]);

    const logoutOthers = useCallback(async () => {
        try {
            setLoading(true);
            await AuthService.logoutOtherDevices();
            await fetchDevices();
        } catch (err: any) {
            console.error('Error logging out other devices:', err);
            setError(err.message || 'Failed to logout other devices');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchDevices]);

    const refresh = useCallback(async () => {
        await fetchDevices();
    }, [fetchDevices]);

    useEffect(() => {
        fetchDevices();
    }, [fetchDevices]);

    useEffect(() => {
        const removeListener = AuthService.addForceLogoutListener(
            (event) => {
                console.log('Force logout event received:', event);
                setDevices([]);
                setMaxDevices(1);
            }
        );

        return () => {
            removeListener();
        };
    }, []);

    const currentDevices = devices.length;

    return {
        devices,
        maxDevices,
        currentDevices,
        loading,
        error,
        logoutDevice,
        logoutOthers,
        refresh,
    };
};

export default useDeviceSession;
