import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Welcome from "../screens/Welcome";
import Register from "../screens/Register";
import Login from "../screens/Login";

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Login" component={Login} />
      {/* <Stack.Screen name="Otp" component={OTP} /> */}
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
    </Stack.Navigator>
  );
}

export default AuthStack;
