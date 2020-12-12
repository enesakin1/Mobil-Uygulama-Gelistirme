import { createSwitchNavigator, createAppContainer } from "react-navigation";
import Initial from "../screens/Initial";
import { AuthNavigation } from "./AuthNavigation";
import DrawerNavigator from "./AppDrawNavigation";
import SearchStackNavigator from "./AppStackNavigation";

const SwitchNavigator = createSwitchNavigator(
  {
    Initial: Initial,
    Auth: AuthNavigation,
    App: SearchStackNavigator,
  },
  {
    initialRouteName: "Initial",
  }
);

const AppContainer = createAppContainer(SwitchNavigator);

export default AppContainer;
