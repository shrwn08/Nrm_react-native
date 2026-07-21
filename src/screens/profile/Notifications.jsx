import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors, radius, spacing, typography } from "../../theme/theme"

// Placeholder until real-time delivery (websocket / push) is wired up.
// Once that exists, this becomes a live feed instead of a static screen.
function Notifications() {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name="notifications-outline" size={40} color={colors.primary} />
      </View>
      <Text style={styles.title}>Notifications</Text>
      <Text style={styles.subtitle}>Coming soon</Text>
      <Text style={styles.description}>
        Real-time order and dispatch alerts will show up here once live
        notifications are ready.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.label,
    color: colors.primary,
    fontWeight: "700",
    marginBottom: spacing.md,
  },
  description: {
    ...typography.body,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
  },
});

export default Notifications