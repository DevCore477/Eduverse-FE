"use client";
import NedjmatiStar from "@/assets/images/NedjmatiStar.svg";
import Arabic from "@/assets/images/subjects/Arabic.svg";
import English from "@/assets/images/subjects/English.svg";
import Math from "@/assets/images/subjects/Mathematics.svg";
import Header from "@/components/Header";
import OverlayUI from "@/components/OverlayUI";
import useBackButtonHandler from "@/hooks/use-back-button-press";
import { useTranslation } from "@/hooks/use-translation";
import { useTheme } from "@/hooks/use-theme";
import {
  useGetJourneyMapOld,
  useGetSubjects,
} from "@/services/subjects/subjectMutation";
import type { RootState } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getSpecificSubject, setPupilSubjects } from "@/store/subjectSlice";
import { styles } from "@/styles/screens/SubjectsDashboard/index.style";
import { TRSubject } from "@/types/subjects";
import { capitalizeFirstLetter } from "@/utils/caseConversions";
import { safeNavigate } from "@/utils/safeNavigator";
import { usePathname, useRouter } from "expo-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Animated,
  Easing,
  FlatList,
  ScrollView,
  Text,
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

  return null; // fallback if no match
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

export default function SubjectsDashboard() {
  const theme = useTheme();
  const themedStyles = styles(theme);
  const router = useRouter();
  const pathname = usePathname();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const { t, isRTL } = useTranslation();
  // const [pupilId, setPupilId] = useState<string>()
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.activePupil.pupil); // Assuming user is stored in 'user' slice
  useBackButtonHandler();

  // console.log("moiz", user)
  // console.log(storedSubjects)
  const userId = user?.id ?? "";
  const { mutate: getSubjects, isPending: isSubjectsLoading } =
    useGetSubjects(userId);
  const { mutate: getJourneyMap, isPending: isJourneyMapLoading } =
    useGetJourneyMapOld(userId);

  useEffect(() => {
    if (!userId) return;

    // if (storedSubjects.length > 0) {
    //     console.log('storedddd')
    //     setSubjects(storedSubjects as Subject[]);
    //     return;
    // }
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
        console.log("Error fetching subjects:", error);
      },
    });
  }, [userId, getSubjects]);

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
    
      dispatch(getSpecificSubject(subject.id));
      safeNavigate(router, pathname, {
        pathname: `/(journey-map)/subject-journey`,
        params: {
          subjectName: subject.name,
          subjectId: subject.id,
          userId: userId,
        },
      });
    }
  };

  const renderSubjectCard = ({ item }: { item: Subject }) => { };

  return (
    <View style={themedStyles.container}>
      <View>
        <Header
          isAllowedBack={false}
          showProgessBar={true}
          stepBarSide={1}
          isDefaultBG={true}
        />

        {/* Hero Section */}
        <View>
          <Text style={themedStyles.greeting}>Hello {capitalizeFirstLetter(user?.firstName ?? "")}!</Text>
          <Text style={themedStyles.subtitle}>
            {t("subjectDashboard.subtitle")}
          </Text>
        </View>
      </View>
      <OverlayUI
        visible={isSubjectsLoading || isJourneyMapLoading}
        mode="loader"
      />

      {/* Subjects List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <FlatList
          data={subjects}
          renderItem={renderSubjectCard}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={themedStyles.listContainer}
        />
      </ScrollView>
    </View>
  );
}
