import { useOverlay } from "@/hooks/use-overlay";
import { useEffect, useRef } from "react";

export default function ConnectivityToast() {
    const { showToast, hideToast } = useOverlay();
    const wasOffline = useRef(false);

    useEffect(() => {
        const netInfo = require("@react-native-community/netinfo").default;
        const unsubscribe = netInfo.addEventListener((state: any) => {
            const isOffline = !state.isConnected || !state.isInternetReachable;

            if (isOffline && !wasOffline.current) {
                showToast("network");
                wasOffline.current = true;
            } else if (!isOffline) {
                wasOffline.current = false;
                hideToast();
            }
        });

        return () => unsubscribe();
    }, [showToast, hideToast]);

    return null;
}
