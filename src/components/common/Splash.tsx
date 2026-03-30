import { View, Text, ImageBackground, Image, StyleSheet } from "react-native";

const SplashBg = require("@/assets/images/onboarding/splash.png");
const Character = require("@/assets/images/char.png");

export default function Splash() {
  return (
    <ImageBackground source={SplashBg} style={styles.container}>
      <Image source={Character} style={styles.character} resizeMode="contain" />
      <Text style={styles.title}>나풀나풀</Text>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  character: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2D5A27",
  },
});
