import { useEffect, useState } from "react";
import base64 from "base64-js";
import { View, ActivityIndicator, ScrollView, Image } from "react-native";
import UserService from "@/services/userService";
import { User } from "@/models/User";
import { AppText } from "@/components/AppText";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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
          userData.image = base64String;
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

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <AppText size="medium" color="secondary" center>
          {error}
        </AppText>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <AppText size="extraHeading" bold>
        Profile
      </AppText>

      <View className="mt-4 items-center">
        {user?.image ? (
          <Image
            source={{ uri: `data:image/png;base64,${user.image}` }}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
        ) : (
          <MaterialCommunityIcons
            name="account-circle"
            size={100}
            color="#ccc"
          />
        )}
      </View>

      <View className="mt-4">
        <AppText size="large" bold>
          Name:
        </AppText>
        <AppText size="medium">{`${user?.first_name} ${user?.last_name}`}</AppText>
      </View>
      <View className="mt-4">
        <AppText size="large" bold>
          Email:
        </AppText>
        <AppText size="medium">{user?.email}</AppText>
      </View>
      {user?.phone_number && (
        <View className="mt-4">
          <AppText size="large" bold>
            Phone Number:
          </AppText>
          <AppText size="medium">{user.phone_number}</AppText>
        </View>
      )}
      {user?.address && (
        <View className="mt-4">
          <AppText size="large" bold>
            Address:
          </AppText>
          <AppText size="medium">{user.address}</AppText>
        </View>
      )}
      {user?.zip_code && (
        <View className="mt-4">
          <AppText size="large" bold>
            Zip Code:
          </AppText>
          <AppText size="medium">{user.zip_code}</AppText>
        </View>
      )}
      {user?.country && (
        <View className="mt-4">
          <AppText size="large" bold>
            Country:
          </AppText>
          <AppText size="medium">{user.country}</AppText>
        </View>
      )}
    </ScrollView>
  );
}
