import AuthService from "./authService";
import axiosInstance from "./axiosInstance";
import { Product } from "@/models/Product";

export default class ProductService {
  public static async getProductByID(barcode: string): Promise<Product> {
    try {
      const token = await AuthService.getAuthToken();
      const response = await axiosInstance.get(`/products/${barcode}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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

  public static async getProductByQuery(
    query: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<Product[]> {
    try {
      const token = await AuthService.getAuthToken();
      const response = await axiosInstance.get("/products", {
        params: { query, page, limit },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        throw new Error(
          error.response.data.message || "Failed to fetch products",
        );
      }
      throw new Error("An unexpected error occurred");
    }
  }

  public static async updateProductQuantity(
    barcode: string,
    quantity: number,
  ): Promise<void> {
    try {
      const token = await AuthService.getAuthToken();
      await axiosInstance.put(
        `/products/${barcode}/quantity`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error: any) {
      if (error.response && error.response.data) {
        throw new Error(
          error.response.data.message || "Failed to update product quantity",
        );
      }
      throw new Error("An unexpected error occurred");
    }
  }
}
