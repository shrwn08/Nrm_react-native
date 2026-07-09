import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function Welcome({ navigation }) {
  return (
     <SafeAreaProvider style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1C4E80" />

      {/*  Top blue section */}
      <View style={styles.topSection}>
        {/* Decorative circles */}
        <View style={[styles.circle, styles.circleTopLeft]} />
        <View style={[styles.circle, styles.circleTopRight]} />
        <View style={[styles.circle, styles.circleBottomLeft]} />
        <View style={[styles.circle, styles.circleBottomRight]} />

        {/* Logo card */}
        <View style={styles.logoCard}>
          {/* Orange dot accent */}
          <View style={styles.logoDot} />

          {/* Truck icon - drawn with views */}
          <View style={styles.truckBody} />
          <View style={styles.truckCabin} />
          <View style={styles.truckWheelLeft} />
          <View style={styles.truckWheelRight} />
        </View>

        {/* App name */}
        <Text style={styles.appName}>RodBazaar</Text>
        <Text style={styles.appTagline}>Iron rod orders · simplified</Text>
      </View>

      {/*  White curved bottom section */}
      <View style={styles.bottomSection}>
        <Text style={styles.headline}>Order rods. Send your truck.</Text>
        <Text style={styles.subline}>We'll have it loaded and ready.</Text>

        {/* Buttons */}
        <TouchableOpacity
          style={styles.btnPrimary}
          activeOpacity={0.85}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.btnPrimaryText}>Create account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnGhost}
          activeOpacity={0.85}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.btnGhostText}>Log in</Text>
        </TouchableOpacity>

        <Text style={styles.legal}>
          By continuing you agree to our{"\n"}
          <Text style={styles.legalLink}>Terms of Service & Privacy Policy</Text>
        </Text>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C4E80",
  },

  // Top blue section 
  topSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1C4E80",
    overflow: "hidden",
    paddingBottom: 40,
  },

  // Decorative background circles
  circle: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "#143A5F",
  },
  circleTopLeft: {
    width: 220,
    height: 220,
    top: -80,
    left: -80,
  },
  circleTopRight: {
    width: 220,
    height: 220,
    top: -60,
    right: -60,
  },
  circleBottomLeft: {
    width: 200,
    height: 200,
    bottom: -40,
    left: 20,
  },
  circleBottomRight: {
    width: 200,
    height: 200,
    bottom: -50,
    right: -20,
  },

  // Logo card
  logoCard: {
    width: 120,
    height: 120,
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    // truck parts are positioned absolute inside this card
    position: "relative",
    overflow: "hidden",
  },
  logoDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#F2994A",
    position: "absolute",
    top: 16,
    left: 18,
  },
  truckBody: {
    width: 76,
    height: 36,
    backgroundColor: "#1C4E80",
    borderRadius: 4,
    position: "absolute",
    bottom: 28,
    left: 10,
  },
  truckCabin: {
    width: 32,
    height: 28,
    backgroundColor: "#1C4E80",
    borderRadius: 4,
    position: "absolute",
    bottom: 28,
    right: 8,
  },
  truckWheelLeft: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#F4F6F8",
    borderWidth: 3,
    borderColor: "#1C4E80",
    position: "absolute",
    bottom: 10,
    left: 22,
  },
  truckWheelRight: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#F4F6F8",
    borderWidth: 3,
    borderColor: "#1C4E80",
    position: "absolute",
    bottom: 10,
    right: 18,
  },

  appName: {
    fontSize: 36,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  appTagline: {
    fontSize: 16,
    color: "#B4D2F0",
    fontWeight: "400",
  },

  //  Bottom white section 
  bottomSection: {
    backgroundColor: "#F4F6F8",
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 28,
    paddingTop: 40,
    paddingBottom: 32,
    alignItems: "center",
  },

  headline: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 10,
  },
  subline: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 36,
  },

  btnPrimary: {
    width: "100%",
    height: 54,
    backgroundColor: "#F2994A",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  btnPrimaryText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  btnGhost: {
    width: "100%",
    height: 54,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#1C4E80",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  btnGhostText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1C4E80",
  },

  legal: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 18,
  },
  legalLink: {
    color: "#6B7280",
    textDecorationLine: "underline",
  },
});