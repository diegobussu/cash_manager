import AuthService from "./authService";
import axiosInstance from "./axiosInstance";
import { Product } from "@/models/Product";

export default class ProductService {
  public static async getProductByID(barcode: string): Promise<Product> {
    try {
      const token = await AuthService.getAuthToken();
      const response = await axiosInstance.get(
        `${AuthService.BASE_URL}/products/${barcode}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        throw new Error(
          error.response.data.message || "Failed to fetch product",
        );
      }
      throw new Error("An unexpected error occurred");
    }
  }
}
