import { jwtDecode } from "jwt-decode";
import AuthService from "./authServices";

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
}
