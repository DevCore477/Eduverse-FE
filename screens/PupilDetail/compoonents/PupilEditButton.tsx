import { EditPupilIcon } from "@/assets/images"
import { Pressable, StyleSheet } from "react-native"

interface EditProfileButtonProps {
    onPress: () => void
}

export default function EditProfileButton({ onPress }: EditProfileButtonProps) {
    return (
        <Pressable
            onPress={onPress}
            hitSlop={8}
            style={({ pressed }) => [
                styles.container,
                pressed && styles.pressed
            ]}
        >
            <EditPupilIcon width={28} height={28}/>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop:10,
        justifyContent: "center",
        alignItems: "center",
        padding: 12,
        borderRadius: 16,
        backgroundColor: "#00AC56",
        alignSelf: "flex-start", 
    },
    pressed: {
        opacity: 0.7, 
    }
})
