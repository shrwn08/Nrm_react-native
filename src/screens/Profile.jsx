import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import * as SecureStore from 'expo-secure-store'
import { logout } from '../redux/features/authSlice'
import { colors, radius, spacing, typography } from '../theme/theme'
import ChangePassword from './profile/ChangePassword'

const MENU_ITEMS = [
  { label: 'Edit profile', icon: 'person-outline', screen: 'EditProfile' },
  { label: 'Change password', icon: 'lock-closed-outline', screen: 'ChangePassword' },
  { label: 'Notifications', icon: 'notifications-outline', screen: 'Notifications' },
  { label: 'Saved parties', icon: 'bookmark-outline', screen: 'SavedParties' },
  { label: 'Linked trucks', icon: 'car-outline', screen: 'LinkedTrucks' },
  { label: 'Help & support', icon: 'help-circle-outline', screen: 'HelpSupport' },
  { label: 'Settings', icon: 'settings-outline', screen: 'Settings' },
];

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  const initials = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() || '');
  return initials.join('') || '?';
}

function Profile() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          await SecureStore.deleteItemAsync('accessToken');
          dispatch(logout());
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(user?.fullname)}</Text>
        </View>
        <Text style={styles.name} numberOfLines={1}>
          {user?.fullname || 'Your account'}
        </Text>
        {user?.company_name ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {user.company_name}
          </Text>
        ) : null}
        {user?.phone_no ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {user.phone_no}
          </Text>
        ) : null}
      </View>

      <View style={styles.menu}>
        {MENU_ITEMS.map((item, index) => (
          <TouchableOpacity
            key={item.screen}
            style={[
              styles.menuItem,
              index === MENU_ITEMS.length - 1 && styles.menuItemLast,
            ]}
            onPress={() => navigation.navigate(item.screen)}
          >
            <View style={styles.menuItemLeft}>
              <View style={styles.menuIconWrap}>
                <Ionicons name={item.icon} size={20} color={colors.primary} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color={colors.danger} />
        <Text style={styles.logoutText}>Log out</Text>
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
    paddingBottom: spacing.xl,
  },
  header: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  avatarText: {
    ...typography.h2,
    color: colors.primary,
  },
  name: {
    ...typography.h2,
    marginBottom: 2,
  },
  subtitle: {
    ...typography.label,
  },
  menu: {
    backgroundColor: colors.card,
    marginHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    ...typography.body,
    fontSize: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.lg,
    marginHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  logoutText: {
    ...typography.button,
    fontSize: 15,
    color: colors.danger,
  },
});

export default Profile