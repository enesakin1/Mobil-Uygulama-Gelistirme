import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { withFirebaseHOC } from "../config/Firebase";

class Initial extends React.Component {
  componentDidMount = async () => {
    try {
      await this.props.firebase.checkUserAuth((user) => {
        if (user) {
          this.props.navigation.navigate("App");
        } else {
          this.props.navigation.navigate("Auth");
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  render() {
    return (
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});

export default withFirebaseHOC(Initial);
