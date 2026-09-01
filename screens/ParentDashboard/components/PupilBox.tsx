import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { styles } from "@/styles/screens/ParentDashboard/components/pupilBox.style";
import { LinearGradient } from "expo-linear-gradient";
import { Plus } from "lucide-react-native";
import { Pressable, Text } from "react-native";
import { SvgProps } from "react-native-svg";

interface PupilBoxProps {
    data: {
        icon: React.FC<SvgProps>;
        name: string;
        id: string
        colorOne: string;
        colorTwo: string;
        borderColor: string;
    } | undefined
    screenwidth:number
    noOfInOne:number
    gap:number
    onAddPress?: () => void
    onClickPupilBox: () => void
}
export default function PupilBox({ data,screenwidth, onAddPress, onClickPupilBox,noOfInOne,gap }: PupilBoxProps) {
    const theme = useTheme();
    const { t } = useTranslation()
    const width=screenwidth/noOfInOne-(gap*(noOfInOne-1))+4
    const themedStyles = styles(theme,width);

    return (
        <>
            {!data ?
                <Pressable style={themedStyles.container} onPress={onAddPress}>
                    <Plus color={"#E0DFF1"} size={32} />
                    <Text style={themedStyles.addText}>{t("parentHome.addPupil")}</Text>
                </Pressable>

                :
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
                        {data.icon && <data.icon width={90} height={90} />}
                        <Text style={themedStyles.text}>
                            {data.name.length > 10 ? `${data.name.slice(0, 10)}...` : data.name}
                        </Text>

                    </LinearGradient>
                </Pressable >
            }
        </>

    )
}