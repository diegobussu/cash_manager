import { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { User } from "@/models/User";
import { AppText } from "@/components/AppText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import UserService from "@/services/userService";
import * as ImagePicker from "expo-image-picker";
import Utils from "@/utils/Utils";
import Constants from "@/utils/Constants";

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = await UserService.getUserIdFromToken();
        const userData = await UserService.getUserByID(userId);

        setUser(userData);
        setFormData(userData);
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

  const handleSave = async () => {
    try {
      if (!user) return;

      await UserService.updateUser(formData);
      const userId = await UserService.getUserIdFromToken();
      const updatedUser = await UserService.getUserByID(userId);

      setUser(updatedUser);
      setFormData(updatedUser);
      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update profile.");
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
              source={{ uri: user.image as string }}
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
          {user?.image && (
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  "Confirm Deletion",
                  "Are you sure you want to remove your profile picture ?",
                  [
                    {
                      text: "Cancel",
                      style: "cancel",
                    },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: async () => {
                        try {
                          await UserService.updateUser({ image: null });
                          const userId = await UserService.getUserIdFromToken();
                          const updatedUser =
                            await UserService.getUserByID(userId);
                          setUser(updatedUser);
                          Alert.alert(
                            "Success",
                            "Profile picture removed successfully!",
                          );
                        } catch (error: any) {
                          Alert.alert(
                            "Error",
                            error.message ||
                              "Failed to remove profile picture.",
                          );
                        }
                      },
                    },
                  ],
                );
              }}
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                backgroundColor: "#FF3B30",
                borderRadius: 20,
                padding: 6,
              }}
            >
              <MaterialCommunityIcons name="trash-can" size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </View>

      <View className="bg-white rounded-lg shadow-md p-4 mb-4">
        <AppText size="large" bold className="text-gray-700">
          First Name
        </AppText>
        <TextInput
          value={formData.first_name}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, first_name: text }))
          }
          editable={isEditing}
          style={{
            borderBottomWidth: 1,
            borderColor: "#ccc",
            padding: 8,
            marginBottom: 8,
          }}
        />
      </View>

      <View className="bg-white rounded-lg shadow-md p-4 mb-4">
        <AppText size="large" bold className="text-gray-700">
          Last Name
        </AppText>
        <TextInput
          value={formData.last_name}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, last_name: text }))
          }
          editable={isEditing}
          style={{
            borderBottomWidth: 1,
            borderColor: "#ccc",
            padding: 8,
          }}
        />
      </View>

      <View className="bg-white rounded-lg shadow-md p-4 mb-4">
        <AppText size="large" bold className="text-gray-700">
          Email
        </AppText>
        <TextInput
          value={formData.email}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, email: text }))
          }
          editable={isEditing}
          style={{
            borderBottomWidth: 1,
            borderColor: "#ccc",
            padding: 8,
          }}
        />
      </View>

      {user?.phone_number && (
        <View className="bg-white rounded-lg shadow-md p-4 mb-4">
          <AppText size="large" bold className="text-gray-700">
            Phone Number
          </AppText>
          <TextInput
            value={
              formData.phone_number !== undefined
                ? String(formData.phone_number)
                : undefined
            }
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, phone_number: Number(text) }))
            }
            editable={isEditing}
            style={{
              borderBottomWidth: 1,
              borderColor: "#ccc",
              padding: 8,
            }}
          />
        </View>
      )}

      {user?.address && (
        <View className="bg-white rounded-lg shadow-md p-4 mb-4">
          <AppText size="large" bold className="text-gray-700">
            Address
          </AppText>
          <TextInput
            value={formData.address}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, address: text }))
            }
            editable={isEditing}
            style={{
              borderBottomWidth: 1,
              borderColor: "#ccc",
              padding: 8,
            }}
          />
        </View>
      )}

      {user?.zip_code && (
        <View className="bg-white rounded-lg shadow-md p-4 mb-4">
          <AppText size="large" bold className="text-gray-700">
            Zip Code
          </AppText>
          <TextInput
            value={
              formData.zip_code !== undefined
                ? String(formData.zip_code)
                : undefined
            }
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, zip_code: Number(text) }))
            }
            editable={isEditing}
            style={{
              borderBottomWidth: 1,
              borderColor: "#ccc",
              padding: 8,
            }}
          />
        </View>
      )}

      {user?.country && (
        <View className="bg-white rounded-lg shadow-md p-4 mb-4">
          <AppText size="large" bold className="text-gray-700">
            Country
          </AppText>
          <TextInput
            value={formData.country}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, country: text }))
            }
            editable={isEditing}
            style={{
              borderBottomWidth: 1,
              borderColor: "#ccc",
              padding: 8,
            }}
          />
        </View>
      )}

      <TouchableOpacity
        onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
        style={{
          backgroundColor: "#007AFF",
          padding: 12,
          borderRadius: 8,
          alignItems: "center",
          marginTop: 16,
        }}
      >
        <AppText size="medium" bold className="text-white">
          {isEditing ? "Save" : "Update"}
        </AppText>
      </TouchableOpacity>
    </ScrollView>
  );
}
