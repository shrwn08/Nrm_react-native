import React, { useState } from "react";
import { Text } from "react-native";
import { useNavigation } from '@react-navigation/native';

//Order status
const FILTERS = ["All", "Pending", "Loaded"];


const FILTER_STATUS_MAP = {
  All: null,
  Pending: ["Pending"],
  Loaded: ["En route", "Delivered"],
};

function OrderList() {
  const navigation = useNavigation();
  const [activeFilter, setActiveFilter] = useState("All");



  return <Text>OrderListScreen</Text>;
}

export default OrderList;
