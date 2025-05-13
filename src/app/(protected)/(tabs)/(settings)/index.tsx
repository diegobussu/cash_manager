import { View, TouchableOpacity } from "react-native";
import { useContext } from "react";
import { AuthContext } from "@/utils/authContext";
import { AppText } from "@/components/AppText";

export default function IndexScreen() {
  const authState = useContext(AuthContext);

  return (
    <View className="flex-1 justify-between p-4">
      <View className="flex-1 justify-center"></View>
      <TouchableOpacity onPress={authState.logOut}>
        <AppText size="medium" center className="italic">
          Log out
        </AppText>
      </TouchableOpacity>
    </View>
  );
}
