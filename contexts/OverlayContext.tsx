import { ToastType } from "@/types/toastType";
import { createContext, ReactNode, useContext, useState } from "react";

interface OverlayState {
    loaderVisible: boolean;
    toastVisible: boolean;
    toastType: ToastType;
    toastOnHide?: () => void;
}

interface OverlayContextType {
    overlayState: OverlayState;
    showLoader: () => void;
    hideLoader: () => void;
    showToast: (type?: ToastType, onHide?: () => void) => void;
    hideToast: () => void;
}

const OverlayContext = createContext<OverlayContextType | undefined>(undefined);

export function OverlayProvider({ children }: { children: ReactNode }) {
    const [overlayState, setOverlayState] = useState<OverlayState>({
        loaderVisible: false,
        toastVisible: false,
        toastType: "retry",
    });

    const showLoader = () => {
        setOverlayState((prev) => ({ ...prev, loaderVisible: true }));
    };

    const hideLoader = () => {
        setOverlayState((prev) => ({ ...prev, loaderVisible: false }));
    };

    const showToast = (type: ToastType = "retry", onHide?: () => void) => {
        setOverlayState((prev) => ({
            ...prev,
            toastVisible: true,
            toastType: type,
            toastOnHide: onHide,
        }));
    };

    const hideToast = () => {
        setOverlayState((prev) => ({
            ...prev,
            toastVisible: false,
            toastOnHide: undefined,
        }));
    };

    return (
        <OverlayContext.Provider
            value={{
                overlayState,
                showLoader,
                hideLoader,
                showToast,
                hideToast,
            }}
        >
            {children}
        </OverlayContext.Provider>
    );
}

export function useOverlay() {
    const context = useContext(OverlayContext);
    if (context === undefined) {
        throw new Error("useOverlay must be used within an OverlayProvider");
    }
    return context;
}

