import { LessonCompleteIcon } from "@/assets/images";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ListItemData {
  id: string;
  title: string;
  description?: string;
  gradientColors: [string, string];
  isCompleted: boolean
  iconName?: keyof typeof Ionicons.glyphMap;
}

interface SubjectHierarchy2Props {
  items?: ListItemData[];
  onItemPress?: (itemId: string,index:number) => void;
}

// const defaultItems: ListItemData[] = [
//     {
//         id: "1",
//         title: "Item 1",
//         description: "Description 1",
//         gradientColors: ["#A991D2", "#F7C0E9"],
//         iconName: "play",
//     },
//     {
//         id: "2",
//         title: "Item 2",
//         description: "Description 2",
//         gradientColors: ["#EC6F9E", "#EC8B6A"],
//         iconName: "play",
//     },
//     {
//         id: "3",
//         title: "Item 3",
//         description: "Description 3",
//         gradientColors: ["#5670EC", "#07BAFE"],
//         iconName: "play",
//     },
//     {
//         id: "4",
//         title: "Item 4",
//         description: "Description 4",
//         gradientColors: ["#00AC56", "#00743A"],
//         iconName: "play",
//     },
//     {
//         id: "5",
//         title: "Item 5",
//         description: "Description 5",
//         gradientColors: ["#F7C0E9", "#A991D2"],
//         iconName: "play",
//     },
//     {
//         id: "6",
//         title: "Item 6",
//         description: "Description 6",
//         gradientColors: ["#EC8B6A", "#EC6F9E"],
//         iconName: "play",
//     },
// ]

const SubjectHierarchy2: React.FC<SubjectHierarchy2Props> = ({
  items,
  onItemPress,
}) => {
  const handleItemPress = (itemId: string,index:number) => {
    if (onItemPress) {
      onItemPress(itemId,index);
    }
  };

  return (
    <View style={styles.container}>
      {items &&
        items.length > 0 &&
        items.map((item,index) => (
          <TouchableOpacity
            key={index}
            style={styles.itemWrapper}
            onPress={() => handleItemPress(item.id,index+1)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={item.gradientColors}
              style={styles.item}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {/* Icon container with border */}
              {item.isCompleted &&
                <LessonCompleteIcon width={24} height={24} />
              }
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 20,
    alignItems: "center",
    paddingBottom: 32
  },
  itemWrapper: {
    transform: [{ rotate: "0deg" }],
    opacity: 1,
  },
  item: {
    width: "100%",
    height: 80,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.6)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    minWidth: 0,
    alignItems: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    color: "#FFF",
    maxWidth: 300,
    width: "100%",
    minWidth: 0,
  },
  description: {
    fontSize: 12,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.8)",
  },
});

export default SubjectHierarchy2;
