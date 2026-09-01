import { safeNavigate } from "@/utils/safeNavigator";
import { usePathname, useRouter } from "expo-router";
import { View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";
import PupilBox from "./PupilBox";

interface PupilListProps {
    canAddPupil: boolean;
    screenWidth: number
    pupilsData: {
        icon: React.FC<SvgProps>;
        id: string;
        name: string;
        colorOne: string;
        colorTwo: string;
        borderColor: string;
    }[]
    style:ViewStyle
}

export default function PupilList({ style,pupilsData,canAddPupil, screenWidth }: PupilListProps) {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <View style={style}>
            {pupilsData.map((pupil, index) => (
                <PupilBox
                    key={index}
                    data={pupil}
                    noOfInOne={3}
                    gap={14}
                    screenwidth={screenWidth}
                    onAddPress={canAddPupil ? () => { safeNavigate(router, pathname, "/(default-bg)/(parent-bg)/add-pupil") } : undefined}
                    onClickPupilBox={() => { safeNavigate(router, pathname, { pathname: "/(default-bg)/(parent-bg)/pupil-detail", params: { pupilId: pupil.id } }) }}
                />
            ))}

            {canAddPupil && (
                <PupilBox
                    data={undefined}
                    noOfInOne={3}
                    gap={14}
                    screenwidth={screenWidth}
                    onAddPress={() => safeNavigate(router, pathname, "/(default-bg)/(parent-bg)/add-pupil")}
                    onClickPupilBox={() => { }}
                />
            )}
        </View>
    )
}