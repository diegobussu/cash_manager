import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { AppText } from "@/components/AppText";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useLocalization } from "@/utils/i18n";

export default function RateUsScreen() {
  const { t } = useLocalization();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (rating === 0) {
      Alert.alert(t("error"), t("pleaseSelectRating"));
      return;
    }

    Alert.alert(t("thankYou"), t("feedbackSubmitted"));

    // Reset fields after submission
    setRating(0);
    setComment("");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{
            flex: 1,
            padding: 16,
            backgroundColor: "#f4f6fb",
            justifyContent: "center",
          }}
        >
          <AppText size="heading" bold center className="mb-6">
            {t("rateOurApp")}
          </AppText>

          {/* Star rating section */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <MaterialCommunityIcons
                  name={star <= rating ? "star" : "star-outline"}
                  size={40}
                  color="#FFD700"
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Comment input field */}
          <TextInput
            placeholder={t("leaveComment")}
            value={comment}
            onChangeText={setComment}
            style={{
              borderWidth: 1,
              borderColor: "#e5e7eb",
              borderRadius: 8,
              padding: 12,
              backgroundColor: "#fff",
              marginBottom: 16,
              textAlignVertical: "top",
              height: 100,
            }}
            multiline
          />

          {/* Submit button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={rating === 0}
            style={{
              backgroundColor: rating === 0 ? "#A9A9A9" : "#007AFF",
              paddingVertical: 14,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <AppText bold color="white">
              {t("submit")}
            </AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
