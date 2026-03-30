import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { View, Text, Button, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

export default function HomeScreen() {
  // ✅ FIXED TYPES
  const [image, setImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);

  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission required for camera");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setResultImage(null);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setResultImage(null);
    }
  };

  const uploadImage = async () => {
    if (!image) {
      Alert.alert("Please select an image first");
      return;
    }

    const formData = new FormData();

    // ✅ FIXED TYPESCRIPT ERROR
    formData.append(
      "image",
      {
        uri: image,
        type: "image/jpeg",
        name: "photo.jpg",
      } as any
    );

    try {
      const res = await fetch(
        "http://192.168.1.3:5000/generate", // ⚠️ change if IP changes
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.success) {
        setResultImage(data.result[0]);
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error sending image");
    }
  };

  // ✅ FIXED: downloadImage INSIDE component
  const downloadImage = async () => {
    if (!resultImage) return;

    const fileUri = FileSystem.documentDirectory + "image.jpg";

    const { uri } = await FileSystem.downloadAsync(resultImage, fileUri);

    await Sharing.shareAsync(uri);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>
        AI Clipart Generator
      </Text>

      <View style={{ gap: 10 }}>
        <Button title="Camera" onPress={openCamera} />
        <Button title="Gallery" onPress={pickImage} />
      </View>

      {image && (
        <>
          <View
            style={{
              width: "90%",
              height: 300,
              marginTop: 20,
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#f5f5f5",
            }}
          >
            <Image
              source={{ uri: image }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="contain"
            />
          </View>

          <View style={{ marginTop: 15 }}>
            <Button title="Generate AI Image" onPress={uploadImage} />
          </View>
        </>
      )}

      {resultImage && (
        <View style={{ marginTop: 20 }}>
          <Text>Generated Output:</Text>

          <Image
            source={{ uri: resultImage }}
            style={{ width: 200, height: 200 }}
          />

          <View style={{ marginTop: 10 }}>
            <Button title="Download / Share" onPress={downloadImage} />
          </View>
        </View>
      )}
    </View>
  );
}