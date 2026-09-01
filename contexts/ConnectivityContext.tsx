import NetInfo from "@react-native-community/netinfo";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface ConnectivityState {
    isConnected: boolean;
}

interface ConnectivityContextType {
    connectivity: ConnectivityState;
}

const ConnectivityContext = createContext<ConnectivityContextType | undefined>(undefined);

export function ConnectivityProvider({ children }: { children: ReactNode }) {
    const [isConnected, setIsConnected] = useState(true);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
            const connected = !!(state.isConnected && state.isInternetReachable);
            setIsConnected(connected);
        });

        return () => unsubscribe();
    }, []);

    return (
        <ConnectivityContext.Provider
            value={{
                connectivity: { isConnected },
            }}
        >
            {children}
        </ConnectivityContext.Provider>
    );
}

export function useConnectivity() {
    const context = useContext(ConnectivityContext);
    if (context === undefined) {
        throw new Error("useConnectivity must be used within a ConnectivityProvider");
    }
    return context;
}
