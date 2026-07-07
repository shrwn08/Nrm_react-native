import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "../theme/theme";



const TABS = [
  {
    key: "Home",
    label: "Home",
    routeName: "Home",
    iconActive: "home",
    iconInactive: "home-outline",
  },
  {
    key: "Orders",
    label: "Orders",
    routeName: "Orders",
    iconActive: "receipt",
    iconInactive: "receipt-outline",
  },
  {
    key: "Trucks",
    label: "Trucks",
    routeName: "TruckTracking",
    iconActive: "car",
    iconInactive: "car-outline",
  },
  {
    key: "Profile",
    label: "Profile",
    routeName: "Profile",
    iconActive: "person",
    iconInactive: "person-outline",
  },
];

function BottomNavbar({ activeTab }) {
  const navigation = useNavigation();
  const route = useRoute();

  const currentTab =
    activeTab || TABS.find((tab) => tab.routeName === route.name)?.key;

  const handlePress = (tab) => {
    if (tab.key === currentTab) return;
    navigation.navigate(tab.routeName);
  };

  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isActive = tab.key === currentTab;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            activeOpacity={0.7}
            onPress={() => handlePress(tab)}
          >
            <Ionicons
              name={isActive ? tab.iconActive : tab.iconInactive}
              size={24}
              color={isActive ? colors.primary : colors.textMuted}
            />
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
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
