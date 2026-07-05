import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Register from "./src/screens/Register";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";
import Login from "./src/screens/Login";
// import OTP from "./src/screens/OTP";



const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <Provider store={store}>
    <NavigationContainer>
      <Stack.Navigator>
         <Stack.Screen name="Register" component={Register}  options={{ headerShown: false }}/>
         {/* <Stack.Screen name="Otp" component={OTP} options={{headerShown : false}} /> */}
         <Stack.Screen name="Login" component={Login} options={{headerShown : false}} />
      </Stack.Navigator>
    </NavigationContainer>
   </Provider>
  );
}




const styles = StyleSheet.create({
  section : {
    flex : 1,
    justifyContent : "center",
    alignItems : "center",
    backgroundColor : "pink",
  }
})