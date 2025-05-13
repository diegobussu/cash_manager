import { jwtDecode } from "jwt-decode";
import AuthService from "./authServices";
import { User } from "@/models/User";
import axios from "axios";

export default class UserService {
  public static async getUserIdFromToken(): Promise<string> {
    try {
      const token = await AuthService.getAuthToken();
      const decodedToken: { userId: string } = jwtDecode(token);
      return decodedToken.userId;
    } catch (error) {
      console.error("Error decoding token:", error);
      throw new Error("Failed to retrieve user ID from token");
    }
  }

  public static async getUserByID(userId: string): Promise<User> {
    try {
      const token = await AuthService.getAuthToken();
      const response = await axios.get(
        `${AuthService.BASE_URL}/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data as User;
    } catch (error: any) {
      console.error("Error fetching user by ID:", error);
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || "Failed to fetch user");
      }
      throw new Error("An unexpected error occurred");
    }
  }
}
