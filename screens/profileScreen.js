import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  Alert,
} from "react-native";
import { withFirebaseHOC } from "../config/Firebase";
import UserPermissions from "../utilities/UserPermissions";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import LoadingScreen from "./loadingScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "react-native-axios";

function profileScreen({ route, firebase, navigation }) {
  const apiurl = "http://www.omdbapi.com/?apikey=9311d6bd";
  const [state, setState] = useState({
    useruid: "",
    avatar: null,
    username: "",
    comments: {},
    loaded: false,
    numberOfFollowers: 0,
  });
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.commentTitleContainer}>
        <Text
          onPress={() => navigateMovie(item.ID)}
          style={styles.commentTitle}
        >
          {item.movieTitle}
        </Text>
        <Ionicons
          name="ios-trash"
          size={22}
          color="#08324d"
          onPress={async () => await _deleteComment(item.commentid)}
        />
      </View>
      <View style={styles.commentContainer}>
        <Text style={styles.comment}>{item.comment}</Text>
      </View>
      <View style={styles.commentDateContainer}>
        <Text style={styles.commentDate}>{item.currentDate}</Text>
      </View>
    </View>
  );
  const header = () => (
    <View>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View style={styles.avatarContainer}>
          <View>
            <View>
              <TouchableOpacity
                style={styles.avatarPlaceholder}
                onPress={selectAvatar}
              >
                <Image
                  style={styles.avatar}
                  source={
                    state.avatar
                      ? { uri: state.avatar }
                      : require("../assets/tempAvatar.png")
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.name}>{state.username}</Text>
        </View>
        <Text>{state.numberOfFollowers + " Followers"}</Text>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Comment History</Text>
      </View>
    </View>
  );
  const showEmptyListView = () => (
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
        Seems like this user don't like to share opinions :(
      </Text>
    </View>
  );
  const onRefresh = () => {
    setState((prevState) => ({
      ...prevState,
      loaded: false,
      isFetching: true,
    }));
    let useruid = state.useruid;
    getCommentsAgain(useruid);
  };
  const _deleteComment = async (commentid) => {
    Alert.alert(
      "Delete Comment",
      "Are you sure?",
      [
        {
          text: "Cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            await firebase.deleteComment(commentid);
            let useruid = state.useruid;
            getCommentsAgain(useruid);
          },
        },
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    setState({
      loaded: false,
    });
    getUserInfo();
  }, []);

  const navigateMovie = async (imdbID) => {
    await axios(apiurl + "&i=" + imdbID).then(({ data }) => {
      let result = data;
      navigation.navigate("Movie", {
        selected: result,
        movieID: imdbID,
      });
    });
  };

  const getCommentsAgain = async (useruid) => {
    const comments = await firebase.getUserComments(useruid);
    await comments.sort(function (a, b) {
      var keyA = a.currentDate.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3/$2/$1");
      var keyB = b.currentDate.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3/$2/$1");
      if (keyA > keyB) return -1;
      if (keyA < keyB) return 1;
      return 0;
    });
    setState((prevState) => ({
      ...prevState,
      comments: comments,
      loaded: true,
      isFetching: false,
    }));
  };

  const getUserInfo = async () => {
    const useruid = await AsyncStorage.getItem("useruid");
    const uri = await firebase.getPhoto(useruid);
    const username = await firebase.getUsername(useruid);
    const numberOfFollowers = await firebase.getNumberOfFollowers(useruid);
    getCommentsAgain(useruid);
    setState((prevState) => ({
      ...prevState,
      useruid: useruid,
      avatar: uri,
      username: username,
      isFetching: false,
      numberOfFollowers: numberOfFollowers,
    }));
  };

  const selectAvatar = async () => {
    UserPermissions.getCameraPermission();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      setState((prevState) => ({ ...prevState, avatar: result.uri }));
      firebase.uploadPhoto(result.uri, "avatars/" + state.useruid);
      firebase.setPhotoUploaded(state.useruid);
    }
  };
  return state.loaded == true ? (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/profile.png")}
        style={{ flex: 1, width: "100%" }}
      >
        <FlatList
          data={state.comments}
          renderItem={renderItem}
          keyExtractor={(item) => item.commentid}
          style={{ flex: 1 }}
          refreshing={state.isFetching}
          onRefresh={() => onRefresh()}
          ListHeaderComponent={header}
          ListEmptyComponent={showEmptyListView}
        ></FlatList>
      </ImageBackground>
    </View>
  ) : (
    <LoadingScreen />
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarContainer: {
    shadowColor: "#151734",
    shadowRadius: 15,
    shadowOpacity: 0.4,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    marginTop: 13,
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center",
  },
  titleContainer: {
    flex: 0.3,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  title: {
    marginTop: 5,
    marginBottom: 5,
    fontSize: 20,
  },
  comments: {
    flex: 1,
    marginTop: 25,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: "#E1E2E6",
    borderRadius: 50,
    marginTop: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    backgroundColor: "#e4e9f2",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    marginTop: 10,
  },
  comment: {
    fontSize: 13,
  },
  commentDate: {
    fontSize: 13,
  },
  commentTitle: {
    fontSize: 16,
    marginLeft: 5,
    fontWeight: "bold",
    flex: 0.95,
  },
  commentDateContainer: {
    marginTop: 5,
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  commentContainer: {
    justifyContent: "center",
    marginTop: 5,
  },
  commentTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default withFirebaseHOC(profileScreen);
