import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import Welcome from "../screens/Welcome";
import { NavigationContainer } from "@react-navigation/native";
import AuthenticatedNavigator from "../components/AuthenticatedNavigator";
import Register from "../screens/Register";
import Login from "../screens/Login";



const Stack = createNativeStackNavigator();


function RootNavigator(){
    const {isLoggedIn} = useSelector(state=>state.auth);


    return(
         <NavigationContainer>
      {isLoggedIn ? (
        
        <AuthenticatedNavigator />
      ) : (
        // Unauthenticated screens
        <Stack.Navigator>
          <Stack.Screen
            name="Welcome"
            component={Welcome}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          {/* <Stack.Screen name="Otp" component={OTP} options={{ headerShown: false }} /> */}
        </Stack.Navigator>
      )}
    </NavigationContainer>
    )
}


export default RootNavigator