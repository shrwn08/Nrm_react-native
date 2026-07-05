import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

function Login() {

  const navigation = useNavigation();

  // 'phone' or 'email' — controls which keyboard/placeholder we show
  // and which field name we send to the backend
  const [loginMethod, setLoginMethod] = useState('phone');

  const [data, setData] = useState({
    identifier: '', // holds either the phone number or the email
    password: '',
  });

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  // Switching methods clears the field so a half-typed phone number
  // doesn't get submitted as an email, or vice versa
  const switchMethod = (method) => {
    setLoginMethod(method);
    handleChange('identifier', '');
  };

  const handleLogin = () => {
    if (!data.identifier.trim()) {
      alert(`Please enter your ${loginMethod === 'phone' ? 'phone number' : 'email'}`);
      return;
    }
    if (!data.password) {
      alert('Please enter your password');
      return;
    }

    // Send { [loginMethod]: data.identifier, password: data.password }
    // to your /login endpoint — backend can branch on which key is present
    console.log('Logging in with', loginMethod, data.identifier);
  };

  // const handleOtpLogin = () => {
  //   // Reuse the same OTP screen from registration —
  //   // pass phone_no only if we're currently in phone mode
  //   navigation.navigate("Otp", {
  //     phone_no: loginMethod === 'phone' ? data.identifier : '',
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

      {/* Method toggle: Phone / Email */}
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleButton, loginMethod === 'phone' && styles.toggleButtonActive]}
          onPress={() => switchMethod('phone')}
        >
          <Text style={[styles.toggleText, loginMethod === 'phone' && styles.toggleTextActive]}>
            Phone
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, loginMethod === 'email' && styles.toggleButtonActive]}
          onPress={() => switchMethod('email')}
        >
          <Text style={[styles.toggleText, loginMethod === 'email' && styles.toggleTextActive]}>
            Email
          </Text>
        </TouchableOpacity>
      </View>

      {/* Identifier field - phone or email depending on toggle */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          {loginMethod === 'phone' ? 'Phone number' : 'Email'}
        </Text>
        <TextInput
          placeholder={loginMethod === 'phone' ? '98765 43210' : 'you@example.com'}
          style={styles.input}
          value={data.identifier}
          onChangeText={(text) => handleChange('identifier', text)}
          keyboardType={loginMethod === 'phone' ? 'phone-pad' : 'email-address'}
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
          onChangeText={(text) => handleChange('password', text)}
          secureTextEntry
          autoCapitalize="none"
        />
      </View>

      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Forgot password?</Text>
      </TouchableOpacity>

      {/* Log in */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log in</Text>
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* OTP login  only really makes sense for phone, but works either way */}
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