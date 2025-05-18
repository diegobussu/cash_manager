import { useLocalSearchParams } from "expo-router";
import { View, StyleSheet, ScrollView, Image } from "react-native";
import { Product } from "@/models/Product";
import { AppText } from "@/components/AppText";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ProductScreen() {
  const { product } = useLocalSearchParams();
  const productData: Product = JSON.parse(product as string);

  const formatDate = (date: Date | string) => {
    if (!date) return "N/A";
    try {
      const dateObj = new Date(date);
      return dateObj.toLocaleDateString();
    } catch (e) {
      return "N/A";
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.imageContainer}>
        {productData.image_url ? (
          <Image source={{ uri: productData.image_url }} style={styles.image} />
        ) : (
          <View style={styles.placeholderImage}>
            <MaterialCommunityIcons name="food" size={80} color="#ccc" />
          </View>
        )}
      </View>

      <View style={styles.container}>
        <AppText size="heading" bold center>
          {productData.name}
        </AppText>
        <AppText size="medium" color="secondary" center className="mb-6">
          {productData.brand}
        </AppText>

        {/* Basic Info Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="information"
              size={22}
              color="#0853A9"
            />
            <AppText size="large" bold className="ml-2">
              Basic Information
            </AppText>
          </View>

          <View style={styles.infoRow}>
            <AppText size="small" color="secondary" className="w-1/3">
              Barcode
            </AppText>
            <AppText size="small" bold className="w-2/3">
              {productData.bar_code}
            </AppText>
          </View>

          <View style={styles.infoRow}>
            <AppText size="small" color="secondary" className="w-1/3">
              Manufacturing
            </AppText>
            <AppText size="small" bold className="w-2/3">
              {productData.manufacturing_country || "N/A"}
            </AppText>
          </View>

          <View style={styles.infoRow}>
            <AppText size="small" color="secondary" className="w-1/3">
              Quantity
            </AppText>
            <AppText size="small" bold className="w-2/3">
              {productData.quantity || "N/A"}
            </AppText>
          </View>
        </View>

        {/* Nutrition Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="food-apple"
              size={22}
              color="#0853A9"
            />
            <AppText size="large" bold className="ml-2">
              Nutrition Facts
            </AppText>
          </View>

          <View style={styles.nutritionGrid}>
            <View style={styles.nutritionItem}>
              <AppText size="small" color="secondary">
                Energy
              </AppText>
              <AppText size="medium" bold>
                {productData.energy || "0"} kcal
              </AppText>
            </View>

            <View style={styles.nutritionItem}>
              <AppText size="small" color="secondary">
                Fat
              </AppText>
              <AppText size="medium" bold>
                {productData.fat || "0"} g
              </AppText>
            </View>

            <View style={styles.nutritionItem}>
              <AppText size="small" color="secondary">
                Saturated Fat
              </AppText>
              <AppText size="medium" bold>
                {productData.saturated_fat || "0"} g
              </AppText>
            </View>

            <View style={styles.nutritionItem}>
              <AppText size="small" color="secondary">
                Carbohydrates
              </AppText>
              <AppText size="medium" bold>
                {productData.carbohydrates || "0"} g
              </AppText>
            </View>

            <View style={styles.nutritionItem}>
              <AppText size="small" color="secondary">
                Sugars
              </AppText>
              <AppText size="medium" bold>
                {productData.sugars || "0"} g
              </AppText>
            </View>

            <View style={styles.nutritionItem}>
              <AppText size="small" color="secondary">
                Proteins
              </AppText>
              <AppText size="medium" bold>
                {productData.proteins || "0"} g
              </AppText>
            </View>

            <View style={styles.nutritionItem}>
              <AppText size="small" color="secondary">
                Salt
              </AppText>
              <AppText size="medium" bold>
                {productData.salt || "0"} g
              </AppText>
            </View>
          </View>
        </View>

        {/* Ingredients & Allergens */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="flask" size={22} color="#0853A9" />
            <AppText size="large" bold className="ml-2">
              Composition
            </AppText>
          </View>

          <View style={styles.compositionItem}>
            <AppText size="medium" bold>
              Ingredients
            </AppText>
            <AppText size="small" className="mt-1">
              {productData.ingredients || "No ingredients data available"}
            </AppText>
          </View>

          <View style={styles.compositionItem}>
            <AppText size="medium" bold>
              Allergens
            </AppText>
            <AppText size="small" className="mt-1">
              {productData.allergens || "No allergen data available"}
            </AppText>
          </View>

          <View style={styles.compositionItem}>
            <AppText size="medium" bold>
              Additives
            </AppText>
            <AppText size="small" className="mt-1">
              {productData.additives || "No additives data available"}
            </AppText>
          </View>

          <View style={styles.compositionItem}>
            <AppText size="medium" bold>
              Labels
            </AppText>
            <AppText size="small" className="mt-1">
              {productData.labels || "No labels data available"}
            </AppText>
          </View>
        </View>

        {/* Footer Info */}
        <View style={styles.footer}>
          <AppText size="small" color="tertiary">
            Product ID: {productData.id}
          </AppText>
          <AppText size="small" color="tertiary">
            Created: {formatDate(productData.created_at)}
          </AppText>
          <AppText size="small" color="tertiary">
            Last updated: {formatDate(productData.updated_at)}
          </AppText>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#f5f5f5",
  },
  container: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  imageContainer: {
    height: 240,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  section: {
    marginBottom: 24,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2.5,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    paddingBottom: 12,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  nutritionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  nutritionItem: {
    width: "48%",
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  compositionItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  footer: {
    marginTop: 8,
    marginBottom: 20,
    alignItems: "center",
  },
});
