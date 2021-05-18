import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Keyboard,
  Image,
  ImageBackground,
  TouchableHighlight,
  ScrollView,
} from "react-native";
import { withFirebaseHOC } from "../config/Firebase";
import { Input, Text } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import axios from "react-native-axios";
import UserPermissions from "../utilities/UserPermissions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingScreen from "./loadingScreen";

class searchScreen extends Component {
  apiurl = "http://www.omdbapi.com/?apikey=9311d6bd";
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
      results: [],
      isLoading: true,
      notFound: false,
    };
  }

  showMovie = async (imdbID) => {
    await axios(this.apiurl + "&i=" + imdbID).then(({ data }) => {
      let result = data;
      this.props.navigation.navigate("Movie", {
        selected: result,
        movieID: imdbID,
      });
    });
  };
  componentDidMount() {
    this._isMounted = true;
    this.initial();
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  initial = async () => {
    const user = await this.props.firebase.getUser(user);
    await AsyncStorage.setItem("useruid", user.uid);
    const expoToken = await UserPermissions.registerForPushNotificationsAsync();
    if (expoToken) {
      this.props.firebase.setExpoToken(expoToken, user.uid);
    }
    if (this._isMounted) {
      this.setState({ isLoading: false });
    }
  };
  search = async () => {
    if (!this.state.searchText) {
      return;
    }
    this.setState((prevState) => ({
      ...prevState,
      notFound: false,
    }));
    Keyboard.dismiss();
    await axios(this.apiurl + "&s=" + this.state.searchText).then(
      ({ data }) => {
        let results = data.Search;
        if (results === undefined || results.length == 0) {
          this.setState((prevState) => ({
            ...prevState,
            notFound: true,
          }));
        }
        if (this._isMounted) {
          this.setState((prevState) => {
            return { ...prevState, results: results };
          });
        }
      }
    );
  };

  render() {
    return this.state.isLoading ? (
      <LoadingScreen />
    ) : (
      <View style={styles.container}>
        <ImageBackground
          source={require("../assets/search.png")}
          style={{ flex: 1, width: "100%" }}
        >
          <View style={styles.container}>
            <Image
              source={require("../assets/logoWithout.png")}
              style={styles.logo}
            />
          </View>
          <View style={styles.searchBox}>
            <Input
              name="searchInput"
              inputContainerStyle={{
                borderWidth: 0.8,
                borderColor: "#06334f",
              }}
              placeholderTextColor="#606063"
              style={styles.textInput}
              value={this.state.searchText}
              onChangeText={(text) =>
                this.setState((prevState) => {
                  return { ...prevState, searchText: text, notFound: false };
                })
              }
              autoCapitalize="none"
              placeholder="Hurry! Enter a movie you want to"
              rightIcon={
                <Ionicons
                  name="ios-search"
                  size={24}
                  color="#08324d"
                  style={{ marginRight: 15 }}
                  onPress={this.search}
                />
              }
              onSubmitEditing={this.search}
            ></Input>
          </View>
          <ScrollView style={styles.results}>
            {this.state.results && this.state.results.length ? (
              this.state.results.map((results) => (
                <TouchableHighlight
                  key={results.imdbID}
                  onPress={() => this.showMovie(results.imdbID)}
                  delayPressIn={50}
                  underlayColor="#82dbed"
                >
                  <View style={styles.result}>
                    <Image
                      source={{ uri: results.Poster }}
                      style={{
                        width: "100%",
                        height: 250,
                        resizeMode: "contain",
                      }}
                    />
                    <Text style={styles.heading}>{results.Title}</Text>
                  </View>
                </TouchableHighlight>
              ))
            ) : this.state.notFound ? (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    marginTop: 15,
                  }}
                >
                  I couldn't find any result :/
                </Text>
              </View>
            ) : null}
          </ScrollView>
        </ImageBackground>
        <StatusBar hidden={true} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    marginLeft: 10,
    fontWeight: "bold",
    fontSize: 17,
  },
  logo: { flex: 0.7, aspectRatio: 1.7, resizeMode: "contain" },
  searchBox: {
    flex: 0.2,
    width: "90%",
    alignSelf: "center",
    marginBottom: 20,
  },
  results: {
    flex: 1,
  },
  result: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 0.8,
  },
  heading: {
    fontSize: 21,
    fontWeight: "bold",
    padding: 20,
  },
});

export default withFirebaseHOC(searchScreen);
