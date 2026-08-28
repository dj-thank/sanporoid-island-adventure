import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "jp.sanporoid.islandadventure",
  appName: "欠けた潮星",
  webDir: "native-dist",
  android: {
    backgroundColor: "#06171d",
    allowMixedContent: false,
    captureInput: true,
  },
  ios: {
    backgroundColor: "#06171d",
    contentInset: "automatic",
  },
};

export default config;
