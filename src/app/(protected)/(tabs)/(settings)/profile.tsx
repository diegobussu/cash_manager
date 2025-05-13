import { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { User } from "@/models/User";
import { AppText } from "@/components/AppText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import UserService from "@/services/userService";
import * as ImagePicker from "expo-image-picker";
import base64 from "base64-js";
import Constants from "@/utils/Constants";
import Utils from "@/utils/Utils";

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = await UserService.getUserIdFromToken();
        const userData = await UserService.getUserByID(userId);

        if (userData.image) {
          const base64String = base64.fromByteArray(
            new Uint8Array((userData.image as any).data),
          );
          userData.image = `data:image/png;base64,${base64String}`;
        }

        setUser(userData);
      } catch (err: any) {
        setError(err.message || "Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleImagePick = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Denied",
        "You need to allow access to your photos to update your profile picture.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      const newImage = result.assets[0].base64;

      if (!newImage) {
        Alert.alert("Error", "Failed to process the selected image.");
        return;
      }

      const imgSize = Utils.getImageSize(newImage);
      if (imgSize > Constants.MAX_IMAGE_SIZE) {
        Alert.alert(
          "Image Too Large",
          `The selected image exceeds the ${Constants.MAX_IMAGE_SIZE} KB size limit. Please choose a smaller image.`,
        );
        return;
      }

      Alert.alert(
        "Confirm Update",
        "Do you want to update your profile picture?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: async () => {
              try {
                if (user) {
                  await UserService.updateUser({ image: newImage || "" });
                  const userId = await UserService.getUserIdFromToken();
                  const updatedUser = await UserService.getUserByID(userId);

                  if (updatedUser.image) {
                    const base64String = base64.fromByteArray(
                      new Uint8Array((updatedUser.image as any).data),
                    );
                    updatedUser.image = `data:image/png;base64,${base64String}`;
                  }

                  setUser(updatedUser);
                  Alert.alert(
                    "Success",
                    "Profile picture updated successfully!",
                  );
                }
              } catch (error: any) {
                Alert.alert(
                  "Error",
                  error.message || "Failed to update profile picture.",
                );
              }
            },
          },
        ],
      );
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <AppText size="medium" color="secondary" center>
          {error}
        </AppText>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ padding: 16, backgroundColor: "#f9f9f9" }}
    >
      <View className="items-center mb-6 relative">
        <TouchableOpacity
          onPress={handleImagePick}
          style={{ position: "relative" }}
        >
          {user?.image ? (
            <Image
              source={{ uri: `data:image/png;base64,${user.image}` }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                borderWidth: 2,
                borderColor: "#007AFF",
              }}
            />
          ) : (
            <MaterialCommunityIcons
              name="account-circle"
              size={120}
              color="#ccc"
            />
          )}
          <View
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              backgroundColor: "#007AFF",
              borderRadius: 20,
              padding: 6,
            }}
          >
            <MaterialCommunityIcons name="pencil" size={20} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>

      <View className="bg-white rounded-lg shadow-md p-4 mb-4">
        <AppText size="large" bold className="text-gray-700">
          Name:
        </AppText>
        <AppText size="medium" className="text-gray-500">
          {`${user?.first_name} ${user?.last_name}`}
        </AppText>
      </View>

      <View className="bg-white rounded-lg shadow-md p-4 mb-4">
        <AppText size="large" bold className="text-gray-700">
          Email:
        </AppText>
        <AppText size="medium" className="text-gray-500">
          {user?.email}
        </AppText>
      </View>

      {user?.phone_number && (
        <View className="bg-white rounded-lg shadow-md p-4 mb-4">
          <AppText size="large" bold className="text-gray-700">
            Phone Number:
          </AppText>
          <AppText size="medium" className="text-gray-500">
            {user.phone_number}
          </AppText>
        </View>
      )}

      {user?.address && (
        <View className="bg-white rounded-lg shadow-md p-4 mb-4">
          <AppText size="large" bold className="text-gray-700">
            Address:
          </AppText>
          <AppText size="medium" className="text-gray-500">
            {user.address}
          </AppText>
        </View>
      )}

      {user?.zip_code && (
        <View className="bg-white rounded-lg shadow-md p-4 mb-4">
          <AppText size="large" bold className="text-gray-700">
            Zip Code:
          </AppText>
          <AppText size="medium" className="text-gray-500">
            {user.zip_code}
          </AppText>
        </View>
      )}

      {user?.country && (
        <View className="bg-white rounded-lg shadow-md p-4 mb-4">
          <AppText size="large" bold className="text-gray-700">
            Country:
          </AppText>
          <AppText size="medium" className="text-gray-500">
            {user.country}
          </AppText>
        </View>
      )}
    </ScrollView>
  );
}
