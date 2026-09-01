import { TSubjectKey } from "@/types/subjects";
import { View } from "react-native";
import { Circle, Path, Svg } from "react-native-svg";

export default function CompletedLevelStar({
  size,
  subjectKey,
}: {
  size: number;
  subjectKey: TSubjectKey;
}) {
  const starSize = size * 0.7;
  return (
    <View style={{ position: "relative" }}>
      <Svg width={starSize} height={starSize} viewBox="0 0 80 80">
        <Path
          d="M40 4L49.44 30.56L76 30.56L54.48 48.88L63.92 75.44L40 57.12L16.08 75.44L25.52 48.88L4 30.56L30.56 30.56L40 4Z"
          fill="#FFD203"
        />
        {/* Green cape for Math */}
        {subjectKey === "math" && (
          <Path d="M40 48L24 72L56 72Z" fill="#00AC56" opacity="0.8" />
        )}
      </Svg>
      {/* Gold medals around completed levels (Math) - using simple circles for now */}
      {subjectKey === "math" && (
        <>
          <Svg
            width={20}
            height={20}
            style={{ position: "absolute", top: -5, right: -5 }}
            viewBox="0 0 20 20"
          >
            <Circle cx="10" cy="10" r="9" fill="#FFD700" />
          </Svg>
          <Svg
            width={20}
            height={20}
            style={{ position: "absolute", top: -5, left: -5 }}
            viewBox="0 0 20 20"
          >
            <Circle cx="10" cy="10" r="9" fill="#FFD700" />
          </Svg>
        </>
      )}
    </View>
  );
};
