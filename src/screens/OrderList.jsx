import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../redux/features/orderSlice";
import { colors, radius, spacing, typography } from "../theme/theme";
import StatusPills from "../components/StatusPills"

// Matches the "status" enum in the server's order model exactly -
// keep these two in sync if the schema ever changes.
const FILTERS = [
  { label: "All", value: null },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Dispatched", value: "dispatched" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function OrderCard({ order }) {
  const totalQuantity = (order.rodLines || []).reduce(
    (sum, line) => sum + (line.quantity || 0),
    0,
  );

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.partyName} numberOfLines={1}>
          {order.party}
        </Text>
        <StatusPills status={order.status} />
      </View>

      <Text style={styles.rodType}>{order.rodType}</Text>

      <View style={styles.linesWrap}>
        {(order.rodLines || []).map((line, index) => (
          <View style={styles.lineChip} key={`${order._id}-${line.diameter}-${index}`}>
            <Text style={styles.lineChipText}>
              {line.diameter} · {line.quantity}t
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.divider} />

      <View style={styles.metaRow}>
        <Text style={styles.metaLabel}>Total</Text>
        <Text style={styles.metaValue}>{totalQuantity} tons</Text>
      </View>

      {order.truck?.number ? (
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Truck</Text>
          <Text style={styles.metaValue}>{order.truck.number}</Text>
        </View>
      ) : null}

      {order.shippingAddress ? (
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Ship to</Text>
          <Text style={styles.metaValue} numberOfLines={1}>
            {order.shippingAddress.city}, {order.shippingAddress.state}
          </Text>
        </View>
      ) : null}

      <View style={styles.metaRow}>
        <Text style={styles.metaLabel}>Placed</Text>
        <Text style={styles.metaValue}>{formatDate(order.createdAt)}</Text>
      </View>
    </View>
  );
}

function OrderList() {
  const dispatch = useDispatch();
  const { orders, isLoadingOrders, ordersError } = useSelector(
    (state) => state.order,
  );

  const [activeFilter, setActiveFilter] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchOrders(activeFilter || undefined));
    }, [dispatch, activeFilter]),
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await dispatch(fetchOrders(activeFilter || undefined));
    setIsRefreshing(false);
  };

  const handleRetry = () => {
    dispatch(fetchOrders(activeFilter || undefined));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Orders</Text>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={FILTERS}
        keyExtractor={(item) => item.label}
        contentContainerStyle={styles.filterRow}
        renderItem={({ item }) => {
          const selected = activeFilter === item.value;
          return (
            <TouchableOpacity
              style={[styles.filterChip, selected && styles.filterChipSelected]}
              onPress={() => setActiveFilter(item.value)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selected && styles.filterChipTextSelected,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      {isLoadingOrders && orders.length === 0 ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : ordersError && orders.length === 0 ? (
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>{ordersError}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.centerContent}>
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptySubtitle}>
            {activeFilter
              ? `You don't have any ${activeFilter} orders.`
              : "Orders you place will show up here."}
          </Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => <OrderCard order={item} />}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    ...typography.h1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    marginBottom: spacing.sm,
  },
  filterRow: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },
  filterChip: {
    height : 35,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
  },
  filterChipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  filterChipText: {
    ...typography.label,
    fontWeight: "600",
  },
  filterChipTextSelected: {
    color: colors.primary,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl + spacing.sm,
  },
  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
    textAlign: "center",
  },
  errorText: {
    ...typography.body,
    fontSize: 14,
    color: colors.danger,
    textAlign: "center",
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
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.xs,
  },
  partyName: {
    ...typography.h2,
    fontSize: 16,
    flex: 1,
    marginRight: spacing.md,
  },
  rodType: {
    ...typography.label,
    marginBottom: spacing.sm + 2,
  },
  linesWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs + 4,
    marginBottom: spacing.sm + 2,
  },
  lineChip: {
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 2,
  },
  lineChipText: {
    ...typography.label,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.background,
    marginBottom: spacing.sm,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  metaLabel: {
    ...typography.label,
  },
  metaValue: {
    ...typography.label,
    fontWeight: "600",
    color: colors.textPrimary,
  },
});

export default OrderList;