import { jwtDecode } from "jwt-decode";
import AuthService from "./authService";
import { User } from "@/models/User";
import axios from "axios";
import Utils from "@/utils/Utils";
import axiosInstance from "./axiosInstance";

export default class UserService {
  public static async getUserIdFromToken(): Promise<string> {
    try {
      const token = await AuthService.getAuthToken();
      const decodedToken: { userId: string } = jwtDecode(token);
      return decodedToken.userId;
    } catch (error) {
      throw new Error("Failed to retrieve user ID from token");
    }
  }

  public static async getUserByID(userId: string): Promise<User> {
    try {
      const token = await AuthService.getAuthToken();
      const response = await axiosInstance.get(
        `${AuthService.BASE_URL}/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data as User;
    } catch (error: any) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || "Failed to fetch user");
      }
      throw new Error("An unexpected error occurred");
    }
  }

  public static async updateUser(userData: Partial<User>): Promise<User> {
    try {
      const token = await AuthService.getAuthToken();
      const userId = await UserService.getUserIdFromToken();
      const response = await axios.put(
        `${AuthService.BASE_URL}/users/${userId}`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data as User;
    } catch (error: any) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || "Failed to update user");
      }
      throw new Error("An unexpected error occurred");
    }
  }

  public static async updatePassword(
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    if (!Utils.isValidPassword(newPassword)) {
      throw new Error(
        "New password must be at least 8 characters long and include letters, numbers, and special characters",
      );
    }

    try {
      const token = await AuthService.getAuthToken();
      const userId = await UserService.getUserIdFromToken();

      await axios.put(
        `${AuthService.BASE_URL}/users/${userId}/update-password`,
        {
          oldPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error("Current password is incorrect");
      } else if (error.response && error.response.data) {
        throw new Error(
          error.response.data.message || "Failed to change password",
        );
      }
      throw new Error("An unexpected error occurred");
    }
  }

  public static async updateEmail(
    newEmail: string,
    password: string,
  ): Promise<void> {
    if (!Utils.isValidEmail(newEmail)) {
      throw new Error("Invalid email format");
    }

    if (!Utils.isValidPassword(password)) {
      throw new Error(
        "Password must be at least 8 characters long and include letters, numbers, and special characters",
      );
    }

    try {
      const token = await AuthService.getAuthToken();
      const userId = await UserService.getUserIdFromToken();
      await axios.put(
        `${AuthService.BASE_URL}/users/${userId}/update-email`,
        {
          newEmail,
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error("New email must be different from current email");
      } else if (error.response?.status === 401) {
        throw new Error("Current password is incorrect");
      } else if (error.response && error.response.data) {
        throw new Error(
          error.response.data.message || "Failed to change email",
        );
      }
      throw new Error("An unexpected error occurred");
    }
  }

  public static async deleteAccount(): Promise<void> {
    try {
      const token = await AuthService.getAuthToken();
      const userId = await UserService.getUserIdFromToken();

      await axios.delete(
        `${AuthService.BASE_URL}/users/${userId}/delete-account`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error: any) {
      if (error.response && error.response.data) {
        throw new Error(
          error.response.data.message || "Failed to delete account",
        );
      }
      throw new Error("An unexpected error occurred");
    }
  }
}
