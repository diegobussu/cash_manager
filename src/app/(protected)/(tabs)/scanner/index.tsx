import {
  CameraView,
  CameraType,
  useCameraPermissions,
  BarcodeScanningResult,
} from "expo-camera";
import { useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ProductService from "@/services/productService";
import { router } from "expo-router";

export default function IndexScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [barcodeData, setBarcodeData] = useState<string | null>(null);
  const [torchOn, setTorchOn] = useState(false);
  const [cameraIconOutline, setCameraIconOutline] = useState(false);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
    setCameraIconOutline((prev) => !prev);
    // Ensure torch is turned off when switching to front camera
    if (facing === "back") {
      setTorchOn(false);
    }
  }

  function toggleTorch() {
    setTorchOn((previous) => !previous);
  }

  const handleBarcodeScanned = async ({
    type,
    data,
  }: BarcodeScanningResult) => {
    if (scanned || barcodeData === data) return;
    setScanned(true);
    setBarcodeData(data);

    try {
      const product = await ProductService.getProductByID(data);
      router.push({
        pathname: "/product",
        params: { product: JSON.stringify(product) },
      });
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "Failed to fetch product. Please try again.",
      );
      setScanned(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        style={styles.camera}
        facing={facing}
        enableTorch={torchOn}
        barcodeScannerSettings={{
          barcodeTypes: ["ean13", "qr", "pdf417", "aztec", "code39", "code128"],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
      />
      {/* Superposition des éléments */}
      <View style={styles.overlay}>
        <View style={styles.scanArea} />
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[
            styles.torchButton,
            facing === "front" && styles.torchButtonDisabled,
          ]}
          onPress={toggleTorch}
          disabled={facing === "front"}
        >
          <MaterialCommunityIcons
            name={torchOn ? "flashlight" : "flashlight-off"}
            size={24}
            color={facing === "front" ? "gray" : "white"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <MaterialCommunityIcons
            name={cameraIconOutline ? "camera-flip" : "camera-flip-outline"}
            size={24}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    flexDirection: "row",
    width: "100%",
    backgroundColor: "transparent",
    padding: 20,
    justifyContent: "space-between",
  },
  controlsContainer: {
    position: "absolute",
    top: 80,
    right: 20,
    zIndex: 10,
  },
  torchButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  torchButtonDisabled: {
    backgroundColor: "rgba(128,128,128,0.5)",
  },
  button: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 8,
    padding: 12,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: "#ffffff",
    borderRadius: 10,
  },
});
