import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-elements";
import { withFirebaseHOC } from "../config/Firebase";

class searchScreen extends Component {
  handleSignOut = async () => {
    try {
      await this.props.firebase.signOut();
      this.props.navigation.navigate("Initial");
    } catch (error) {
      console.log(error);
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <Text>Naber</Text>
        <Button onPress={this.handleSignOut} />
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

export default withFirebaseHOC(searchScreen);
