import Header from "@/components/Header";
import { useTheme } from "@/hooks/use-theme";
import { styles } from "@/styles/screens/CardDeatils/index.style";
import { View } from "react-native";

export default function CardDetailsScreen() {
    const theme = useTheme();
    const themedStyles = styles(theme);

    return (
        <View style={themedStyles.container}>
            <Header isAllowedBack={false} showProgessBar={false} isDefaultBG={true} />
        </View>
    );
}
