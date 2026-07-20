import React, { useState } from 'react'
import { View, Text, Switch, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { colors, radius, spacing, typography } from "../../theme/theme"

// Note: these two toggles are local-only for now - there's no server
// endpoint yet to persist notification preferences, so flipping them
// doesn't change what the backend actually sends. Wire this up once
// that API exists.
function Settings() {
  const navigation = useNavigation();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);

  const handleLegalLink = (title) => {
    Alert.alert(title, 'This will open once the page is ready.');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete account',
      'Account deletion isn\'t available in the app yet - please contact support and we\'ll take care of it.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Contact support', onPress: () => navigation.navigate('HelpSupport') },
      ],
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings</Text>

      <Text style={styles.sectionLabel}>Preferences</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Text style={styles.rowLabel}>Push notifications</Text>
            <Text style={styles.rowHint}>Order updates and alerts on this device</Text>
          </View>
          <Switch
            value={pushEnabled}
            onValueChange={setPushEnabled}
            trackColor={{ false: colors.toggleOff, true: colors.toggleOn }}
          />
        </View>
        <View style={[styles.row, styles.rowLast]}>
          <View style={styles.rowLeft}>
            <Text style={styles.rowLabel}>SMS order alerts</Text>
            <Text style={styles.rowHint}>Text messages for dispatch and delivery</Text>
          </View>
          <Switch
            value={smsEnabled}
            onValueChange={setSmsEnabled}
            trackColor={{ false: colors.toggleOff, true: colors.toggleOn }}
          />
        </View>
      </View>

      <Text style={styles.sectionLabel}>About</Text>
      <View style={styles.card}>
        <TouchableOpacity style={styles.row} onPress={() => handleLegalLink('Terms of service')}>
          <Text style={styles.rowLabel}>Terms of service</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.row} onPress={() => handleLegalLink('Privacy policy')}>
          <Text style={styles.rowLabel}>Privacy policy</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>
        <View style={[styles.row, styles.rowLast]}>
          <Text style={styles.rowLabel}>App version</Text>
          <Text style={styles.rowValue}>1.0.0</Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>Account</Text>
      <View style={styles.card}>
        <TouchableOpacity style={[styles.row, styles.rowLast]} onPress={handleDeleteAccount}>
          <Text style={[styles.rowLabel, styles.dangerText]}>Delete account</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.danger} />
        </TouchableOpacity>
      </View>
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
  sectionLabel: {
    ...typography.label,
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowLeft: {
    flex: 1,
    marginRight: spacing.md,
  },
  rowLabel: {
    ...typography.body,
    fontSize: 15,
  },
  rowHint: {
    ...typography.caption,
    marginTop: 2,
  },
  rowValue: {
    ...typography.label,
  },
  dangerText: {
    color: colors.danger,
  },
});

export default Settings