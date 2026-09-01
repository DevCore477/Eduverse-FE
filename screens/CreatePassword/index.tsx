import Header from "@/components/Header";
import OverlayUI from "@/components/OverlayUI";
import useBackButtonHandler from "@/hooks/use-back-button-press";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { useChangePassword, useVerifyOtp } from "@/services/auth/authMutation";
import { styles } from "@/styles/screens/CreatePassword/index.style";
import { PartialTUpdatePassword, TUpdatePassword } from "@/types/auth";
import { TBackendErrorResponse } from "@/types/global";
import { ToastType } from "@/types/toastType";
import { hasNetworkConnection } from "@/utils/checkNetworks";
import { mapBackendError } from "@/utils/errorMapping";
import { safeNavigate } from "@/utils/safeNavigator";
import { AxiosError } from "axios";
import * as Linking from "expo-linking";
import { useLocalSearchParams, usePathname, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import CreatePasswordForm from "./components/CreatePasswordForm";

export default function CreatePasswordScreen() {
    const theme = useTheme();
    const router = useRouter();
    const pathname = usePathname();
    const params = useLocalSearchParams();
    const { t, isRTL } = useTranslation();
    const themedStyles = styles(theme, isRTL);
    useBackButtonHandler();

    const { mutate: resetPassword, isPending } = useChangePassword();
    const { mutate: verifyOTP, isPending: isVerifyOtpPending } = useVerifyOtp();

    const [toastType, setToastType] = useState<ToastType>("retry");
    const [toastVisible, setToastVisible] = useState(false);

    // Deep-link data
    const [code, setCode] = useState<string | null>(null);
    const [identifier, setIdentifier] = useState<string | null>(null);

    // Guard to ensure OTP verification runs only once
    const hasVerifiedRef = useRef(false);
    const isProcessingUrl = useRef(false);

    // Parse URL and extract code/identifier - wrapped in useCallback
    const parseUrlAndSetParams = useCallback((url: string | null) => {
        if (!url || isProcessingUrl.current) return;

        isProcessingUrl.current = true;

        try {
            console.log("🔗 Raw deep link:", url);

            let finalUrl = url;
            let codeValue: string | null = null;
            let identifierValue: string | null = null;

            // Handle expo-development-client wrapper
            if (url.includes('expo-development-client')) {
                try {
                    const parsed = new URL(url);
                    const wrappedUrl = parsed.searchParams.get('url');
                    if (wrappedUrl) {
                        finalUrl = decodeURIComponent(wrappedUrl);
                        console.log("📦 Unwrapped from expo-development-client:", finalUrl);
                    }
                } catch (e) {
                    console.log("Failed to unwrap expo-development-client URL");
                }
            }

            // Try multiple parsing strategies
            const parsingStrategies = [
                // Strategy 1: Standard URL searchParams
                () => {
                    try {
                        const urlObj = new URL(finalUrl);
                        return {
                            code: urlObj.searchParams.get('code'),
                            identifier: urlObj.searchParams.get('identifier')
                        };
                    } catch { return null; }
                },
                // Strategy 2: Alternative param names
                () => {
                    try {
                        const urlObj = new URL(finalUrl);
                        return {
                            code: urlObj.searchParams.get('token') ||
                                urlObj.searchParams.get('otp') ||
                                urlObj.searchParams.get('code'),
                            identifier: urlObj.searchParams.get('email') ||
                                urlObj.searchParams.get('user') ||
                                urlObj.searchParams.get('identifier')
                        };
                    } catch { return null; }
                },
                // Strategy 3: Regex extraction (handles malformed URLs)
                () => {
                    const codeMatch = finalUrl.match(/[?&]code=([^&]+)/);
                    const identifierMatch = finalUrl.match(/[?&]identifier=([^&]+)/);
                    return {
                        code: codeMatch ? decodeURIComponent(codeMatch[1]) : null,
                        identifier: identifierMatch ? decodeURIComponent(identifierMatch[1]) : null
                    };
                },
                // Strategy 4: Path-based parsing (e.g., /create-password/code/identifier)
                () => {
                    if (finalUrl.includes('create-password')) {
                        const segments = finalUrl.split('/').filter(Boolean);
                        const cpIndex = segments.indexOf('create-password');
                        if (cpIndex !== -1 && segments.length > cpIndex + 2) {
                            return {
                                code: segments[cpIndex + 1],
                                identifier: decodeURIComponent(segments[cpIndex + 2])
                            };
                        }
                    }
                    return null;
                }
            ];

            // Try each strategy until we get both values
            for (const strategy of parsingStrategies) {
                const result = strategy();
                if (result?.code && result?.identifier) {
                    codeValue = result.code;
                    identifierValue = result.identifier;
                    break;
                }
            }

            console.log("🎯 Extracted:", { code: codeValue, identifier: identifierValue });

            // If dev client stripped the URL (localhost/192.168), fallback to route params immediately
            if ((!codeValue || !identifierValue) &&
                (finalUrl.includes('192.168.') || finalUrl.includes('localhost'))) {
                console.log("⚠️ Dev client detected, using route params fallback");

                if (params?.code && params?.identifier) {
                    codeValue = params.code as string;
                    identifierValue = params.identifier as string;
                    console.log("📦 Fallback to route params:", { code: codeValue, identifier: identifierValue });
                }
            }

            if (codeValue && identifierValue) {
                setCode(codeValue);
                setIdentifier(identifierValue);
                hasVerifiedRef.current = false;
                console.log("✅ Deep link params set successfully");
            } else {
                console.warn("⚠️ Missing code or identifier in deep link");

                // Final fallback: check route params
                if (params?.code && params?.identifier) {
                    console.log("📦 Using route params fallback");
                    setCode(params.code as string);
                    setIdentifier(params.identifier as string);
                    hasVerifiedRef.current = false;
                }
            }
        } catch (e) {
            console.error("💥 Deep link parsing error:", e, "URL was:", url);

            // Emergency fallback
            if (params?.code && params?.identifier) {
                setCode(params.code as string);
                setIdentifier(params.identifier as string);
            }
        } finally {
            // Reset after a short delay to allow future updates
            setTimeout(() => {
                isProcessingUrl.current = false;
            }, 500);
        }
    }, [params]); // Include params as dependency

    // Handle deep links - cold start and background/foreground
    useEffect(() => {
        let isMounted = true;
        let urlListener: { remove: () => void } | null = null;

        const handleDeepLink = async () => {
            if (!isMounted) return;

            // Handle cold start (app was closed)
            try {
                const initialUrl = await Linking.getInitialURL();
                if (initialUrl && isMounted) {
                    console.log("🚀 Cold start URL:", initialUrl);
                    parseUrlAndSetParams(initialUrl);
                } else if (params?.code && params?.identifier && isMounted) {
                    // No initial URL but have params - use them
                    console.log("📦 Using initial route params");
                    setCode(params.code as string);
                    setIdentifier(params.identifier as string);
                    hasVerifiedRef.current = false;
                }
            } catch (e) {
                console.error("Error getting initial URL:", e);
            }

            // Handle warm start (app was in background)
            urlListener = Linking.addEventListener("url", ({ url }) => {
                if (isMounted) {
                    console.log("🔄 Background/Foreground URL:", url);
                    parseUrlAndSetParams(url);
                }
            });
        };

        handleDeepLink();

        return () => {
            isMounted = false;
            if (urlListener) {
                urlListener.remove();
            }
        };
    }, [parseUrlAndSetParams]); // Include parseUrlAndSetParams

    // Verify OTP exactly once when code and identifier are available
    useEffect(() => {
        if (!code || !identifier) {
            console.log("⏳ Waiting for code and identifier...");
            return;
        }

        if (hasVerifiedRef.current) {
            console.log("✋ Already verified, skipping");
            return;
        }

        console.log("🔐 Starting OTP verification for:", identifier);
        hasVerifiedRef.current = true;

        verifyOTP(
            { identifier, otp: code },
            {
                onSuccess: () => {
                    console.log("✅ OTP verified successfully");
                },
                onError: (err: unknown) => {
                    hasVerifiedRef.current = false; // Allow retry
                    const axiosErr = err as AxiosError<TBackendErrorResponse>;
                    const errMsg = axiosErr.response?.data?.error || "Something went wrong";
                    console.log("❌ OTP verification error:", errMsg);
                    mapBackendError(errMsg);
                    setToastVisible(true);
                    setToastType("retry");
                },
            }
        );
    }, [code, identifier, verifyOTP]);

    // Submit new password
    const onFormSubmit = async (resetPasswordData: PartialTUpdatePassword) => {
        const isOnline = await hasNetworkConnection();
        if (!isOnline) {
            setToastType("network");
            setToastVisible(true);
            return;
        }

        if (!code || !identifier) {
            console.log("❌ Cannot submit: missing code or identifier", { code, identifier });
            setToastType("retry");
            setToastVisible(true);
            return;
        }

        const data: TUpdatePassword = {
            identifier,
            password: resetPasswordData.password,
            confirmPassword: resetPasswordData.confirmPassword,
        };

        resetPassword(data, {
            onSuccess: () => {
                setToastType("updatePassSuccess");
                setToastVisible(true);
                setTimeout(() => {
                    safeNavigate(router, pathname, "/(default-bg)/signin", "replace");
                }, 1000);
            },
            onError: (err: unknown) => {
                const axiosErr = err as AxiosError<TBackendErrorResponse>;
                const errMsg = axiosErr.response?.data?.error || "Something went wrong";
                console.log(errMsg, 'error in reset password');
                mapBackendError(errMsg);
                setToastVisible(true);
                setToastType("retry");
            },
        });
    };

    return (
        <View style={themedStyles.container}>
            <View style={themedStyles.headerContainer}>
                <Header isAllowedBack={true} showProgessBar={false} stepBarSide={2} isDefaultBG={true} />
                <Text style={themedStyles.createPassText}>{t("createPassword.text")}</Text>
                <Text style={themedStyles.createPassDescription}>{t("createPassword.desc")}</Text>
            </View>

            <CreatePasswordForm key={code || 'default'} onFormSubmit={onFormSubmit} />

            <TouchableOpacity onPress={() => safeNavigate(router, pathname, "/signin")}>
                <Text style={themedStyles.link}>{t("createPassword.backSignIn")}</Text>
            </TouchableOpacity>

            <OverlayUI visible={isPending || isVerifyOtpPending} mode="loader" />

            <OverlayUI
                visible={toastVisible}
                mode="toast"
                toastType={toastType}
                onToastHide={() => setToastVisible(false)}
            />
        </View>
    );
}