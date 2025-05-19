import React, { useContext, useState } from "react";
import { View, TouchableOpacity, TextInput, Button } from "react-native";
import { AppText } from "@/components/AppText";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import UserService from "@/services/userService";
import { AuthContext } from "@/utils/authContext";

export default function SecurityScreen() {
  const { logOut } = useContext(AuthContext);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [passwordForEmail, setPasswordForEmail] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showPasswordForEmail, setShowPasswordForEmail] = useState(false);

  // States for error and success messages
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleUpdatePassword = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    try {
      await UserService.updatePassword(oldPassword, newPassword);
      setSuccessMessage(
        "Password updated successfully. You will be logged out.",
      );
      setShowPasswordForm(false);
      logOut();
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to update password.");
    }
  };

  const handleUpdateEmail = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    try {
      await UserService.updateEmail(newEmail, passwordForEmail);
      setSuccessMessage("Email updated successfully. You will be logged out.");
      setShowEmailForm(false);
      logOut();
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to update email.");
    }
  };

  const togglePasswordForm = () => {
    setShowPasswordForm(!showPasswordForm);
    if (showEmailForm) {
      setShowEmailForm(false);
      setNewEmail("");
      setPasswordForEmail("");
      setErrorMessage("");
      setSuccessMessage("");
    }
  };

  const toggleEmailForm = () => {
    setShowEmailForm(!showEmailForm);
    if (showPasswordForm) {
      setShowPasswordForm(false);
      setOldPassword("");
      setNewPassword("");
      setErrorMessage("");
      setSuccessMessage("");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 16,
        backgroundColor: "#f4f6fb",
      }}
    >
      <View
        style={{
          marginTop: 24,
          backgroundColor: "#fff",
          borderRadius: 16,
          padding: 16,
          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
          elevation: 2,
        }}
      >
        {/* Update Password Section */}
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderBottomColor: "#e5e7eb",
          }}
          onPress={togglePasswordForm}
        >
          <MaterialCommunityIcons name="lock-reset" size={24} color="#0853A9" />
          <AppText size="medium" className="ml-4">
            Update Password
          </AppText>
        </TouchableOpacity>
        {showPasswordForm && (
          <View style={{ marginTop: 16 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#e5e7eb",
                borderRadius: 8,
                paddingHorizontal: 8,
                marginBottom: 8,
                backgroundColor: "#fff",
              }}
            >
              <TextInput
                placeholder="Current Password"
                secureTextEntry={!showOldPassword}
                style={{ flex: 1, paddingVertical: 8 }}
                value={oldPassword}
                onChangeText={setOldPassword}
              />
              <TouchableOpacity
                onPress={() => setShowOldPassword(!showOldPassword)}
              >
                <MaterialCommunityIcons
                  name={showOldPassword ? "eye-off" : "eye"}
                  size={24}
                  color="#0853A9"
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#e5e7eb",
                borderRadius: 8,
                paddingHorizontal: 8,
                marginBottom: 8,
                backgroundColor: "#fff",
              }}
            >
              <TextInput
                placeholder="New Password"
                secureTextEntry={!showNewPassword}
                style={{ flex: 1, paddingVertical: 8 }}
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity
                onPress={() => setShowNewPassword(!showNewPassword)}
              >
                <MaterialCommunityIcons
                  name={showNewPassword ? "eye-off" : "eye"}
                  size={24}
                  color="#0853A9"
                />
              </TouchableOpacity>
            </View>
            {/* Display error or success message for password */}
            {errorMessage && (
              <AppText
                size="small"
                center
                bold
                color="danger"
                className="text-red-500 mb-4"
              >
                {errorMessage}
              </AppText>
            )}
            {successMessage && (
              <AppText
                size="small"
                center
                bold
                color="success"
                className="text-green-500 mb-4"
              >
                {successMessage}
              </AppText>
            )}
            <Button
              title="Save"
              onPress={handleUpdatePassword}
              disabled={!oldPassword || !newPassword}
            />
          </View>
        )}

        {/* Update Email Section */}
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderBottomColor: "#e5e7eb",
          }}
          onPress={toggleEmailForm}
        >
          <MaterialCommunityIcons name="email-edit" size={24} color="#0853A9" />
          <AppText size="medium" className="ml-4">
            Update Email
          </AppText>
        </TouchableOpacity>
        {showEmailForm && (
          <View style={{ marginTop: 16 }}>
            <TextInput
              placeholder="New Email"
              style={{
                borderWidth: 1,
                borderColor: "#e5e7eb",
                borderRadius: 8,
                padding: 8,
                marginBottom: 8,
              }}
              value={newEmail}
              onChangeText={setNewEmail}
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#e5e7eb",
                borderRadius: 8,
                paddingHorizontal: 8,
                marginBottom: 8,
                backgroundColor: "#fff",
              }}
            >
              <TextInput
                placeholder="Password"
                secureTextEntry={!showPasswordForEmail}
                style={{ flex: 1, paddingVertical: 8 }}
                value={passwordForEmail}
                onChangeText={setPasswordForEmail}
              />
              <TouchableOpacity
                onPress={() => setShowPasswordForEmail(!showPasswordForEmail)}
              >
                <MaterialCommunityIcons
                  name={showPasswordForEmail ? "eye-off" : "eye"}
                  size={24}
                  color="#0853A9"
                />
              </TouchableOpacity>
            </View>
            {/* Display error or success message for password */}
            {errorMessage && (
              <AppText
                size="small"
                center
                bold
                color="danger"
                className="text-red-500 mb-4"
              >
                {errorMessage}
              </AppText>
            )}
            {successMessage && (
              <AppText
                size="small"
                center
                bold
                color="success"
                className="text-green-500 mb-4"
              >
                {successMessage}
              </AppText>
            )}
            <Button
              title="Save"
              onPress={handleUpdateEmail}
              disabled={!newEmail || !passwordForEmail}
            />
          </View>
        )}
      </View>
    </View>
  );
}
