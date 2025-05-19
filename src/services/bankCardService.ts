import { BankCard } from "@/models/BankCard";
import axiosInstance from "./axiosInstance";
import UserService from "./userService";
import AuthService from "./authService";

export default class BankCardService {
  public static async getCardsByUserID(): Promise<BankCard[]> {
    try {
      const userId = await UserService.getUserIdFromToken();
      const token = await AuthService.getAuthToken();
      const response = await axiosInstance.get(`/cards/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error("No bank cards found for this user");
      } else if (error.response && error.response.data) {
        throw new Error(
          error.response.data.message || "Failed to fetch bank cards",
        );
      }
      throw new Error("An unexpected error occurred while fetching bank cards");
    }
  }

  public static async addBankCard(cardData: Partial<BankCard>): Promise<void> {
    try {
      const token = await AuthService.getAuthToken();
      await axiosInstance.post(`/cards`, cardData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error("Missing required fields for adding a bank card");
      } else if (error.response?.status === 409) {
        throw new Error("This card is already registered for this user");
      } else if (error.response && error.response.data) {
        throw new Error(
          error.response.data.message || "Failed to add bank card",
        );
      }
      throw new Error("An unexpected error occurred while adding a bank card");
    }
  }

  public static async deleteBankCard(cardId: number): Promise<void> {
    try {
      const token = await AuthService.getAuthToken();
      await axiosInstance.delete(`/cards/${cardId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error("Bank card not found");
      } else if (error.response?.status === 400) {
        throw new Error(
          "Cannot delete default card. Please add another card and set it as default first.",
        );
      } else if (error.response && error.response.data) {
        throw new Error(
          error.response.data.message || "Failed to delete bank card",
        );
      }
      throw new Error(
        "An unexpected error occurred while deleting the bank card",
      );
    }
  }

  public static async setDefaultBankCard(cardId: number): Promise<void> {
    try {
      const token = await AuthService.getAuthToken();
      await axiosInstance.put(`/cards/${cardId}/set-default`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error("Bank card not found");
      } else if (error.response?.status === 400) {
        throw new Error("This card is already set as default");
      } else if (error.response && error.response.data) {
        throw new Error(
          error.response.data.message || "Failed to set default bank card",
        );
      }
      throw new Error(
        "An unexpected error occurred while setting the default bank card",
      );
    }
  }
}
