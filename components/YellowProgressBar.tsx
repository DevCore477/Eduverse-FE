import { StyleSheet, View } from "react-native";

interface YellowProgressBarProps {
    percentageNumber: number
}
export default function YellowProgressBar({ percentageNumber }: YellowProgressBarProps) {
    return (
        <View style={styles.track}>
            <View
                style={[
                    styles.progress,
                    {
                        width: `${percentageNumber}%`
                    }
                ]}
            />
        </View>
    )
}

const styles = StyleSheet.create({

    track: {
        width:"95%",
        height: 12,
        backgroundColor: "#009349",
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: "#FFDE3C",
        overflow: "hidden"
    },
    progress: {
        height: "95%",
        borderRadius: 8,
        backgroundColor: "#FFDE3C"
    }
})
