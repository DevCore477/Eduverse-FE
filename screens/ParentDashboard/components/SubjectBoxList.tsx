import PupilSubjectBox, { ShowDesc } from "@/components/PupilSubjectBox";
import { ImageSource } from "expo-image";
import { ScrollView, Text, TextStyle, View, ViewStyle } from "react-native";

interface SubjectBoxListProps {
  recentActivitiesContainerStyle: ViewStyle;
  textStyle: TextStyle;
  pupilSubjects: {
    levelOrderIndex: number;
    firstName: string;
    subjectName: string;
    icon: ImageSource;
    colorOne: string;
    colorTwo: string;
  }[];
  subjectText: string;
}

export default function SubjectBoxList({
  subjectText,
  pupilSubjects,
  recentActivitiesContainerStyle,
  textStyle,
}: SubjectBoxListProps) {
  return (
    <View style={recentActivitiesContainerStyle}>
      <Text style={textStyle}>{subjectText}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {pupilSubjects.length > 0 &&
          pupilSubjects.map((subject, index) => (
            <PupilSubjectBox
              key={index}
              data={subject}
              showDesc={ShowDesc.NAME}
            />
          ))}
      </ScrollView>
    </View>
  );
}
