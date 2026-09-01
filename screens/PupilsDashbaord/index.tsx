import NedjmatiStar from "@/assets/images/NedjmatiStar.svg";
import Arabic from "@/assets/images/subjects/Arabic.svg";
import English from "@/assets/images/subjects/English.svg";
import Math from "@/assets/images/subjects/Mathematics.svg";
import Header from "@/components/Header";
import useBackButtonHandler from "@/hooks/use-back-button-press";
import { useOverlay } from "@/hooks/use-overlay";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";
import { useGetSubjects } from "@/services/subjects/subjectMutation";
import { RootState } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getSpecificSubject, setPupilSubjects } from "@/store/subjectSlice";
import { styles } from "@/styles/screens/SubjectsDashboard/index.style";
import { TBackendErrorResponse } from "@/types/global";
import { TRSubject } from "@/types/subjects";
import { capitalizeFirstLetter } from "@/utils/caseConversions";
import { safeNavigate } from "@/utils/safeNavigator";
import { Ionicons } from "@expo/vector-icons";
import { AxiosError } from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { usePathname, useRouter } from "expo-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Animated,
  Easing,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Subject extends TRSubject {
  icon: "play" | "lock";
  bgColors: string[];
  isLocked: boolean;
}

// Map subject codes/names to SVG images
const getSubjectSVG = (subjectName: string, subjectCode: string) => {
  const lowerName = subjectName.toLowerCase();
  const lowerCode = subjectCode.toLowerCase();

  if (lowerName.includes("arabic") || lowerCode.includes("ar")) {
    return Arabic;
  }
  if (lowerName.includes("math") || lowerCode.includes("math")) {
    return Math;
  }
  if (lowerName.includes("english") || lowerCode.includes("en")) {
    return English;
  }

  return Arabic; // fallback if no match
};

// Map subject names/codes to gradient colors
const getSubjectGradient = (
  subjectName: string,
  subjectCode: string,
): string[] => {
  const lowerName = subjectName.toLowerCase();
  const lowerCode = subjectCode.toLowerCase();

  if (lowerName.includes("arabic") || lowerCode.includes("ar")) {
    return ["#EC6F9E", "#EC8B6A"]; // Pink gradient
  }
  if (lowerName.includes("math") || lowerCode.includes("math")) {
    return ["#A991D2", "#F7C0E9"]; // Purple gradient
  }
  if (lowerName.includes("english") || lowerCode.includes("en")) {
    return ["#5670EC", "#07BAFE"]; // Blue gradient
  }

  return ["#6366F1", "#4F46E5"]; // Default indigo gradient
};

const AnimatedSubjectIcon = ({ children }: { children: ReactNode }) => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.2,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [scale]);

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        transform: [{ scale }],
        shadowColor: "#FFD54F",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 12,
        elevation: 10,
      }}
    >
      {children}
    </Animated.View>
  );
};

const AnimatedStar = () => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.12,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => {
      animation.stop();
    };
  }, [scale]);

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        transform: [{ scale }],
        // subtle glow / shadow
        shadowColor: "#FFD54F",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 12,
        elevation: 6,
      }}
    >
      <NedjmatiStar width={140} height={140} style={{ marginRight: 0 }} />
    </Animated.View>
  );
};

export default function PupilsDashboardScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const themedStyles = styles(theme);
  const router = useRouter();
  const pathname = usePathname();
  const { showLoader, hideLoader } = useOverlay();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [pupilId, setPupilId] = useState<string>("");
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.parent.parent); // Assuming user is stored in 'user' slice
  const storedSubjects = useAppSelector(
    (state: RootState) => state.subject.subjects,
  );
  const activePupil = useAppSelector((state) => state.activePupil.pupil);
  const activePupilId = activePupil?.id || "";
  console.log("activePupilId", activePupilId);
  useBackButtonHandler({ exitAppScreen: true });

  // Get dynamic pupil_id from storage or route params
  useEffect(() => {
    const getPupilId = async () => {
      try {
        // First check if we have the active pupil ID from the Redux store
        if (activePupilId) {
          console.log("Using active pupil ID from Redux store:", activePupilId);
          setPupilId(activePupilId);
        }
      } catch (error) {
        console.log("Error getting pupil_id:", error);
      }
    };
    getPupilId();
  }, [activePupilId, user]); // Ensure effect runs when `activePupilId` or `user` changes

  const { mutate: getSubjects, isPending: isSubjectsLoading } =
    useGetSubjects(pupilId);

  useEffect(() => {
    if (isSubjectsLoading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [isSubjectsLoading, showLoader, hideLoader]);

  useEffect(() => {
    if (!pupilId) return;

    if (storedSubjects.length > 0) {
      setSubjects(storedSubjects as Subject[]);
      return;
    }
    getSubjects(undefined, {
      onSuccess: (data: TRSubject[]) => {
        const transformedSubjects = data.map((subject: TRSubject) => ({
          ...subject,
          icon: "play" as const,
          bgColors: getSubjectGradient(subject.name, subject.code),
          isLocked: false,
        }));
        dispatch(setPupilSubjects(transformedSubjects));
        setSubjects(transformedSubjects);
      },
      onError: (error) => {
        // console.log("Error fetching subjects:", error);
        const axiosErr = error as AxiosError<TBackendErrorResponse>;
        console.log("error in submitting : ", axiosErr.response?.data.error);
      },
    });
  }, [pupilId, getSubjects]);

  const extractLevelFromDescription = (description: string) => {
    const regex = /Grade[_\s]?(\d{1,2})/i;
    const match = description.match(regex);
    if (match && match[1]) {
      return `Grade ${match[1]}`;
    }
    return description;
  };

  const handleSubjectClick = (subject: Subject) => {
    if (!subject.isLocked) {
      console.log(
        "Navigating to Subject Journey for:",
        subject.name,
        "with ID:",
        subject.id,
      );
      dispatch(getSpecificSubject(subject.id));
      safeNavigate(router, pathname, {
        pathname: `/(journey-map)/subject-journey`,
        params: {
          subjectName: subject.name,
          subjectId: subject.id,
          userId: pupilId,
        },
      });
    }
  };

  const renderSubjectCard = ({ item }: { item: Subject }) => {
    const subjectSVG = getSubjectSVG(item.name, item.code);
    const SVGComponent = subjectSVG as any;
    return (
      <LinearGradient
        colors={item.bgColors as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={themedStyles.card}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          onPress={() => handleSubjectClick(item)}
          disabled={item.isLocked}
          activeOpacity={item.isLocked ? 1 : 0.7}
        >
          {/* Left Section - Icon and Level */}
          <View
            style={{
              flex: 1,
              minWidth: 0,
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <View style={themedStyles.iconContainer}>
              <Ionicons
                name={item.icon === "play" ? "play" : "lock-closed"}
                size={24}
                color="#FFFFFF"
              />
            </View>
            <View>
              <Text style={themedStyles.levelText}>
                {extractLevelFromDescription(item.description) || "Level"}
              </Text>
              <Text style={themedStyles.titleText}>{item.name}</Text>
            </View>
          </View>

          {/* Right Section - SVG Overlay and Star */}
          <View style={themedStyles.cardRight}>
            {SVGComponent && (
              <>
                <View style={themedStyles.iconOverlay}>
                  <AnimatedSubjectIcon>
                    <SVGComponent width={180} height={180} />
                  </AnimatedSubjectIcon>
                </View>
                <View style={themedStyles.iconStarOverlay}>
                  <AnimatedStar />
                </View>
              </>
            )}
          </View>
        </TouchableOpacity>
      </LinearGradient>
    );
  };

  return (
    <View style={themedStyles.container}>
      <Header
        isAllowedBack={false}
        showProgessBar={false}
        stepBarSide={2}
        isDefaultBG={true}
        isSettings={true}
        view={
          <View>
            <Text style={themedStyles.courseText}>{t("courses")}</Text>
          </View>
        }
      />

      <View style={{ gap: 4, marginBottom: 7 }}>
        <Text style={themedStyles.greeting}>
          {t("pupilDashboard.hello")}{" "}
          {capitalizeFirstLetter(activePupil?.firstName ?? "")}!
        </Text>
        <Text style={themedStyles.subtitle}>
          {t("pupilDashboard.subtitle")}
        </Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 23, paddingBottom: 20 }}
      >
        {subjects &&
          subjects.length > 0 &&
          subjects.map((subject, index) => (
            <View key={index}>{renderSubjectCard({ item: subject })}</View>
          ))}
      </ScrollView>
    </View>
  );
}
