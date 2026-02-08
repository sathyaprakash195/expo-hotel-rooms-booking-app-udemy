import CustomText from "@/components/custom-text";
import FlexBox from "@/components/flexbox";
import { PRIMARY_COLOR } from "@/constants";
import React from "react";
import { KeyboardAvoidingView, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import LoginForm from "./_components/login-form";

const RegisterScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={50}
        behavior="padding"
        style={{ flex: 1, backgroundColor: "white" }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, backgroundColor: "white" }}
        >
          <FlexBox backgroundColor={PRIMARY_COLOR} flex={1}>
            <FlexBox gap={5} paddingHorizontal={40} paddingVertical={100}>
              <CustomText
                value="Welcome Back"
                fontSize={35}
                fontWeight="bold"
                fontColor="#c3ba05"
              />
              <CustomText
                value="Please fill the form to continue"
                fontSize={16}
                fontWeight="600"
                fontColor="#ffffff"
              />
            </FlexBox>
            <FlexBox
              style={{
                borderTopLeftRadius: 50,
              }}
              flex={1}
              backgroundColor="#ffffff"
              paddingHorizontal={40}
              paddingVertical={50}
            >
              <LoginForm />
            </FlexBox>
          </FlexBox>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
