import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Keyboard,
  Image,
  ImageBackground,
  TouchableHighlight,
} from "react-native";
import { withFirebaseHOC } from "../config/Firebase";
import { Input, Text } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import axios from "react-native-axios";
import { ScrollView } from "react-native-gesture-handler";

function searchScreen({ navigation }) {
  const apiurl = "http://www.omdbapi.com/?apikey=9311d6bd";
  const [state, setState] = useState({
    searchText: "",
    results: [],
  });

  const showMovie = async (imdbID) => {
    await axios(apiurl + "&i=" + imdbID).then(({ data }) => {
      let result = data;
      navigation.navigate("Movie", {
        selected: result,
      });
    });
  };

  const search = async () => {
    Keyboard.dismiss();
    await axios(apiurl + "&s=" + state.searchText).then(({ data }) => {
      let results = data.Search;
      setState((prevState) => {
        return { ...prevState, results: results };
      });
    });
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/search.png")}
        style={{ flex: 1, width: "100%" }}
      >
        <View style={styles.container}>
          <Image
            source={require("../assets/logoWithout.png")}
            style={styles.logo}
            borderRadius={10}
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
            value={state.searchText}
            onChangeText={(text) =>
              setState((prevState) => {
                return { ...prevState, searchText: text };
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
                onPress={search}
              />
            }
            onSubmitEditing={search}
          ></Input>
        </View>
        <ScrollView style={styles.results}>
          {state.results && state.results.length
            ? state.results.map((results) => (
                <TouchableHighlight
                  key={results.imdbID}
                  onPress={() => showMovie(results.imdbID)}
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
            : null}
        </ScrollView>
      </ImageBackground>
      <StatusBar hidden={true} />
    </View>
  );
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

export default searchScreen;
