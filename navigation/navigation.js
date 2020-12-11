import { createSwitchNavigator, createAppContainer } from "react-navigation";
import Initial from "../screens/Initial";
import { AuthNavigation } from "./AuthNavigation";
import DrawerNavigator from "./AppDrawNavigation";

const SwitchNavigator = createSwitchNavigator(
  {
    Initial: Initial,
    Auth: AuthNavigation,
    App: DrawerNavigator,
  },
  {
    initialRouteName: "Initial",
  }
);

const AppContainer = createAppContainer(SwitchNavigator);

export default AppContainer;
