import React from "react";
import Firebase, { FirebaseProvider } from "./config/Firebase";
import AppContainer from "./navigation/navigation";
import { NavigationContainer } from "@react-navigation/native";
import { LogBox } from "react-native";
LogBox.ignoreAllLogs(true);
export default function App() {
  return (
    <FirebaseProvider value={Firebase}>
      <NavigationContainer>
        <AppContainer />
      </NavigationContainer>
    </FirebaseProvider>
  );
}
