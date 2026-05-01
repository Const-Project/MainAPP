const fs = require("fs");
const path = require("path");
const appJson = require("./app.json");

const readKakaoNativeKey = () => {
  const keyPath = path.join(__dirname, "kakao-native-key.txt");

  if (!fs.existsSync(keyPath)) {
    return "";
  }

  return fs.readFileSync(keyPath, "utf8").trim();
};

const kakaoNativeKey = readKakaoNativeKey();

module.exports = {
  expo: {
    ...appJson.expo,
    plugins: [
      "expo-secure-store",
      "expo-web-browser",
      [
        "expo-notifications",
        {
          icon: "./assets/icon.png",
          color: "#3AB40B",
        },
      ],
      "expo-font",
      ...(kakaoNativeKey
        ? [
            [
              "@react-native-seoul/kakao-login",
              {
                kakaoAppKey: kakaoNativeKey,
              },
            ],
          ]
        : []),
      [
        "expo-build-properties",
        {
          android: {
            extraMavenRepos: [
              "https://devrepo.kakao.com/nexus/content/groups/public/",
            ],
          },
        },
      ],
    ],
  },
};
