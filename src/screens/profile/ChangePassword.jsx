import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { changePassword, clearChangePasswordError } from '../../redux/features/authSlice'
import { colors, radius, spacing, typography } from "../../theme/theme"

function ChangePassword() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { isChangingPassword, changePasswordError } = useSelector((state) => state.auth);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = {};
    if (!currentPassword) nextErrors.currentPassword = 'Enter your current password';
    if (!newPassword) {
      nextErrors.newPassword = 'Enter a new password';
    } else if (newPassword.length < 6) {
      nextErrors.newPassword = 'Password must be at least 6 characters';
    }
    if (confirmPassword !== newPassword) {
      nextErrors.confirmPassword = "Passwords don't match";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    if (changePasswordError) {
      dispatch(clearChangePasswordError());
    }

    const result = await dispatch(
      changePassword({ currentPassword, newPassword }),
    );

    if (changePassword.fulfilled.match(result)) {
      Alert.alert('Password changed', 'Your password has been updated.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } else {
      Alert.alert('Could not change password', result.payload || 'Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Change password</Text>

      <Text style={styles.label}>Current password</Text>
      <View style={styles.inputWrap}>
        <TextInput
          style={styles.input}
          placeholder="Enter current password"
          placeholderTextColor={colors.textMuted}
          secureTextEntry={!showCurrent}
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
        <TouchableOpacity style={styles.eyeButton} onPress={() => setShowCurrent((v) => !v)}>
          <Ionicons
            name={showCurrent ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color={colors.textMuted}
          />
        </TouchableOpacity>
      </View>
      {errors.currentPassword ? (
        <Text style={styles.errorText}>{errors.currentPassword}</Text>
      ) : null}

      <Text style={styles.label}>New password</Text>
      <View style={styles.inputWrap}>
        <TextInput
          style={styles.input}
          placeholder="At least 6 characters"
          placeholderTextColor={colors.textMuted}
          secureTextEntry={!showNew}
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TouchableOpacity style={styles.eyeButton} onPress={() => setShowNew((v) => !v)}>
          <Ionicons
            name={showNew ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color={colors.textMuted}
          />
        </TouchableOpacity>
      </View>
      {errors.newPassword ? <Text style={styles.errorText}>{errors.newPassword}</Text> : null}

      <Text style={styles.label}>Confirm new password</Text>
      <TextInput
        style={styles.plainInput}
        placeholder="Re-enter new password"
        placeholderTextColor={colors.textMuted}
        secureTextEntry={!showNew}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      {errors.confirmPassword ? (
        <Text style={styles.errorText}>{errors.confirmPassword}</Text>
      ) : null}

      <TouchableOpacity
        style={[styles.saveButton, isChangingPassword && styles.saveButtonDisabled]}
        onPress={handleSubmit}
        disabled={isChangingPassword}
      >
        {isChangingPassword ? (
          <ActivityIndicator color={colors.card} />
        ) : (
          <Text style={styles.saveButtonText}>Update password</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.label,
    marginBottom: spacing.xs,
    marginTop: spacing.xs,
  },
  input: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: 15,
    color: colors.textPrimary,
  },
  plainInput: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    marginBottom: spacing.md,
  },
  eyeButton: {
    paddingHorizontal: spacing.sm + 2,
  },
  errorText: {
    fontSize: 13,
    color: colors.danger,
    marginTop: -12,
    marginBottom: spacing.md,
  },
  saveButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    ...typography.button,
    color: colors.card,
  },
});

export default ChangePassword