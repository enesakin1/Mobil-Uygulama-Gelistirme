import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { withFirebaseHOC } from "../config/Firebase";

class movieScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Movie Screen</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default withFirebaseHOC(movieScreen);
