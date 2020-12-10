import { createSwitchNavigator, createAppContainer } from "react-navigation";
import Initial from "../screens/Initial";
import Signup from "../screens/signUpScreen";
import Login from "../screens/loginScreen";
import Search from "../screens/searchScreen";

const SwitchNavigator = createSwitchNavigator(
  {
    Initial: Initial,
    Signup: Signup,
    Login: Login,
    Search: Search,
  },
  {
    initialRouteName: "Initial",
  }
);

const AppContainer = createAppContainer(SwitchNavigator);

export default AppContainer;
