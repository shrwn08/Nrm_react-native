import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { SafeAreaProvider } from "react-native-safe-area-context";
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { clearCreateOrderError, createOrder } from '../redux/features/orderSlice';

// Static option lists - we can later pull these from a config/API
const RODTYPE = ['Jindal', 'Rathi'];
const DIAMETERS = ['8mm', '12mm', '16mm', '20mm', '24mm'];

function NewRodOrder() {
  const navigation = useNavigation();
  const dispatch = useDispatch()

  // Form state - each piece of the form gets its own state slice so we
  // can update fields independently without touching the rest of the form
  const [partyName, setPartyName] = useState('');
  const [rodType, setRodType] = useState('Jindal');

  // Multi-select diameters. Each entry represents one diameter the user
  // picked, plus the tons they want for it. Once a diameter is picked its
  // chip is disabled (can't be picked twice); deleting the row re-enables
  // the chip so it can be picked again.
  const [rodLines, setRodLines] = useState([]);
  // e.g. [{ id: '12mm', diameter: '12mm', quantity: '' }, ...]

  const [truckNumber, setTruckNumber] = useState('');
  const [driverInfo, setDriverInfo] = useState('');

  // Shipping address is now a structured object collected on its own
  // screen, since orders can go to different places each time.
  const [shippingAddress, setShippingAddress] = useState(null);
  // e.g. { addressLine, city, district, state, pincode }

  const isDiameterSelected = (size) =>
    rodLines.some((line) => line.diameter === size);

  const handleSelectDiameter = (size) => {
    // Ignore taps on already-selected (disabled) chips
    if (isDiameterSelected(size)) return;

    setRodLines((prev) => [
      ...prev,
      { id: size, diameter: size, quantity: '' },
    ]);
  };

  const handleQuantityChange = (id, value) => {
    setRodLines((prev) =>
      prev.map((line) =>
        line.id === id ? { ...line, quantity: value } : line
      )
    );
  };

  const handleDeleteLine = (id) => {
    // Removing the line also frees up its diameter chip again
    setRodLines((prev) => prev.filter((line) => line.id !== id));
  };

  // Opens the Address screen. Passing initialAddress lets the user edit
  // the address they already picked instead of starting over.
  const handleOpenAddressScreen = () => {
    navigation.navigate('Address', {
      initialAddress: shippingAddress,
      onSave: (address) => {setShippingAddress(address)

        /*if the picked address came from a saved party and the patry name field is still empty, use it - never overwrie what the user already typed*/

        if(address.party && !partyName.trim()){
          setPartyName(address)
        }
      }



    });
  };

  const handlePlaceOrder = () => {
    // Wire this up to our order-submission logic (API call / local store)
    if(!partyName.trim()){
      Alert.alert('Missing party name', 'Please enter the party name')
    }

    if(rodLines.length === 0){
      Alert.alert('No diameters selected', 'Pick at least one diameter and quantity.');
    }

    const incompleteLine = rodLines.find(
      (line) => !line.quantity || Number(line.quantity) <= 0,
    );

    if(incompleteLine){
      Alert.alert('Missing quantity', `Enter a quantity greater than 0 for ${incompleteLine.diameter}`);
      return;
    }

    if(!shippingAddress){
      Alert.alert('Missing address', 'Please add a shipping address.');
    }

    if(createOrderError){
      dispatch(clearCreateOrderError())
    } 


    const payload = {
      party : partyName.trim(),
      rodType : rodType,
      rodLines : rodLines.map((line)=>({
        diameter : line.diameter,
        quantity : Number(line.quantity)
      })),
      truck : truckNumber.trim() || driverInfo.trim() ? {number : truckNumber.trim(), driverInfo: driverInfo.trim()} : undefined, shippingAddress
    }

    const result = await dispatch(createOrder(payload));

    if(createOrder.fulfilled.match(result)){
      Alert.alert('Order Placed', 'Your rod order has been placed successfully.',[
        {
          text : 'View orders',
          onPress : ()=>{
            resetForm();
            navigation.navigate('Orders');
          }
        }
      ])
    }else{
      Alert.alert('Could not place order', result.payload || 'Please try again.')
    }

  };
  function resetForm () {
    setPartyName('');
    setRodType('Jindal');
    setRodLines([]);
    setTruckNumber('');
    setDriverInfo('');
    setShippingAddress(null);
  }

  /* The bottom button does one of two things depending on whether an address has been confirmed yet: collect the address first, or place the order once everything (including address) is ready.*/
  const handlePrimaryButtonPress = () => {
    if (!shippingAddress) {
      handleOpenAddressScreen();
      return;
    }
    handlePlaceOrder();
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
        <Text style={styles.label}>Party name</Text>
        <TextInput
          style={styles.textInput}
          placeholder="e.g. Sharma Steel Traders"
          placeholderTextColor="#9CA3AF"
          value={partyName}
          onChangeText={setPartyName}
        />

        {/* rodType selector */}
        <Text style={styles.label}>Type</Text>
        <View style={styles.row}>
          {RODTYPE.map((name) => (
            <SelectableChip
              key={name}
              label={name}
              selected={rodType === name}
              onPress={() => setRodType(name)}
              flex={1}
            />
          ))}
        </View>

        {/* Diameter selector - multi-select. Once picked, a chip is
            disabled until its corresponding quantity row is deleted. */}
        <Text style={styles.label}>Diameter</Text>
        <View style={styles.gridRow}>
          {DIAMETERS.map((size) => {
            const selected = isDiameterSelected(size);
            return (
              <SelectableChip
                key={size}
                label={size}
                selected={selected}
                disabled={selected}
                onPress={() => handleSelectDiameter(size)}
                flex={1}
                gridItem
              />
            );
          })}
        </View>

        {/* Quantity - one row per selected diameter */}
        <Text style={styles.label}>Quantity</Text>
        {rodLines.length === 0 && (
          <Text style={styles.emptyHint}>
            Pick a diameter above to add a quantity row
          </Text>
        )}
        {rodLines.map((line) => (
          <View style={[styles.row, styles.quantityRow]} key={line.id}>
            {/* Read-only field showing which diameter this row is for */}
            <View style={[styles.textInput, styles.halfInput, styles.diameterDisplay]}>
              <Text style={styles.diameterDisplayText}>{line.diameter}</Text>
            </View>
            <TextInput
              style={[styles.textInput, styles.halfInput]}
              placeholder="Tons"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={line.quantity}
              onChangeText={(value) => handleQuantityChange(line.id, value)}
            />
            <Pressable
              style={({ pressed }) => [
                styles.deleteBtn,
                pressed && styles.deleteBtnPressed,
              ]}
              onPress={() => handleDeleteLine(line.id)}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </Pressable>
          </View>
        ))}

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

        {/* Shipping address - structured, collected on its own screen since
            orders can ship to different places each time */}
        <Text style={styles.label}>Shipping address</Text>
        {shippingAddress ? (
          <View style={styles.addressCard}>
            <View style={styles.addressCardText}>
              <Text style={styles.addressLine} numberOfLines={3}>
                {shippingAddress.addressLine}
              </Text>
              <Text style={styles.addressMeta}>
                {shippingAddress.city}, {shippingAddress.district},{' '}
                {shippingAddress.state} - {shippingAddress.pincode}
              </Text>
            </View>
            <TouchableOpacity onPress={handleOpenAddressScreen}>
              <Text style={styles.changeAddressText}>Change</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addAddressButton}
            onPress={handleOpenAddressScreen}
          >
            <Ionicons name="location-outline" size={18} color="#2563EB" />
            <Text style={styles.addAddressText}>Add shipping address</Text>
          </TouchableOpacity>
        )}

        {/* Order summary card - reflects current selections/inputs */}
        <View style={styles.summaryCard}>
          {rodLines.length === 0 ? (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{rodType}</Text>
              <Text style={styles.summaryValue}>- tons</Text>
            </View>
          ) : (
            rodLines.map((line) => (
              <View style={styles.summaryRow} key={line.id}>
                <Text style={styles.summaryLabel}>
                  {rodType} · {line.diameter}
                </Text>
                <Text style={styles.summaryValue}>
                  {line.quantity ? `${line.quantity} tons` : '- tons'}
                </Text>
              </View>
            ))
          )}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Truck</Text>
            <Text style={styles.summaryValue}>
              {truckNumber || '-'}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Ship to</Text>
            <Text style={styles.summaryValue} numberOfLines={1}>
              {shippingAddress ? shippingAddress.city : 'Not set'}
            </Text>
          </View>
        </View>

        {/* Submit - collects the address first, then places the order */}
        <TouchableOpacity style={[styles.placeOrderButton, isCreatingOrder && styles.placeOrderButtonDisabled]}
          onPress={handlePrimaryButtonPress}
          disabled={isCreatingOrder}>
          {isCreatingOrder ? (<ActivityIndicator color="#FFFFFF" />):(
            <Text style={styles.placeOrderText}>
            {shippingAddress ? 'Place order' : 'Add shipping address'}
          </Text>
          )}
          
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaProvider>
  );
}

// Small reusable chip component for the rodType/Diameter selectors -
// keeps the selected/unselected styling logic in one place
function SelectableChip({ label, selected, disabled, onPress, flex, gridItem }) {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        gridItem ? styles.gridItemChip : { flex },
        selected && styles.chipSelected,
        disabled && styles.chipDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        style={[
          styles.chipText,
          selected && styles.chipTextSelected,
          disabled && styles.chipTextDisabled,
        ]}
      >
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
  emptyHint: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111827',
    marginBottom: 16,
  },
  diameterDisplay: {
    justifyContent: 'center',
  },
  diameterDisplayText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  quantityRow: {
    alignItems: 'center',
  },
  deleteBtn: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnPressed: {
    backgroundColor: '#FEE2E2',
  },
  deleteText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DC2626',
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
  chipDisabled: {
    opacity: 0.5,
  },
  chipText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  chipTextSelected: {
    color: '#2563EB',
  },
  chipTextDisabled: {
    color: '#2563EB',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 10,
    paddingVertical: 14,
    marginBottom: 16,
  },
  addAddressText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2563EB',
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  addressCardText: {
    flex: 1,
    marginRight: 12,
  },
  addressLine: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  addressMeta: {
    fontSize: 13,
    color: '#6B7280',
  },
  changeAddressText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563EB',
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