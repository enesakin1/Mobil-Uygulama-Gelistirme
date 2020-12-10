import { Formik } from "formik";
import * as Yup from "yup";
import React, { Fragment, Component } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  SafeAreaView,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { Button, Input } from "react-native-elements";
import { withFirebaseHOC } from "../config/Firebase";
import { StatusBar } from "expo-status-bar";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .label("Email")
    .email("Enter a valid email")
    .required("Please enter a registered email"),
  password: Yup.string()
    .label("Password")
    .required()
    .min(6, "Password must have at least 6 characters "),
});

class loginScreen extends React.Component {
  state = {
    passwordVisibility: true,
    rightIcon: "ios-eye",
  };

  goToSignup = () => this.props.navigation.navigate("Signup");

  handlePasswordVisibility = () => {
    this.setState((prevState) => ({
      rightIcon: prevState.rightIcon === "ios-eye" ? "ios-eye-off" : "ios-eye",
      passwordVisibility: !prevState.passwordVisibility,
    }));
  };
  handleOnLogin = async (values, actions) => {
    const { email, password } = values;
    try {
      const response = await this.props.firebase.loginWithEmail(
        email,
        password
      );

      if (response.user) {
        this.props.navigation.navigate("Search");
      }
    } catch (error) {
      alert("Seems like there is no account like that. Try something else.");
    } finally {
      actions.setSubmitting(false);
    }
  };
  render() {
    const { passwordVisibility, rightIcon } = this.state;
    return (
      <ScrollView style={{ flex: 1 }}>
        <KeyboardAvoidingView style={{ flex: 1 }}>
          <SafeAreaView style={styles.container}>
            <ImageBackground
              source={require("../assets/poster.jpg")}
              style={styles.backgroundImage}
            >
              <View style={styles.logoContainer}>
                <Image
                  source={require("../assets/logo.png")}
                  style={styles.logo}
                ></Image>
              </View>
              <Formik
                initialValues={{ email: "", password: "", username: "" }}
                onSubmit={(values, actions) => {
                  this.handleOnLogin(values, actions);
                }}
                validationSchema={validationSchema}
              >
                {({
                  handleChange,
                  values,
                  handleSubmit,
                  errors,
                  isValid,
                  touched,
                  handleBlur,
                  isSubmitting,
                }) => (
                  <Fragment>
                    <View style={styles.textView}>
                      <Input
                        name="email"
                        errorMessage={touched.email && errors.email}
                        style={styles.textInput}
                        value={values.email}
                        onChangeText={handleChange("email")}
                        autoCapitalize="none"
                        placeholder="Enter email"
                        leftIcon={
                          <Ionicons name="ios-mail" size={24} color="orange" />
                        }
                        onBlur={handleBlur("email")}
                      />
                      <Input
                        name="password"
                        errorMessage={touched.password && errors.password}
                        style={styles.textInput}
                        value={values.password}
                        onChangeText={handleChange("password")}
                        placeholder="Enter password"
                        secureTextEntry={passwordVisibility}
                        autoCapitalize="none"
                        onBlur={handleBlur("password")}
                        leftIcon={
                          <Ionicons name="ios-lock" size={24} color="orange" />
                        }
                        rightIcon={
                          <TouchableOpacity
                            onPress={this.handlePasswordVisibility}
                          >
                            <Ionicons
                              name={rightIcon}
                              size={28}
                              color="orange"
                            />
                          </TouchableOpacity>
                        }
                      />
                    </View>

                    <View style={styles.buttonContainer}>
                      <Button
                        buttonType="outline"
                        buttonStyle={{
                          backgroundColor: "orange",
                          borderRadius: 10,
                        }}
                        onPress={handleSubmit}
                        title="Login"
                        buttonColor="#039BE5"
                        disabled={!isValid || isSubmitting}
                        loading={isSubmitting}
                      />
                      <Button
                        title="Don't have an account? Sign Up"
                        onPress={this.goToSignup}
                        titleStyle={{
                          color: "#F57C00",
                        }}
                        type="clear"
                      />
                    </View>
                  </Fragment>
                )}
              </Formik>
            </ImageBackground>
          </SafeAreaView>
        </KeyboardAvoidingView>
        <StatusBar hidden={true} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoContainer: {
    flex: 1.7,
    marginTop: 5,
  },
  buttonContainer: {
    margin: 25,
    flex: 1,
    marginLeft: "10%",
    marginRight: "10%",
  },
  textInput: {
    fontSize: 16,
  },
  textView: {
    flex: 1,
    marginLeft: "16%",
    marginRight: "16%",
  },
  logo: {
    alignSelf: "center",
    resizeMode: "contain",
    aspectRatio: 0.7,
    justifyContent: "center",
    borderRadius: 10,
  },
  backgroundImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    flex: 1,
  },
  icons: {
    paddingLeft: 100,
  },
});

export default withFirebaseHOC(loginScreen);
