import { useState, useCallback, useEffect, useRef } from 'react';
import { usePathname } from 'expo-router';

export function useNavigationLoading() {
    const [isNavigating, setIsNavigating] = useState(false);
    const [destination, setDestination] = useState<string | null>(null);
    const navigationStartTime = useRef<number | null>(null);
    const pathname = usePathname();

    // Auto-clear navigation state when route actually changes
    useEffect(() => {
        if (isNavigating && destination) {
            // Check if we've arrived at destination
            if (pathname.includes(destination)) {
                const minLoadTime = 500; // Minimum loader display time
                const elapsed = navigationStartTime.current 
                    ? Date.now() - navigationStartTime.current 
                    : 0;
                
                const remainingTime = Math.max(0, minLoadTime - elapsed);
                
                setTimeout(() => {
                    setIsNavigating(false);
                    setDestination(null);
                    navigationStartTime.current = null;
                }, remainingTime);
            }
        }
    }, [pathname, isNavigating, destination]);

    const startNavigation = useCallback((screenKey: string) => {
        setIsNavigating(true);
        setDestination(screenKey);
        navigationStartTime.current = Date.now();
    }, []);

    const stopNavigation = useCallback(() => {
        setIsNavigating(false);
        setDestination(null);
        navigationStartTime.current = null;
    }, []);

    return {
        isNavigating,
        destination,
        startNavigation,
        stopNavigation,
    };
}