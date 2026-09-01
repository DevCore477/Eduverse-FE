import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { styles } from "@/styles/components/toast.style";
import { ToastConfig, ToastType } from "@/types/toastType";
import React, { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";

interface ToastProps {
    type: ToastType;
    visible: boolean;
    onHide: () => void;
}

export default function Toast({ type, visible, onHide }: ToastProps) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const toast = ToastConfig[type];
    const theme = useTheme();
    const { t } = useTranslation();
    const themedStyles = styles(theme);

    const Icon = toast.icon;
    const message = t(`toast.${type}`);


    useEffect(() => {
        if (visible) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();

            setTimeout(() => {
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }).start(onHide);
            }, 2000);
        }
    }, [visible]);

    return (
        <Animated.View style={[themedStyles.container, { opacity: fadeAnim }]}>
            <View style={themedStyles.iconContainer}>
                <Icon width={24} height={24} />
            </View>

            <Text style={themedStyles.text}>{message}</Text>
        </Animated.View>
    );
}

