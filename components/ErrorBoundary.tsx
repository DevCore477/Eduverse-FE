import { useTheme } from "@/hooks/use-theme";
import { router } from "expo-router";
import { clearAuthToken, clearDeviceToken, clearSessionStart, stopTokenRefreshCycle } from "@/config/api-config";
import { ReactNode, Component, ErrorInfo } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { logError } from "@/utils/firebase-analytics";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: string | null;
    retryCount: number;
}

const MAX_AUTO_RETRIES = 3;

export default class ErrorBoundary extends Component<Props, State> {
    private retryTimer: ReturnType<typeof setTimeout> | null = null;

    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null, retryCount: 0 };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null, retryCount: 0 };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
        
        const componentStack = errorInfo.componentStack || "";
        logError(error, `ErrorBoundary: ${error.message}\n${componentStack}`);
        
        this.setState({ errorInfo: componentStack });

        if (this.state.retryCount < MAX_AUTO_RETRIES) {
            console.log(`🔄 Auto-retry attempt ${this.state.retryCount + 1}/${MAX_AUTO_RETRIES}`);
            this.retryTimer = setTimeout(() => {
                this.setState((prev) => ({
                    hasError: false,
                    error: null,
                    errorInfo: null,
                    retryCount: prev.retryCount + 1,
                }));
            }, 500);
        }
    }

    componentWillUnmount() {
        if (this.retryTimer) {
            clearTimeout(this.retryTimer);
        }
    }

    private handleReload = async () => {
        try {
            stopTokenRefreshCycle();
            await clearAuthToken();
            await clearDeviceToken();
            await clearSessionStart();
            const { firebaseLogout } = await import("@/services/firebase/auth");
            await firebaseLogout();
        } catch (e) {
            console.log("Logout error:", e);
        }

        router.replace("/(default-bg)");
    };

    private handleRetry = () => {
        this.setState({ hasError: false, error: null, errorInfo: null, retryCount: 0 });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <ErrorFallbackUI
                    onReload={this.handleReload}
                    onRetry={this.handleRetry}
                />
            );
        }

        return this.props.children;
    }
}

function ErrorFallbackUI({ onReload, onRetry }: { onReload: () => void; onRetry: () => void }) {
    const theme = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.content}>
                <View style={[styles.iconContainer, { borderColor: "#F59E0B" }]}>
                    <Text style={[styles.icon, { color: "#F59E0B" }]}>!</Text>
                </View>
                <Text style={[styles.title, { color: theme.text }]}>
                    Something went wrong
                </Text>
                <Text style={[styles.message, { color: theme.textSecondary }]}>
                    The app encountered an unexpected error. Please try again.
                </Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, styles.retryButton, { backgroundColor: theme.green }]}
                        onPress={onRetry}
                    >
                        <Text style={[styles.buttonText, { color: theme.white }]}>
                            Try Again
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, styles.reloadButton, { borderColor: theme.textSecondary }]}
                        onPress={onReload}
                    >
                        <Text style={[styles.buttonText, { color: theme.textSecondary }]}>
                            Reload App
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    content: {
        alignItems: "center",
        maxWidth: 300,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    icon: {
        fontSize: 40,
        fontWeight: "bold",
    },
    title: {
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 8,
        textAlign: "center",
    },
    message: {
        fontSize: 14,
        textAlign: "center",
        marginBottom: 24,
        lineHeight: 20,
    },
    buttonContainer: {
        flexDirection: "row",
        gap: 12,
    },
    button: {
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 25,
        minWidth: 120,
        alignItems: "center",
    },
    retryButton: {
        borderWidth: 0,
    },
    reloadButton: {
        borderWidth: 1,
    },
    buttonText: {
        fontSize: 14,
        fontWeight: "600",
    },
});
