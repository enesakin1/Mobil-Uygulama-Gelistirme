import React from "react";
import Firebase, { FirebaseProvider } from "./config/Firebase";
import AppContainer from "./navigation/AppNavigator";

export default function App() {
  return (
    <FirebaseProvider value={Firebase}>
      <AppContainer />
    </FirebaseProvider>
  );
}
