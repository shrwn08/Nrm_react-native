import { Provider } from "react-redux";
import RootNavigator from "./src/routes/RootNavigator";
import { StyleSheet } from "react-native";
import { store } from "./src/redux/store";

export default function App() {
  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
}
const styles = StyleSheet.create({
  section: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
});