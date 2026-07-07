import React, { useState } from 'react';
import {
  
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { SafeAreaProvider } from "react-native-safe-area-context";

// Static option lists — we can later pull these from a config/API
const COMPANIES = ['Jindal', 'Rathi'];
const DIAMETERS = ['8mm', '12mm', '16mm', '20mm', '24mm'];

function NewRodOrder() {
  // Form state — each piece of the form gets its own state slice so we
  // can update fields independently without touching the rest of the form
  const [partyName, setPartyName] = useState('');
  const [company, setCompany] = useState('Jindal');
  const [diameter, setDiameter] = useState('12mm');

  // NOTE: the mockup shows two "Tons" boxes side by side. It wasn't clear
  // from the design what the second one represents (a second diameter's
  // quantity, a min/max range, etc.), so for now these are two independent
  // quantity fields. Easy to rename/repurpose once we know the intent.
  const [quantityPrimary, setQuantityPrimary] = useState('');
  const [quantitySecondary, setQuantitySecondary] = useState('');

  const [truckNumber, setTruckNumber] = useState('');
  const [driverInfo, setDriverInfo] = useState('');
  const [loadingInstructions, setLoadingInstructions] = useState('');

  const handlePlaceOrder = () => {
    // Wire this up to our order-submission logic (API call / local store)
    console.log({
      partyName,
      company,
      diameter,
      quantityPrimary,
      quantitySecondary,
      truckNumber,
      driverInfo,
      loadingInstructions,
    });
  };

  return (
    <SafeAreaProvider style={styles.container}>
      {/* ScrollView so the form doesn't get clipped on smaller screens */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>New rod order</Text>

        {/* Party / broker name */}
        <Text style={styles.label}>Party / broker name</Text>
        <TextInput
          style={styles.textInput}
          placeholder="e.g. Sharma Steel Traders"
          placeholderTextColor="#9CA3AF"
          value={partyName}
          onChangeText={setPartyName}
        />

        {/* Company selector */}
        <Text style={styles.label}>Company</Text>
        <View style={styles.row}>
          {COMPANIES.map((name) => (
            <SelectableChip
              key={name}
              label={name}
              selected={company === name}
              onPress={() => setCompany(name)}
              flex={1}
            />
          ))}
        </View>

        {/* Diameter selector */}
        <Text style={styles.label}>Diameter</Text>
        <View style={styles.gridRow}>
          {DIAMETERS.map((size) => (
            <SelectableChip
              key={size}
              label={size}
              selected={diameter === size}
              onPress={() => setDiameter(size)}
              flex={1}
              gridItem
            />
          ))}
          {/* "+ Add" is a static action chip, not a selectable option */}
          <TouchableOpacity style={[styles.chip, styles.gridItemChip]}>
            <Text style={styles.chipText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {/* Quantity */}
        <Text style={styles.label}>Quantity</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.textInput, styles.halfInput]}
            placeholder="Tons"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            value={quantityPrimary}
            onChangeText={setQuantityPrimary}
          />
          <TextInput
            style={[styles.textInput, styles.halfInput]}
            placeholder="Tons"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            value={quantitySecondary}
            onChangeText={setQuantitySecondary}
          />
        </View>

        <View style={styles.divider} />

        {/* Truck details */}
        <Text style={styles.label}>Truck details</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Truck number, e.g. RJ14 GT 4521"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="characters"
          value={truckNumber}
          onChangeText={setTruckNumber}
        />
        <TextInput
          style={[styles.textInput, styles.stackedInput]}
          placeholder="Driver name and phone"
          placeholderTextColor="#9CA3AF"
          value={driverInfo}
          onChangeText={setDriverInfo}
        />
        <TextInput
          style={[styles.textInput, styles.stackedInput]}
          placeholder="Loading point / instructions"
          placeholderTextColor="#9CA3AF"
          value={loadingInstructions}
          onChangeText={setLoadingInstructions}
        />

        {/* Order summary card — reflects current selections/inputs */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              {company} · {diameter}
            </Text>
            <Text style={styles.summaryValue}>
              {quantityPrimary ? `${quantityPrimary} tons` : '— tons'}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Truck</Text>
            <Text style={styles.summaryValue}>
              {truckNumber || '—'}
            </Text>
          </View>
        </View>

        {/* Submit */}
        <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
          <Text style={styles.placeOrderText}>Place order</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaProvider>
  );
}

// Small reusable chip component for the Company/Diameter selectors —
// keeps the selected/unselected styling logic in one place
function SelectableChip({ label, selected, onPress, flex, gridItem }) {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        gridItem ? styles.gridItemChip : { flex },
        selected && styles.chipSelected,
      ]}
      onPress={onPress}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // always give the root container flex:1, or the screen renders blank
    backgroundColor: '#F5F6F8',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    marginTop: 4,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#111827',
    marginBottom: 16,
  },
  stackedInput: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  halfInput: {
    flex: 1,
    marginBottom: 0,
  },
  chip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Three chips per row for the diameter grid, accounting for two 12px gaps
  gridItemChip: {
    width: '31%',
  },
  chipSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  chipText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  chipTextSelected: {
    color: '#2563EB',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  summaryCard: {
    backgroundColor: '#EEF0F3',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  summaryLabel: {
    fontSize: 15,
    color: '#374151',
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  placeOrderButton: {
    backgroundColor: '#F5A340',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  placeOrderText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default NewRodOrder;