import React from "react";
import { TouchableOpacity, View } from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

function BackArrow() {
    const navigation = useNavigation();
  return (
    <TouchableOpacity  onPress={() => navigation.goBack()}>
      <MaterialIcon name="arrowBack" size={30} color="#000" />
    </TouchableOpacity>
  );
}

export default BackArrow;
