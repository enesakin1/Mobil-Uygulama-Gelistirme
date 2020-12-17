import React, { Component, useContext } from "react";
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

class profileScreen extends Component {
  state = {
    useruid: "",
    avatar: null,
    username: "",
    comments: {},
    loaded: false,
  };
  renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.commentTitleContainer}>
        <Text style={styles.commentTitle}>{item.movieTitle}</Text>
        <Ionicons
          name="ios-trash"
          size={22}
          color="#08324d"
          onPress={async () => await this._deleteComment(item.commentid)}
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

  _deleteComment = async (commentid) => {
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
            await this.props.firebase.deleteComment(commentid);
            this.getCommentsAgain();
          },
        },
      ],
      { cancelable: false }
    );
  };
  componentDidMount() {
    this.getUserInfo();
  }
  getCommentsAgain = async () => {
    const comments = await this.props.firebase.getUserComments(
      this.state.useruid
    );
    this.setState({
      comments: comments,
      isFetching: false,
    });
  };
  getUserInfo = async () => {
    const useruid = await AsyncStorage.getItem("useruid");
    const uri = await this.props.firebase.getPhoto(useruid);
    const username = await this.props.firebase.getUsername(useruid);
    const comments = await this.props.firebase.getUserComments(useruid);
    this.setState({
      useruid: useruid,
      avatar: uri,
      username: username,
      comments: comments,
      loaded: true,
      isFetching: false,
    });
  };
  selectAvatar = async () => {
    UserPermissions.getCameraPermission();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      this.setState({ avatar: result.uri });
      this.props.firebase.uploadPhoto(
        this.state.avatar,
        "avatars/" + this.state.useruid
      );
    }
  };
  onRefresh() {
    this.setState({ isFetching: true }, function () {
      this.getCommentsAgain();
    });
  }
  render() {
    return this.state.loaded == true ? (
      <View style={styles.container}>
        <ImageBackground
          source={require("../assets/profile.png")}
          style={{ flex: 1, width: "100%" }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              flex: 0.8,
              borderBottomWidth: 1,
            }}
          >
            <View style={styles.avatarContainer}>
              <TouchableOpacity
                style={styles.avatarPlaceholder}
                onPress={this.selectAvatar}
              >
                <Image
                  style={styles.avatar}
                  source={
                    this.state.avatar
                      ? { uri: this.state.avatar }
                      : require("../assets/tempAvatar.png")
                  }
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.name}>{this.state.username}</Text>
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Comment History</Text>
          </View>
          <FlatList
            data={this.state.comments}
            renderItem={this.renderItem}
            keyExtractor={(item) => item.commentid}
            style={{ flex: 1 }}
            refreshing={this.state.isFetching}
            onRefresh={() => this.getCommentsAgain()}
          ></FlatList>
        </ImageBackground>
      </View>
    ) : (
      <LoadingScreen />
    );
  }
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
    marginTop: 17,
    fontSize: 16,
    fontWeight: "bold",
  },
  titleContainer: {
    flex: 0.2,
    borderBottomWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
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
