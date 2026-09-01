import { LockIcon } from "@/assets/images";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";

const DifficultyProgressTabs = ({
    progress,
    currentDifficulty,
    onPress,
    locks,
}: {
    progress: number;
    currentDifficulty: "easy" | "medium" | "hard";
    onPress: (d: "easy" | "medium" | "hard") => void;
    locks: Record<"easy" | "medium" | "hard", boolean>;
}) => {
    return (
        <View style={styles.container}>
            {(["easy", "medium", "hard"] as const).map((level, index, arr) => {
                const isActive = currentDifficulty === level;
                const isLocked = locks[level];

                return (
                    <View key={level} style={{ flex: 1, flexDirection: "row" }}>
                        <Pressable
                            disabled={isLocked}
                            onPress={() => onPress(level)}
                            style={styles.tab}
                            android_ripple={{ color: 'rgba(255,255,255,0.3)' }}
                        >
                            {isActive && (
                                <LinearGradient
                                    colors={["#D87AFF", "#F7C0E9"]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={[
                                        styles.progressFill,
                                        { width: `${progress}%` },
                                    ]}
                                />
                            )}

                            <View style={styles.content}>
                                {isLocked && <LockIcon width={10} height={12} />}
                                <Text
                                    style={[
                                        styles.tabText,
                                        isActive && styles.activeText,
                                    ]}
                                >
                                    {level.charAt(0).toUpperCase() + level.slice(1)}
                                </Text>
                            </View>
                        </Pressable>

                        {/* Divider (not after last tab) */}
                        {index < arr.length - 1 && <View style={styles.divider} />}
                    </View>
                );
            })}

        </View>
    );
};

export default DifficultyProgressTabs;


const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        height: 36,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: "#FFD203",
        overflow: "hidden",
        padding: 3,
        position: "relative",
        zIndex: 100,
    },
    divider: {
        width: 1,
        height: "100%",
        backgroundColor: "#FFFFFF",
        opacity: 0.6,
        marginHorizontal:4,
        zIndex: 101,
    },
    tab: {
        flex: 1,
        position: "relative",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        zIndex: 100,
    },

    progressFill: {
        position: "absolute",
        borderRadius: 20,
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 99,
    },

    content: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        zIndex: 102,
    },

    tabText: {
        color: "#FFFFFF",
        fontWeight: "600",
        fontSize: 12,
    },

    activeText: {
        color: "#ffff",
        fontWeight: "700",
    },
});
