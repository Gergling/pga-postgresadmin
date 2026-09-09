import { getNetworkInterfaceType } from "./interface";
import { checkInternetAccess } from "./internet";
import { testRouterConnection } from "./router";

// 🌐, 📶, 🔌, ❌, ⚠️

export const extractNetworkStatus = async () => {
  const type = getNetworkInterfaceType();
  const awaitHasInternet = checkInternetAccess();
  // const awaitHasRouter = testRouterConnection(gatewayIp)

  // offline
  // wifi may or may not have internet or a router connection
  // ethernet may or may not have internet or a router connection
};
