import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import Welcome from "../screens/Welcome";
import { NavigationContainer } from "@react-navigation/native";
import AuthenticatedNavigator from "../components/AuthenticatedNavigator";
import Register from "../screens/Register";
import Login from "../screens/Login";
import AuthStack from "./AuthStack";
import EditProfile from "../screens/profile/EditProfile";
import ChangePassword from "../screens/profile/ChangePassword";
import Notifications from "../screens/profile/Notifications";
import SavedParties from "../screens/profile/SavedParties";
import LinkedTrucks from "../screens/profile/LinkedTrucks";
import HelpSupport from "../screens/profile/HelpSupport";
import Settings from "../screens/profile/Settings";
import BottomTabs from "./BottomTabs";



const Stack = createNativeStackNavigator();


function RootNavigator(){
    const {isLoggedIn} = useSelector(state=>state.auth);

    if(!isLoggedIn){
      return <AuthStack />
    }
    return(
         <Stack.Navigator screenOptions={{headerShown : false}}>
            <Stack.Screen name="MainTabs" component={BottomTabs} />
            <Stack.Screen name="EditProfile" component={EditProfile} />
            <Stack.Screen name="ChangePassword" component={ChangePassword} />
            <Stack.Screen name="Notifications" component={Notifications} />
            <Stack.Screen name="SavedParties" component={SavedParties} />
            <Stack.Screen name="LinkedTrucks" component={LinkedTrucks} />
            <Stack.Screen name="HelpSupport" component={HelpSupport} />
            <Stack.Screen name="Settings" component={Settings} />
         </Stack.Navigator>
    )
}


export default RootNavigator