import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAddresses,
  setSelectedShippingAddress,
} from "../redux/features/addressSlice";
import { isSearchBarAvailableForCurrentPlatform } from "react-native-screens";

function Address() {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  const { initialAddress } = route.params || {};

  const { addresses, isLoadingAddresses } = useSelector(
    (state) => state.address,
  );

  const [addressLine, setAddressLine] = useState(
    initialAddress?.addressLine || "",
  );
  const [city, setCity] = useState(initialAddress?.city || "");
  const [district, setDistrict] = useState(initialAddress?.district || "");
  const [state, setState] = useState(initialAddress?.state || "");
  const [pincode, setPincode] = useState(initialAddress?.pincode || "");
  const [errors, setErrors] = useState({});

  const [selectedParty, setSeletedParty] = useState(
    initialAddress?.party || null,
  );

  const [isLookingUpPincode, setIsLookingUpPincode] = useState(false);
  const [pincodeLookupError, setPincodeLookupError] = useState("");

  const lastFetchedPincode = useRef("");

  let trimmed;
  useFocusEffect(
    useCallback(() => {
      dispatch(fetchAddresses());
    }, [dispatch]),
  );

  useEffect(() => {
    trimmed = pincode.trim();

    if (!/^[1-9][0-9]{5}$/.test(trimmed)) {
      setPincodeLookupError("");
      return;
    }

    if (trimmed === lastFetchedPincode.current) return;

    let isCancelled = false;

    const lookupPincode = async () => {
      setIsLookingUpPincode(true);
      setPincodeLookupError("");

      try {
        const response = await fetch(
          `https://api.postalpincode.in/pincode/${trimmed}`,
        );

        const data = await response.json();

        const result = data?.[0];

        if (isCancelled) return;

        if (result?.Status === "Success" && result.PostOffice?.length) {
          const postoffice = result.PostOffice[0];
          setCity(postoffice.Name || "");
          setDistrict(postoffice.District || "");
          setState(postoffice.State || "");
          lastFetchedPincode.current = trimmed;
        } else {
          setPincodeLookupError("No address found for this pincode");
        }
      } catch (error) {
        if (!isCancelled) {
          setPincodeLookupError(
            "Could not look up pincode. Check your Connection",
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLookingUpPincode(false);
        }
      }
    };

    lookupPincode();

    return () => {
      isCancelled = true;
    };
  }, [pincode]);

  const validate = () => {
    const nextErrors = {};
    if (!addressLine.trim()) nextErrors.addressLine = "Address is required";
    if (!city.trim()) nextErrors.city = "City is required";
    if (!district.trim()) nextErrors.district = "District is required";
    if (!state.trim()) nextErrors.state = "State is required";
    if (!/^[1-9][0-9]{5}$/.test(pincode.trim())) {
      nextErrors.pincode = "Enter a valid 6-digit pincode";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSelectSavedParty = (saved) => {
    setAddressLine(saved.addressLine || "");
    setCity(saved.city || "");
    setDistrict(saved.district || "");
    setState(saved.state || "");
    setPincode(saved.pincode || "");
    setSelectedParty(saved.party || saved.label || null);
    setErrors({});
    lastFetchedPincode.current = saved.pincode || "";
  };

  const handleConfirm = () => {
    if (!validate()) return;

    const address = {
      addressLine: addressLine.trim(),
      city: city.trim(),
      district: district.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      party: selectedParty || undefined,
    };

    // Hand the address back to NewRodOrder and close this screen
    dispatch(setSelectedShippingAddress(address));
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shipping address</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {addresses.length > 0 && (
          <>
            <Text style={styles.label}>Saved parties</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.savedRow}
            >
              {addresses.map((saved) => (
                <TouchableOpacity
                  key={saved._id}
                  style={[
                    styles.savedChip,
                    isSelected && styles.savedChipSelected,
                  ]}
                  onPress={() => handleSelectSavedParty(saved)}
                >
                  <Text
                    style={[
                      styles.savedChipText,
                      isSelected && styles.savedChipTextSelected,
                    ]}
                    numberOfLines={1}
                  >
                    {name}
                  </Text>
                  <Text
                    style={[
                      styles.savedChipSubtext,
                      isSelected && styles.savedChipSelected,
                    ]}
                    numberOfLines={1}
                  >
                    {saved.city}, {saved.state}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

        {isLoadingAddresses && addresses.length === 0 ? (
          <ActivityIndicator
            size="small"
            color="#2563eb"
            style={{ marginBottom: 16 }}
          />
        ) : null}
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={[styles.textInput, styles.multilineInput]}
          placeholder="House / street / landmark"
          placeholderTextColor="#9CA3AF"
          value={addressLine}
          onChangeText={(v) => {
            setAddressLine(v);
            setSeletedParty(null);
          }}
          multiline
        />
        {errors.addressLine ? (
          <Text style={styles.errorText}>{errors.addressLine}</Text>
        ) : null}
        {/* Pincode */}
        <Text style={styles.label}>Pincode</Text>
        <View style={styles.pincodeRow}>
          <TextInput
            style={[styles.textInput, styles.pincodeInput]}
            placeholder="6-digit pincode"
            placeholderTextColor="#9CA3AF"
            keyboardType="number-pad"
            maxLength={6}
            value={pincode}
            onChangeText={(value) => setPincode(value.replace(/[^0-9]/g, ""))}
          />
          {isLookingUpPincode ? (
            <ActivityIndicator
              size="small"
              color="#2563EB"
              style={styles.pincodeSpinner}
            />
          ) : null}
        </View>
        {errors.pincode ? (
          <Text style={styles.errorText}>{errors.pincode}</Text>
        ) : null}

        {pincodeLookupError ? (
          <Text style={styles.warningText}>{pincodeLookupError}</Text>
        ) : null}

        {!errors.pincode && !pincodeLookupError && city ? (
          <Text style={styles.hintText}>
            City, district and state filled from pincode
          </Text>
        ) : null}

        <Text style={styles.label}>City</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Auto-filled from pincode, or enter manually"
          placeholderTextColor="#9CA3AF"
          value={city}
          onChangeText={setCity}
        />
        {errors.city ? (
          <Text style={styles.errorText}>{errors.city}</Text>
        ) : null}

        <Text style={styles.label}>District</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Auto-filled from pincode, or enter manually"
          placeholderTextColor="#9CA3AF"
          value={district}
          onChangeText={setDistrict}
        />
        {errors.district ? (
          <Text style={styles.errorText}>{errors.district}</Text>
        ) : null}

        <Text style={styles.label}>State</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Auto-filled from pincode, or enter manually"
          placeholderTextColor="#9CA3AF"
          value={state}
          onChangeText={setState}
        />
        {errors.state ? (
          <Text style={styles.errorText}>{errors.state}</Text>
        ) : null}

        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Confirm address</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6F8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  label: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
    marginTop: 4,
  },
  savedRow: { gap: 10, paddingBottom: 4, marginBottom: 16 },
  savedChip: {
    minWidth: 140,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  savedChipSelected: { borderColor: "#2563EB", backgroundColor: "#EFF6FF" },
  savedChipText: { fontSize: 14, fontWeight: "700", color: "#111827" },
  savedChipSubtext: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  savedChipTextSelected: { color: "#2563EB" },
  textInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111827",
    marginBottom: 16,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  pincodeRow: { flexDirection: "row", alignItems: "center" },
  pincodeInput: { flex: 1 },
  pincodeSpinner: { marginLeft: 10, marginBottom: 16 },
  warningText: {
    fontSize: 13,
    color: "#B45309",
    marginTop: -12,
    marginBottom: 16,
  },
  hintText: {
    fontSize: 13,
    color: "#059669",
    marginTop: -12,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 13,
    color: "#DC2626",
    marginTop: -12,
    marginBottom: 16,
  },
  confirmButton: {
    backgroundColor: "#F5A340",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default Address;
