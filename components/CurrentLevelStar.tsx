import { TSubjectKey } from "@/types/subjects";
import { Path, Svg } from "react-native-svg";

export default function CurrentLevelStar({
  size,
  subjectKey,
}: {
  size: number;
  subjectKey: TSubjectKey;
}) {
  const baseSize = size;
  return (
    <Svg width={baseSize} height={baseSize} viewBox="0 0 100 100">
      {/* Outer glowing star */}
      <Path
        d="M50 5L61.8 38.2L95 38.2L68.1 58.6L79.9 91.8L50 71.4L20.1 91.8L31.9 58.6L5 38.2L38.2 38.2L50 5Z"
        fill="#FFD203"
        opacity="0.9"
      />
      {/* Inner star (for English) */}
      {subjectKey === "english" && (
        <Path
          d="M50 20L57.5 42.5L80 42.5L62.5 57.5L70 80L50 67.5L30 80L37.5 57.5L20 42.5L42.5 42.5L50 20Z"
          fill="#FF0000"
        />
      )}
      {/* Green cape effect (for Math) */}
      {subjectKey === "math" && (
        <Path d="M50 60L30 90L70 90Z" fill="#00AC56" opacity="0.8" />
      )}
    </Svg>
  );
};
