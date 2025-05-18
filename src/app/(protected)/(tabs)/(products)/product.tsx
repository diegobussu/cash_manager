import { useLocalSearchParams } from "expo-router";
import { Text, StyleSheet, ScrollView, Image } from "react-native";
import { Product } from "@/models/Product";

export default function ProductScreen() {
  const { product } = useLocalSearchParams();
  const productData: Product = JSON.parse(product as string);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{productData.name}</Text>
      {productData.image_url && (
        <Image source={{ uri: productData.image_url }} style={styles.image} />
      )}
      <Text style={styles.detail}>Brand: {productData.brand}</Text>
      <Text style={styles.detail}>Barcode: {productData.bar_code}</Text>
      <Text style={styles.detail}>
        Ingredients: {productData.ingredients || "N/A"}
      </Text>
      <Text style={styles.detail}>
        Energy: {productData.energy || "N/A"} kcal
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginBottom: 16,
  },
  detail: {
    fontSize: 16,
    marginBottom: 8,
  },
});
