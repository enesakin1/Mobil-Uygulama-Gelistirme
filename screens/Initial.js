import React from "react";
import { ActivityIndicator, StyleSheet, View, Image } from "react-native";
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
      <View style={styles.container}>
        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
        ></Image>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: "orange",
  },
  logo: {
    alignSelf: "center",
    resizeMode: "contain",
    aspectRatio: 0.7,
    justifyContent: "center",
    borderRadius: 10,
  },
});

export default withFirebaseHOC(Initial);
