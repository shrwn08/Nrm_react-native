import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { SafeAreaProvider } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../redux/features/authSlice";

function Login() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { isLoading, isError } = useSelector((state) => state.auth);

  // 'phone_no' or 'email' - controls which keyboard/placeholder we show
  // and which field name we send to the backend
  const [loginMethod, setLoginMethod] = useState("phone_no");

  const [data, setData] = useState({
    identifier: "", // holds either the phone_no number or the email
    password: "",
  });

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  // Switching methods clears the field so a half-typed phone_no number
  // doesn't get submitted as an email, or vice versa
  const switchMethod = (method) => {
    setLoginMethod(method);
    handleChange("identifier", "");
  };

  const handleLogin = async () => {
    if (!data.identifier.trim()) {
      alert(
        `Please enter your ${loginMethod === "phone_no" ? "phone number" : "email"}`,
      );
      return;
    }
    if (!data.password) {
      alert("Please enter your password");
      return;
    }

    const payload =
      loginMethod === "phone_no"
        ? { phone_no: data.identifier, password: data.password }
        : { email: data.identifier, password: data.password };

    const result = await dispatch(userLogin(payload));

    if (userLogin.rejected.match(result)) {
      // error is already stored in Redux (isError)
      // but we also log here for debugging
      console.log("Login failed:", result.payload);
    }
  };

  // const handleOtpLogin = () => {
  //   // Reuse the same OTP screen from registration —
  //   // pass phone_no_no only if we're currently in phone_no mode
  //   navigation.navigate("Otp", {
  //     phone_no_no: loginMethod === 'phone_no' ? data.identifier : '',
  //   });
  // };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Logo placeholder */}
      <View style={styles.logoCircle}>
        <View style={styles.logoBar} />
      </View>

      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>Log in to manage your rod orders</Text>

      {/* show API error on screen */}
      {isError && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{isError}</Text>
        </View>
      )}

      {/* Method toggle: phone_no / Email */}
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            loginMethod === "phone_no" && styles.toggleButtonActive,
          ]}
          onPress={() => switchMethod("phone_no")}
        >
          <Text
            style={[
              styles.toggleText,
              loginMethod === "phone_no" && styles.toggleTextActive,
            ]}
          >
            Phone
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            loginMethod === "email" && styles.toggleButtonActive,
          ]}
          onPress={() => switchMethod("email")}
        >
          <Text
            style={[
              styles.toggleText,
              loginMethod === "email" && styles.toggleTextActive,
            ]}
          >
            Email
          </Text>
        </TouchableOpacity>
      </View>

      {/* Identifier field - phone_no or email depending on toggle */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          {loginMethod === "phone_no" ? "Phone Number" : "Email"}
        </Text>
        <TextInput
          placeholder={
            loginMethod === "phone_no" ? "98765 xxxxx" : "you@example.com"
          }
          style={styles.input}
          value={data.identifier}
          onChangeText={(text) => handleChange("identifier", text)}
          keyboardType={
            loginMethod === "phone_no" ? "phone-pad" : "email-address"
          }
          autoCapitalize="none"
        />
      </View>

      {/* Password */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder="Enter password"
          style={styles.input}
          value={data.password}
          onChangeText={(text) => handleChange("password", text)}
          secureTextEntry
          autoCapitalize="none"
        />
      </View>

      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Forgot password?</Text>
      </TouchableOpacity>

      {/* Log in */}
      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Log in</Text>
        )}
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* OTP login  only really makes sense for phone_no, but works either way */}
      {/* <TouchableOpacity style={styles.otpButton} onPress={handleOtpLogin}>
        <Text style={styles.otpButtonText}>Log in with OTP</Text>
      </TouchableOpacity> */}

      <View style={styles.signupRow}>
        <Text style={styles.signupText}>New here? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.signupLink}>Create account</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6F8",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 40,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: "#E4EEF9",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  logoBar: {
    width: 40,
    height: 12,
    borderRadius: 3,
    backgroundColor: "#1E3A5F",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1E1E1E",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 28,
  },

  errorBox: {
    backgroundColor: "#FBE6E6",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  errorText: { color: "#D64545", fontSize: 14, textAlign: "center" },
  toggleRow: {
    flexDirection: "row",
    backgroundColor: "#E9EAEC",
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 9,
    alignItems: "center",
  },
  toggleButtonActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9CA3AF",
  },
  toggleTextActive: {
    color: "#1E1E1E",
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
  forgotPassword: {
    textAlign: "right",
    color: "#1E4D8C",
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 24,
  },
  button: {
    height: 58,
    backgroundColor: "#F2994A",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#DADDE2",
  },
  dividerText: {
    marginHorizontal: 12,
    color: "#9CA3AF",
    fontSize: 14,
  },
  otpButton: {
    height: 58,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DADDE2",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  otpButtonText: {
    color: "#1E1E1E",
    fontSize: 17,
    fontWeight: "700",
  },
  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 28,
  },
  signupText: {
    color: "#6B7280",
    fontSize: 14,
  },
  signupLink: {
    color: "#1E4D8C",
    fontWeight: "700",
    fontSize: 14,
  },
});
