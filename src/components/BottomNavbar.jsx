import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "../theme/theme";

const TAB_META = {
  Home: { label: "Home", iconActive: "home", iconInactive: "home-outline" },
  Orders: {
    label: "Orders",
    iconActive: "receipt",
    iconInactive: "receipt-outline",
  },
  TruckTracking: {
    label: "Trucks",
    iconActive: "car",
    iconInactive: "car-outline",
  },
  Profile: {
    label: "Profile",
    iconActive: "person",
    iconInactive: "person-outline",
  },
};

function BottomNavbar({ state, descriptors, navigation }) {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const meta = TAB_META[route.name];
        if (!meta) return null; 
 
        const isActive = state.index === index;
        const { options } = descriptors[route.key];
 
        const handlePress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
 
          if (!isActive && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };
 
        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tab}
            activeOpacity={0.7}
            onPress={handlePress}
            accessibilityRole="button"
            accessibilityState={isActive ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel || meta.label}
          >
            <Ionicons
              name={isActive ? meta.iconActive : meta.iconInactive}
              size={24}
              color={isActive ? colors.primary : colors.textMuted}
            />
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {meta.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
 

export default BottomNavbar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  label: {
    fontSize: 12,
    color: colors.textMuted,
  },
  labelActive: {
    color: colors.primary,
    fontWeight: "700",
  },
});
 