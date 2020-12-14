import Constants from "expo-constants";
import * as Permissions from "expo-permissions";

class UserPermissions {
  getCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status != "granted") {
      alert("Need permission to use your camera roll");
    }
  };
}

export default new UserPermissions();
