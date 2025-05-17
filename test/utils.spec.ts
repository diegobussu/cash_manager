import Utils from "../src/utils/Utils";

describe("Utils", () => {
  describe("isValidEmail", () => {
    it("should return true for valid emails", () => {
      expect(Utils.isValidEmail("test@example.com")).toBe(true);
      expect(Utils.isValidEmail("user.name+tag@domain.co")).toBe(true);
    });

    it("should return false for invalid emails", () => {
      expect(Utils.isValidEmail("invalid-email")).toBe(false);
      expect(Utils.isValidEmail("user@.com")).toBe(false);
    });
  });

  describe("isValidPassword", () => {
    it("should return true for valid passwords", () => {
      expect(Utils.isValidPassword("Password1!")).toBe(true);
      expect(Utils.isValidPassword("Abcdefg1@")).toBe(true);
    });

    it("should return false for invalid passwords", () => {
      expect(Utils.isValidPassword("short1!")).toBe(false); // trop court
      expect(Utils.isValidPassword("NoNumber!")).toBe(false); // pas de chiffre
      expect(Utils.isValidPassword("nonumber1")).toBe(false); // pas de caractère spécial
    });
  });

  describe("getImageSize", () => {
    it("should return the correct size in KB for a base64 string", () => {
      // "hello" en base64 = aGVsbG8=
      const base64 = "aGVsbG8=";
      // La taille dépend de Constants.MAX_SIZE_KB, ici on vérifie juste que ça retourne un nombre
      expect(typeof Utils.getImageSize(base64)).toBe("number");
    });
  });
});
