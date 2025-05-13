import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { User } from "../models/User";

export default class AuthService {
  private static readonly BASE_URL = process.env.EXPO_PUBLIC_API_URL;

  public static async login(
    email: string,
    password: string,
  ): Promise<{ token: string; user: Partial<User> }> {
    try {
      const response = await axios.post(`${this.BASE_URL}/auth/login`, {
        email,
        password,
      });

      const { token, user } = response.data;

      await AsyncStorage.setItem("token", token);

      return { token, user };
    } catch (error) {
      throw error;
    }
  }

  public static async register(userData: User): Promise<{ message: string }> {
    try {
      const response = await axios.post(
        `${this.BASE_URL}/auth/register`,
        userData,
      );
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || "Registration failed");
      }
      throw new Error("An unexpected error occurred");
    }
  }
}
