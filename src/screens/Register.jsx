import React from "react";
import {
    ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

function Register() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>
        Set up your profile to start using the app
      </Text>

      {/* Profile Placeholder */}
      <TouchableOpacity style={styles.profileCircle}>
        <Text style={styles.plus}>+</Text>
      </TouchableOpacity>

      {/* Full Name */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          placeholder="Enter your full name"
          style={styles.input}
        />
      </View>

      {/* Phone Number */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          placeholder="+91 98765XXXXX"
          keyboardType="phone-pad"
          style={styles.input}
        />
      </View>

      {/* Company Name */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Firm / Company Name</Text>
        <TextInput
          placeholder="Enter company name"
          style={styles.input}
        />
      </View>

      {/* City */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>City</Text>
        <TextInput
          placeholder="Enter your city"
          style={styles.input}
        />
      </View>

      {/* Password */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder="Create a password"
          secureTextEntry
          style={styles.input}
        />
      </View>

      {/* Create Account Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        By continuing, you agree to our Terms & Privacy Policy.
      </Text>
    </ScrollView>
  );
}

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6F8",
    paddingHorizontal: 20,
    paddingTop: 60,
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1E1E1E",
  },

  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    marginTop: 6,
    marginBottom: 25,
  },

  profileCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },

  plus: {
    fontSize: 40,
    color: "#9CA3AF",
  },

  inputContainer: {
    marginBottom: 18,
  },

  label: {
    fontSize: 15,
    color: "#4B5563",
    marginBottom: 8,
    fontWeight: "500",
  },

  input: {
    height: 55,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DADDE2",
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
  },

  button: {
    height: 58,
    backgroundColor: "#F2994A",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },

  footer: {
    marginTop: 25,
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 13,
  },
});