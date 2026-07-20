import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, radius, spacing, typography } from "../theme/theme";

export const STATUS_META = {
  pending: {
    label: "Pending",
    color: colors.warning,
    background: colors.warningLight,
  },
  confirmed: {
    label: "Confirmed",
    color: colors.info,
    background: colors.infoLight,
  },
  dispatched: {
    label: "Dispatched",
    color: colors.primary,
    background: colors.primaryLight,
  },
  delivered: {
    label: "Delivered",
    color: colors.success,
    background: colors.successLight,
  },
  cancelled: {
    label: "Cancelled",
    color: colors.danger,
    background: colors.danger + "1A",
  },
};

function StatusPill({ status, size = "medium" }) {
  const meta = STATUS_META[status] || STATUS_META.pending;
  const isSmall = size === "small";

  return (
    <View
      style={[
        styles.pill,
        { backgroundColor: meta.background },
        isSmall && styles.pillSmall,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: meta.color },
          isSmall && styles.textSmall,
        ]}
      >
        {meta.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    alignSelf: "flex-start",
  },
  pillSmall: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 5,
  },
  text: {
    ...typography.caption,
    fontWeight: "700",
  },
  textSmall: {
    fontSize: 11,
  },
});

export default StatusPill;
