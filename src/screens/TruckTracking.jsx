import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors, radius, spacing, typography } from "../theme/theme"

function TruckTracking() {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name="navigate-outline" size={40} color={colors.primary} />
      </View>
      <Text style={styles.title}>Truck tracking</Text>
      <Text style={styles.subtitle}>Coming soon</Text>
      <Text style={styles.description}>
        Live truck locations and delivery status will show up here once this
        feature is ready.
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

export default TruckTracking