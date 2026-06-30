import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Register from "./src/screens/Register";



const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
         <Stack.Screen name="Register" component={Register}  options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
   
  );
}




const styles = StyleSheet.create({
  section : {
    flex : 1,
    justifyContent : "center",
    alignItems : "center",
    backgroundColor : "white",
  }
})