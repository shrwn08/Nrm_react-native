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
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { updateProfile, clearUpdateProfileError } from '../../redux/features/authSlice'
import { colors, radius, spacing, typography } from "../../theme/theme"

function EditProfile() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user, isUpdatingProfile, updateProfileError } = useSelector((state) => state.auth);

  // Only fullname and city are actually editable - email, phone, and
  // company name are set at registration and the server ignores changes
  // to them here (see PATCH /api/me on the backend).
  const [fullname, setFullname] = useState(user?.fullname || '');
  const [city, setCity] = useState(user?.city || '');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = {};
    if (!fullname.trim()) nextErrors.fullname = 'Name is required';
    if (!city.trim()) nextErrors.city = 'City is required';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    if (updateProfileError) {
      dispatch(clearUpdateProfileError());
    }

    const result = await dispatch(
      updateProfile({ fullname: fullname.trim(), city: city.trim() }),
    );

    if (updateProfile.fulfilled.match(result)) {
      Alert.alert('Profile updated', 'Your changes have been saved.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } else {
      Alert.alert('Could not save changes', result.payload || 'Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Edit profile</Text>

      <Text style={styles.label}>Full name</Text>
      <TextInput
        style={styles.input}
        placeholder="Your full name"
        placeholderTextColor={colors.textMuted}
        value={fullname}
        onChangeText={setFullname}
      />
      {errors.fullname ? <Text style={styles.errorText}>{errors.fullname}</Text> : null}

      <Text style={styles.label}>City</Text>
      <TextInput
        style={styles.input}
        placeholder="Your city"
        placeholderTextColor={colors.textMuted}
        value={city}
        onChangeText={setCity}
      />
      {errors.city ? <Text style={styles.errorText}>{errors.city}</Text> : null}

      <Text style={styles.sectionLabel}>Account details</Text>
      <View style={styles.readonlyCard}>
        <View style={styles.readonlyRow}>
          <Text style={styles.readonlyLabel}>Email</Text>
          <Text style={styles.readonlyValue} numberOfLines={1}>{user?.email || '-'}</Text>
        </View>
        <View style={[styles.readonlyRow, styles.readonlyRowLast]}>
          <Text style={styles.readonlyLabel}>Phone</Text>
          <Text style={styles.readonlyValue}>{user?.phone_no || '-'}</Text>
        </View>
      </View>
      <Text style={styles.hint}>
        Email and phone number can't be changed here - contact support if you
        need to update either of these.
      </Text>

      <TouchableOpacity
        style={[styles.saveButton, isUpdatingProfile && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={isUpdatingProfile}
      >
        {isUpdatingProfile ? (
          <ActivityIndicator color={colors.card} />
        ) : (
          <Text style={styles.saveButtonText}>Save changes</Text>
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
  errorText: {
    fontSize: 13,
    color: colors.danger,
    marginTop: -12,
    marginBottom: spacing.md,
  },
  sectionLabel: {
    ...typography.label,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  readonlyCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  readonlyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  readonlyRowLast: {
    borderBottomWidth: 0,
  },
  readonlyLabel: {
    ...typography.body,
    fontSize: 15,
    color: colors.textSecondary,
  },
  readonlyValue: {
    ...typography.body,
    fontSize: 15,
    fontWeight: '600',
    flexShrink: 1,
    textAlign: 'right',
  },
  hint: {
    ...typography.caption,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  saveButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    ...typography.button,
    color: colors.card,
  },
});

export default EditProfile