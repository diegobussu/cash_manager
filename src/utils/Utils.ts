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
}
