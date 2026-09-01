import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { styles } from '@/styles/screens/Settings/components/SwitchOptions.style';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { SvgProps } from 'react-native-svg';

interface SwitchOptionsProps {
    text: string;
    icon: React.FC<SvgProps>;
    onPress: () => void
}

export default function TextOptions({
    text,
    icon: Icon,
    onPress
}: SwitchOptionsProps) {

    const theme = useTheme();
    const { isRTL } = useTranslation()
    const themedStyles = styles(theme, isRTL);

    return (
        <Pressable style={themedStyles.container} onPress={onPress}>
            <View style={themedStyles.leftSection}>
                <Icon width={21} height={24} />
                <Text style={themedStyles.text}>{text}</Text>
            </View>
        </Pressable>
    );
}
