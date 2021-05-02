import React, { useState, useCallback, useEffect } from "react";
import Firebase, { FirebaseProvider } from "./config/Firebase";
import AppContainer from "./navigation/navigation";
import { NavigationContainer } from "@react-navigation/native";
import { LogBox } from "react-native";
export default function App() {
  useEffect(() => LogBox.ignoreLogs(["Setting a timer"]), []);
  return (
    <FirebaseProvider value={Firebase}>
      <NavigationContainer>
        <AppContainer />
      </NavigationContainer>
    </FirebaseProvider>
  );
}
