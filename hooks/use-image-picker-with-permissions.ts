import { useState } from "react";
import { Alert, Linking, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";

export type ImageSource = "camera" | "gallery";

type UseImagePickerOptions = {
  showToast: (type: string) => void;
  cameraDeniedMessage: string;
  galleryDeniedMessage: string;
  chooserTitle?: string;
  chooserMessage?: string;
  onImageSelected?: (uri: string, base64: string | null) => void;
};

export function useImagePickerWithPermissions({
  showToast,
  cameraDeniedMessage,
  galleryDeniedMessage,
  chooserTitle = "Choose Image Source",
  chooserMessage = "Select camera or gallery",
  onImageSelected,
}: UseImagePickerOptions) {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  const showOpenSettingsAlert = (message: string) => {
    Alert.alert("Permission needed", message, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Open Settings",
        onPress: () => {
          void Linking.openSettings();
        },
      },
    ]);
  };

  const requestPickerPermission = async (source: ImageSource) => {
    // Android 13+ system photo picker: user grants access per file via the picker UI;
    // broad READ_MEDIA_* is not required and triggers Google Play policy issues.
    if (source === "gallery" && Platform.OS === "android") {
      return true;
    }

    const currentPermission =
      source === "camera"
        ? await ImagePicker.getCameraPermissionsAsync()
        : await ImagePicker.getMediaLibraryPermissionsAsync();

    if (currentPermission.granted) {
      return true;
    }

    const requestedPermission =
      source === "camera"
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (requestedPermission.granted) {
      return true;
    }

    if (requestedPermission.canAskAgain) {
      showToast("retry");
    } else {
      showOpenSettingsAlert(
        source === "camera" ? cameraDeniedMessage : galleryDeniedMessage
      );
    }

    return false;
  };

  const pickImage = async (source: ImageSource) => {
    const hasPermission = await requestPickerPermission(source);
    if (!hasPermission) return;

    try {
      const result =
        source === "camera"
          ? await ImagePicker.launchCameraAsync({
              mediaTypes: ["images"],
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.7,
              base64: true,
            })
          : await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ["images"],
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.7,
              base64: true,
            });

      if (!result.canceled) {
        const asset = result.assets[0];
        const nextUri = asset.uri;
        const nextBase64 = asset.base64 ?? null;

        setImageUri(nextUri);
        setImageBase64(nextBase64);
        onImageSelected?.(nextUri, nextBase64);
      }
    } catch {
      showToast("retry");
    }
  };

  const openImageSourcePicker = () => {
    Alert.alert(chooserTitle, chooserMessage, [
      {
        text: "Camera",
        onPress: () => {
          void pickImage("camera");
        },
      },
      {
        text: "Gallery",
        onPress: () => {
          void pickImage("gallery");
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  return {
    imageUri,
    imageBase64,
    setImageUri,
    setImageBase64,
    pickImage,
    openImageSourcePicker,
  };
}
