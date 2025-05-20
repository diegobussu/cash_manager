import Constants from "./Constants";

export default class Utils {
  public static isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  public static isValidPassword = (password: string): boolean => {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  public static getImageSize(img: string): number {
    // Calculate the size of the Base64 string in bytes
    const padding = img.endsWith("==") ? 2 : img.endsWith("=") ? 1 : 0;
    const sizeInBytes = (img.length * 3) / 4 - padding;

    // Convert bytes to kilobytes
    return sizeInBytes / Constants.MAX_SIZE_KB;
  }

  public static getLast4Digits(cardNumber: string): string {
    // Remove non-digit characters and return last 4 digits
    const digits = cardNumber.replace(/\D/g, "");
    return digits.slice(-4);
  }

  public static formatDate(date: Date | string): string {
    if (!date) return "N/A";
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return "N/A";
      return dateObj.toLocaleString(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "N/A";
    }
  }
}
