import React, { useCallback } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAddresses, deleteAddress } from '../../redux/features/addressSlice'
import { colors, radius, spacing, typography } from "../../theme/theme"

function PartyCard({ item, onDelete, isDeleting }) {
  const name = item.party || item.label || 'Saved address';

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <Text style={styles.partyName} numberOfLines={1}>{name}</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(item)}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <ActivityIndicator size="small" color={colors.danger} />
          ) : (
            <Ionicons name="trash-outline" size={18} color={colors.danger} />
          )}
        </TouchableOpacity>
      </View>
      <Text style={styles.addressLine} numberOfLines={2}>{item.addressLine}</Text>
      <Text style={styles.addressMeta}>
        {item.city}, {item.district}, {item.state} - {item.pincode}
      </Text>
    </View>
  );
}

function SavedParties() {
  const dispatch = useDispatch();
  const { addresses, isLoadingAddresses, addressesError, isDeletingAddress } = useSelector(
    (state) => state.address,
  );
  const [deletingId, setDeletingId] = React.useState(null);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchAddresses());
    }, [dispatch]),
  );

  const handleDelete = (item) => {
    const name = item.party || item.label || 'this address';
    Alert.alert('Delete saved party', `Remove ${name} from your saved parties?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setDeletingId(item._id);
          const result = await dispatch(deleteAddress(item._id));
          setDeletingId(null);
          if (deleteAddress.rejected.match(result)) {
            Alert.alert('Could not delete', result.payload || 'Please try again.');
          }
        },
      },
    ]);
  };

  const handleRetry = () => dispatch(fetchAddresses());

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved parties</Text>

      {isLoadingAddresses && addresses.length === 0 ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : addressesError && addresses.length === 0 ? (
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>{addressesError}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : addresses.length === 0 ? (
        <View style={styles.centerContent}>
          <Text style={styles.emptyTitle}>No saved parties yet</Text>
          <Text style={styles.emptySubtitle}>
            Parties you save while adding a shipping address will show up here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={addresses}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <PartyCard
              item={item}
              onDelete={handleDelete}
              isDeleting={isDeletingAddress && deletingId === item._id}
            />
          )}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    ...typography.h1,
    padding: spacing.md,
    paddingBottom: spacing.sm,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    ...typography.h2,
    marginBottom: spacing.xs + 2,
  },
  emptySubtitle: {
    ...typography.body,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  errorText: {
    ...typography.body,
    fontSize: 14,
    color: colors.danger,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  retryButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
  },
  retryButtonText: {
    ...typography.button,
    color: colors.card,
    fontSize: 14,
  },
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm + 6,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  partyName: {
    ...typography.h2,
    fontSize: 16,
    flex: 1,
    marginRight: spacing.md,
  },
  deleteButton: {
    padding: spacing.xs,
  },
  addressLine: {
    ...typography.body,
    fontSize: 14,
    marginBottom: 2,
  },
  addressMeta: {
    ...typography.caption,
  },
});

export default SavedParties