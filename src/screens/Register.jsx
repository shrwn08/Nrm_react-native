import React from "react";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

// name (string), not by passing the component directly

function Register() {

  const navigation = useNavigation();

  const [data, setData] = useState({
    fullname: '',
    email: '',
    phone_no: '',
    password: '',
    company_name: '',
    city: ''
  });

  // Controls whether the password field masks its text or shows it plainly
  const [showPassword, setShowPassword] = useState(false);

  
  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOnPress = () => {
    // We pass phone_no along so the OTP screen can pre-fill it -
    // the user will still be able to edit it there for verification.
    navigation.navigate("Otp", { phone_no: data.phone_no, email: data.email });
  };

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
          value={data.fullname}
          onChangeText={(text) => handleChange('fullname', text)}
        />
      </View>

      {/* Email */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="abc@gmail.com"
          keyboardType="email-address"
          style={styles.input}
          value={data.email}
          onChangeText={(text) => handleChange('email', text)}
          autoCapitalize="none"
        />
      </View>

      {/* Phone Number */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          placeholder="+91 98765XXXXX"
          keyboardType="phone-pad"
          style={styles.input}
          value={data.phone_no}
          onChangeText={(text) => handleChange('phone_no', text)}
        />
      </View>

      {/* Password - with show/hide toggle */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordWrapper}>
          <TextInput
            placeholder="Create a password"
            style={styles.passwordInput}
            value={data.password}
            onChangeText={(text) => handleChange('password', text)}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword((prev) => !prev)}
            // Bigger tap target than the text itself, so it's easy to hit
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.eyeText}>{showPassword ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Company Name */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Firm / Company Name</Text>
        <TextInput
          placeholder="Enter company name"
          style={styles.input}
          value={data.company_name}
          onChangeText={(text) => handleChange('company_name', text)}
        />
      </View>

      {/* City */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>City</Text>
        <TextInput
          placeholder="Enter your city"
          style={styles.input}
          value={data.city}
          onChangeText={(text) => handleChange('city', text)}
        />
      </View>

      {/* Create Account Button */}
      <TouchableOpacity style={styles.button} onPress={handleOnPress}>
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
    overflow: "hidden"
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
  // Wraps the password TextInput + the Show/Hide button so the button
  // can sit inside the same bordered box, on the right side
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 55,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DADDE2",
    borderRadius: 12,
    paddingRight: 15,
  },
  passwordInput: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 15,
    fontSize: 16,
  },
  eyeButton: {
    paddingLeft: 10,
  },
  eyeText: {
    color: "#1E4D8C",
    fontWeight: "600",
    fontSize: 14,
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