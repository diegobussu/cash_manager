import { Invoice } from "@/models/Invoice";
import axiosInstance from "./axiosInstance";
import UserService from "./userService";
import AuthService from "./authService";

export default class InvoiceService {
  public static async getInvoicesByUserID(): Promise<Invoice[]> {
    try {
      const userId = await UserService.getUserIdFromToken();
      const token = await AuthService.getAuthToken();
      const response = await axiosInstance.get(`/invoices/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error("No invoices found for this user");
      } else if (error.response && error.response.data) {
        throw new Error(
          error.response.data.message || "Failed to fetch invoices",
        );
      }
      throw new Error("An unexpected error occurred while fetching invoices");
    }
  }

  public static async getInvoiceByID(invoiceId: number): Promise<Invoice> {
    try {
      const token = await AuthService.getAuthToken();
      const response = await axiosInstance.get(`/invoices/${invoiceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error("Invoice not found");
      } else if (error.response && error.response.data) {
        throw new Error(
          error.response.data.message || "Failed to fetch invoice",
        );
      }
      throw new Error("An unexpected error occurred while fetching invoice");
    }
  }
}
