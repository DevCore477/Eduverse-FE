import { useTheme } from "@/hooks/use-theme";
import { styles } from "@/styles/screens/PupilListing/components/pupilBox.style";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, Text } from "react-native";
import { SvgProps } from "react-native-svg";

interface PupilBoxProps {
    data: {
        icon: React.FC<SvgProps>;
        name: string;
        colorOne: string;
        colorTwo: string;
        borderColor: string;
    }
    onClickPupilBox: () => void
}

export default function PupilBox({ data, onClickPupilBox }: PupilBoxProps) {
    const theme = useTheme();
    const themedStyles = styles(theme);

    return (
        <Pressable
            style={[themedStyles.container, { borderColor: data?.borderColor }]}
            onPress={onClickPupilBox}
        >
            <LinearGradient
                colors={[data.colorOne, data.colorTwo]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                    width: "100%",
                    height: "100%", paddingTop: 10, paddingBottom: 10, borderRadius: 20, justifyContent: 'center', alignItems: 'center'
                }}
            >
                {data.icon && <data.icon width={142} height={142} />}
                <Text style={themedStyles.text}>
                    {data.name.length > 12 ? `${data.name.slice(0, 12)}...` : data.name}
                </Text>

            </LinearGradient>
        </Pressable >
    )
}
