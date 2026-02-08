import CustomButton from "@/components/custom-button";
import CustomText from "@/components/custom-text";
import FlexBox from "@/components/flexbox";
import { PRIMARY_COLOR } from "@/constants";
import { useRouter } from "expo-router";
import React from "react";
import { Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const WelcomeScreen = () => {
  const router = useRouter();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlexBox
        flex={1}
        justifyContent="center"
        alignItems="center"
        paddingHorizontal={40}
        gap={30}
      >
        <Image
          source={require("../../../assets/images/welcomeimage.png")}
          style={{ width: 150, height: 150 }}
          resizeMode="contain"
        />
        <CustomText
          value="EXPOSTAYDEV"
          fontSize={25}
          fontColor={PRIMARY_COLOR}
          fontWeight="bold"
        />
        <CustomText
          value="Welcome to ExpoStayDev, your go-to app for managing and deploying Expo projects with ease."
          fontSize={16}
          fontColor="#555"
          fontWeight="bold"
        />
        <CustomButton
          onPress={() => {
            router.push("/(public)/register");
          }}
          mode="contained"
        >
          Get Started
        </CustomButton>
      </FlexBox>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
