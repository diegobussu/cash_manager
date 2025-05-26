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
      contentContainerStyle={{
        padding: 20,
        backgroundColor: "#f4f6fb",
        minHeight: "100%",
      }}
      keyboardShouldPersistTaps="handled"
    >
      <View
        style={{
          alignItems: "center",
          marginBottom: 32,
          position: "relative",
        }}
      >
        <TouchableOpacity
          onPress={handleImagePick}
          style={{ position: "relative" }}
          activeOpacity={0.8}
        >
          {user?.image ? (
            <Image
              source={{ uri: user.image as string }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                borderWidth: 3,
                borderColor: "#007AFF",
                backgroundColor: "#e5e7eb",
              }}
            />
          ) : (
            <MaterialCommunityIcons
              name="account-circle"
              size={120}
              color="#d1d5db"
              style={{
                backgroundColor: "#e5e7eb",
                borderRadius: 60,
              }}
            />
          )}
          <View
            style={{
              position: "absolute",
              bottom: 0,
              right: -10,
              backgroundColor: "#007AFF",
              borderRadius: 20,
              padding: 7,
              borderWidth: 2,
              borderColor: "#fff",
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <MaterialCommunityIcons name="pencil" size={18} color="#fff" />
          </View>
          {user?.image && (
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  "Confirm Deletion",
                  "Are you sure you want to remove your profile picture ?",
                  [
                    { text: "Cancel", style: "destructive" },
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
                left: -10,
                backgroundColor: "#FF3B30",
                borderRadius: 20,
                padding: 7,
                borderWidth: 2,
                borderColor: "#fff",
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <MaterialCommunityIcons name="trash-can" size={18} color="#fff" />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </View>

      {/* Champs du formulaire */}
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 16,
          padding: 20,
          marginBottom: 18,
          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
          elevation: 2,
        }}
      >
        <AppText bold color="primary" className="text-[15px] mb-1.5">
          First Name
        </AppText>
        <TextInput
          value={formData.first_name}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, first_name: text }))
          }
          editable={isEditing}
          placeholder="Enter your first name"
          placeholderTextColor="#9ca3af"
          style={{
            borderWidth: 1,
            borderColor: isEditing ? "#007AFF" : "#e5e7eb",
            borderRadius: 8,
            padding: 10,
            backgroundColor: isEditing ? "#fff" : "#f3f4f6",
            marginBottom: 14,
            fontSize: 16,
            color: "#111827",
          }}
        />

        <AppText bold color="primary" className="text-[15px] mb-1.5">
          Last Name
        </AppText>
        <TextInput
          value={formData.last_name}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, last_name: text }))
          }
          editable={isEditing}
          placeholder="Enter your last name"
          placeholderTextColor="#9ca3af"
          style={{
            borderWidth: 1,
            borderColor: isEditing ? "#007AFF" : "#e5e7eb",
            borderRadius: 8,
            padding: 10,
            backgroundColor: isEditing ? "#fff" : "#f3f4f6",
            marginBottom: 14,
            fontSize: 16,
            color: "#111827",
          }}
        />

        <AppText bold color="primary" className="text-[15px] mb-1.5">
          Email
        </AppText>
        <TextInput
          value={formData.email}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, email: text }))
          }
          editable={isEditing}
          placeholder="Enter your email"
          placeholderTextColor="#9ca3af"
          keyboardType="email-address"
          autoCapitalize="none"
          style={{
            borderWidth: 1,
            borderColor: isEditing ? "#007AFF" : "#e5e7eb",
            borderRadius: 8,
            padding: 10,
            backgroundColor: isEditing ? "#fff" : "#f3f4f6",
            marginBottom: 14,
            fontSize: 16,
            color: "#111827",
          }}
        />

        {user?.phone_number !== undefined && (
          <>
            <AppText bold color="primary" className="text-[15px] mb-1.5">
              Phone Number
            </AppText>
            <TextInput
              value={
                formData.phone_number !== undefined
                  ? String(formData.phone_number)
                  : ""
              }
              onChangeText={(text) =>
                setFormData((prev) => ({
                  ...prev,
                  phone_number: Number(text.replace(/[^0-9]/g, "")),
                }))
              }
              editable={isEditing}
              placeholder="Enter your phone number"
              placeholderTextColor="#9ca3af"
              keyboardType="phone-pad"
              style={{
                borderWidth: 1,
                borderColor: isEditing ? "#007AFF" : "#e5e7eb",
                borderRadius: 8,
                padding: 10,
                backgroundColor: isEditing ? "#fff" : "#f3f4f6",
                marginBottom: 14,
                fontSize: 16,
                color: "#111827",
              }}
            />
          </>
        )}

        {user?.address !== undefined && (
          <>
            <AppText bold color="primary" className="text-[15px] mb-1.5">
              Address
            </AppText>
            <TextInput
              value={formData.address}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, address: text }))
              }
              editable={isEditing}
              placeholder="Enter your address"
              placeholderTextColor="#9ca3af"
              style={{
                borderWidth: 1,
                borderColor: isEditing ? "#007AFF" : "#e5e7eb",
                borderRadius: 8,
                padding: 10,
                backgroundColor: isEditing ? "#fff" : "#f3f4f6",
                marginBottom: 14,
                fontSize: 16,
                color: "#111827",
              }}
            />
          </>
        )}

        {user?.zip_code !== undefined && (
          <>
            <AppText bold color="primary" className="text-[15px] mb-1.5">
              Zip Code
            </AppText>
            <TextInput
              value={
                formData.zip_code !== undefined ? String(formData.zip_code) : ""
              }
              onChangeText={(text) =>
                setFormData((prev) => ({
                  ...prev,
                  zip_code: Number(text.replace(/[^0-9]/g, "")),
                }))
              }
              editable={isEditing}
              placeholder="Enter your zip code"
              placeholderTextColor="#9ca3af"
              keyboardType="number-pad"
              style={{
                borderWidth: 1,
                borderColor: isEditing ? "#007AFF" : "#e5e7eb",
                borderRadius: 8,
                padding: 10,
                backgroundColor: isEditing ? "#fff" : "#f3f4f6",
                marginBottom: 14,
                fontSize: 16,
                color: "#111827",
              }}
            />
          </>
        )}

        {user?.country !== undefined && (
          <>
            <AppText bold color="primary" className="text-[15px] mb-1.5">
              Country
            </AppText>
            <TextInput
              value={formData.country}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, country: text }))
              }
              editable={isEditing}
              placeholder="Enter your country"
              placeholderTextColor="#9ca3af"
              style={{
                borderWidth: 1,
                borderColor: isEditing ? "#007AFF" : "#e5e7eb",
                borderRadius: 8,
                padding: 10,
                backgroundColor: isEditing ? "#fff" : "#f3f4f6",
                marginBottom: 0,
                fontSize: 16,
                color: "#111827",
              }}
            />
          </>
        )}
      </View>

      <TouchableOpacity
        onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
        activeOpacity={0.85}
        style={{
          backgroundColor: "#007AFF",
          paddingVertical: 14,
          paddingHorizontal: 24,
          borderRadius: 10,
          alignItems: "center",
          marginTop: 10,
          flexDirection: "row",
          justifyContent: "center",
          shadowColor: "#007AFF",
          shadowOpacity: 0.18,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
          elevation: 2,
        }}
      >
        <AppText bold color="white" className="text-[15px] mb-1.5">
          {isEditing ? "Save" : "Update"}
        </AppText>
        <MaterialCommunityIcons
          name={isEditing ? "content-save" : "pencil"}
          size={22}
          color="#fff"
          style={{ marginLeft: 10 }}
        />
      </TouchableOpacity>
    </ScrollView>
  );
}
