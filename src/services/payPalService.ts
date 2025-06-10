import axiosInstance from "./axiosInstance";
import AuthService from "./authService";

export default class PayPalService {
  public static async createOrder(
    amount: number,
    description: string = "Cash Manager Purchase",
  ) {
    try {
      const token = await AuthService.getAuthToken();
      const response = await axiosInstance.post(
        "/paypal/create-order",
        { amount, description },
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
          error.response.data.message || "Failed to create PayPal order",
        );
      }
      throw new Error("An unexpected error occurred");
    }
  }

  public static async capturePayment(orderId: string) {
    try {
      const token = await AuthService.getAuthToken();
      const response = await axiosInstance.post(
        `/paypal/capture/${orderId}`,
        {},
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
          error.response.data.message || "Failed to capture PayPal payment",
        );
      }
      throw new Error("An unexpected error occurred");
    }
  }

  public static async getOrderDetails(orderId: string) {
    try {
      const token = await AuthService.getAuthToken();
      const response = await axiosInstance.get(`/paypal/order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        throw new Error(
          error.response.data.message || "Failed to get PayPal order details",
        );
      }
      throw new Error("An unexpected error occurred");
    }
  }
}
