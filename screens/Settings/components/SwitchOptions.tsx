import { CustomSwitch } from '@/components/CustomSwitch';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { styles } from '@/styles/screens/Settings/components/SwitchOptions.style';
import React from 'react';
import { Text, View } from 'react-native';
import { SvgProps } from 'react-native-svg';

interface SwitchOptionsProps {
    text: string;
    icon: React.FC<SvgProps>;
    value: boolean;
    onValueChange: (value: boolean) => void;
}

export default function SwitchOptions({
    text,
    icon: Icon,
    value,
    onValueChange
}: SwitchOptionsProps) {

    const theme = useTheme();
    const { isRTL } = useTranslation()
    const themedStyles = styles(theme, isRTL);

    return (
        <View style={themedStyles.container}>
            <View style={themedStyles.leftSection}>
                <Icon width={21} height={24} />
                <Text style={themedStyles.text}>{text}</Text>
            </View>
            <CustomSwitch
                value={value}
                onValueChange={onValueChange}
            />
        </View>
    );
}
