import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { colors, radius, spacing, typography } from "../theme/theme";
import {
  forgotPassword,
  resetPassword,
  clearForgotPasswordState,
  clearResetPasswordError,
} from "../redux/features/authSlice";

function ForgotPassword() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {
    isForgotPasswordLoading,
    forgotPasswordError,
    forgotPasswordMessage,
    isResetPasswordLoading,
    resetPasswordError,
  } = useSelector((state) => state.auth);

  // 'request' -> enter phone/email, 'reset' -> enter code + new password
  const [step, setStep] = useState("request");
  const [method, setMethod] = useState("phone_no");
  const [identifier, setIdentifier] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const buildIdentifierPayload = () =>
    method === "phone_no"
      ? { phone_no: identifier.trim() }
      : { email: identifier.trim() };

  const handleSendCode = async () => {
    const nextErrors = {};
    if (!identifier.trim()) {
      nextErrors.identifier = `Enter your registered ${
        method === "phone_no" ? "phone number" : "email"
      }`;
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const result = await dispatch(forgotPassword(buildIdentifierPayload()));
    if (forgotPassword.fulfilled.match(result)) {
      setStep("reset");
    }
  };

  const handleResetPassword = async () => {
    const nextErrors = {};
    if (!code.trim()) nextErrors.code = "Enter the code you received";
    if (!newPassword || newPassword.length < 6)
      nextErrors.newPassword = "New password must be at least 6 characters";
    if (newPassword !== confirmPassword)
      nextErrors.confirmPassword = "Passwords do not match";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const result = await dispatch(
      resetPassword({
        ...buildIdentifierPayload(),
        code: code.trim(),
        newPassword,
      }),
    );

    if (resetPassword.fulfilled.match(result)) {
      dispatch(clearForgotPasswordState());
      navigation.navigate("Login");
    }
  };

  const goBack = () => {
    if (step === "reset") {
      setStep("request");
      dispatch(clearResetPasswordError());
      return;
    }
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} hitSlop={10}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reset password</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {step === "request" ? (
          <>
            <Text style={styles.subtitle}>
              Enter the phone number or email linked to your account and we'll
              send you a reset code.
            </Text>

            {forgotPasswordError ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorBoxText}>{forgotPasswordError}</Text>
              </View>
            ) : null}

            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  method === "phone_no" && styles.toggleButtonActive,
                ]}
                onPress={() => {
                  setMethod("phone_no");
                  setIdentifier("");
                }}
              >
                <Text
                  style={[
                    styles.toggleText,
                    method === "phone_no" && styles.toggleTextActive,
                  ]}
                >
                  Phone
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  method === "email" && styles.toggleButtonActive,
                ]}
                onPress={() => {
                  setMethod("email");
                  setIdentifier("");
                }}
              >
                <Text
                  style={[
                    styles.toggleText,
                    method === "email" && styles.toggleTextActive,
                  ]}
                >
                  Email
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>
              {method === "phone_no" ? "Phone number" : "Email"}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={
                method === "phone_no" ? "98765 xxxxx" : "you@example.com"
              }
              placeholderTextColor={colors.textMuted}
              value={identifier}
              onChangeText={setIdentifier}
              keyboardType={
                method === "phone_no" ? "phone-pad" : "email-address"
              }
              autoCapitalize="none"
            />
            {errors.identifier ? (
              <Text style={styles.fieldError}>{errors.identifier}</Text>
            ) : null}

            <TouchableOpacity
              style={[
                styles.button,
                isForgotPasswordLoading && styles.buttonDisabled,
              ]}
              onPress={handleSendCode}
              disabled={isForgotPasswordLoading}
            >
              {isForgotPasswordLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Send reset code</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.subtitle}>
              {forgotPasswordMessage ||
                `Enter the code sent to your ${method === "phone_no" ? "phone" : "email"} along with your new password.`}
            </Text>

            {resetPasswordError ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorBoxText}>{resetPasswordError}</Text>
              </View>
            ) : null}

            <Text style={styles.label}>Reset code</Text>
            <TextInput
              style={styles.input}
              placeholder="6-digit code"
              placeholderTextColor={colors.textMuted}
              value={code}
              onChangeText={(v) => setCode(v.replace(/[^0-9]/g, ""))}
              keyboardType="number-pad"
              maxLength={6}
            />
            {errors.code ? (
              <Text style={styles.fieldError}>{errors.code}</Text>
            ) : null}

            <Text style={styles.label}>New password</Text>
            <TextInput
              style={styles.input}
              placeholder="At least 6 characters"
              placeholderTextColor={colors.textMuted}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              autoCapitalize="none"
            />
            {errors.newPassword ? (
              <Text style={styles.fieldError}>{errors.newPassword}</Text>
            ) : null}

            <Text style={styles.label}>Confirm new password</Text>
            <TextInput
              style={styles.input}
              placeholder="Re-enter new password"
              placeholderTextColor={colors.textMuted}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
            />
            {errors.confirmPassword ? (
              <Text style={styles.fieldError}>{errors.confirmPassword}</Text>
            ) : null}

            <TouchableOpacity
              style={[
                styles.button,
                isResetPasswordLoading && styles.buttonDisabled,
              ]}
              onPress={handleResetPassword}
              disabled={isResetPasswordLoading}
            >
              {isResetPasswordLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Reset password</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resendLink}
              onPress={handleSendCode}
              disabled={isForgotPasswordLoading}
            >
              <Text style={styles.resendLinkText}>
                Didn't get a code? Resend
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default ForgotPassword;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: { ...typography.h2 },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  subtitle: { ...typography.caption, marginBottom: spacing.md, lineHeight: 19 },
  errorBox: {
    backgroundColor: colors.danger + "1A",
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  errorBoxText: { color: colors.danger, fontSize: 14, textAlign: "center" },
  toggleRow: {
    flexDirection: "row",
    backgroundColor: colors.border,
    borderRadius: radius.md,
    padding: 4,
    marginBottom: spacing.md,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.sm,
    alignItems: "center",
  },
  toggleButtonActive: {
    backgroundColor: colors.card,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: { fontSize: 14, fontWeight: "600", color: colors.textMuted },
  toggleTextActive: { color: colors.textPrimary },
  label: {
    ...typography.label,
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  input: {
    height: 52,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    color: colors.textPrimary,
  },
  fieldError: { color: colors.danger, fontSize: 12, marginTop: 4 },
  button: {
    height: 56,
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.lg,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  resendLink: { alignItems: "center", marginTop: spacing.lg },
  resendLinkText: { color: colors.primary, fontWeight: "600", fontSize: 14 },
});
