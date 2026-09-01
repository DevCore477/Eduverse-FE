import { PlayIcon } from "@/assets/images";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { styles } from "@/styles/screens/PupilDetail/components/pupilSubjectBox.style";
import { capitalizeFirstLetter } from "@/utils/caseConversions";
import { Image, ImageSource } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, Text, View } from "react-native";

export const ShowDesc = {
  NAME: "NAME",
  VIDEO_ICON: "VIDEO_ICON",
  NONE: "NONE",
} as const;

export type ShowDescType = (typeof ShowDesc)[keyof typeof ShowDesc];

interface PupilSubjectBoxProps {
  data: {
    levelOrderIndex: number;
    firstName?: string;
    subjectName: string;
    icon: ImageSource;
    colorOne: string;
    colorTwo: string;
  };
  isModule?: boolean;
  showDesc: ShowDescType;
  onAddPress?: () => void;
}

export default function PupilSubjectBox({
  data,
  isModule = false,
  showDesc,
  onAddPress,
}: PupilSubjectBoxProps) {
  const theme = useTheme();
  const themedStyles = styles(theme);
  const { t } = useTranslation();
  return (
    <Pressable style={themedStyles.container} onPress={onAddPress}>
      <LinearGradient
        colors={[data.colorOne, data.colorTwo]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 20,
          justifyContent: "space-between",
        }}
      >
        {data.icon && <Image source={data.icon} style={themedStyles.image} />}
        <View style={themedStyles.textContainer}>
          <Text style={themedStyles.levelText}>
            {isModule
              ? "Module"
              : data.levelOrderIndex
                ? `${t("pupilModule.level")} ${data.levelOrderIndex ?? 0}`
                : t("pupilInsight.nextSubject")}{" "}
          </Text>
          <Text style={themedStyles.nameText}>
            {data.subjectName.length > 12
              ? `${data.subjectName.slice(0, 12)}...`
              : data.subjectName}
          </Text>
        </View>

        {showDesc !== ShowDesc.NONE && (
          <View
            style={{
              paddingLeft: 12,
              paddingBottom: showDesc === ShowDesc.NAME ? 8 : 16,
            }}
          >
            {showDesc === ShowDesc.NAME && (
              <Text style={{ fontSize: 18, fontWeight: "600", color: "#FFFF" }}>
                {capitalizeFirstLetter(data.firstName ?? "")}
              </Text>
            )}

            {showDesc === ShowDesc.VIDEO_ICON && (
              <PlayIcon width={32} height={32} />
            )}
          </View>
        )}
      </LinearGradient>
    </Pressable>
  );
}
