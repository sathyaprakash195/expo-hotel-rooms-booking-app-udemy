import React from "react";
import { Text } from "react-native";
import { Button, ButtonProps } from "react-native-paper";

const CustomButton = (props: ButtonProps) => {
  return (
    <Button
      style={{
        borderRadius: 5,
        width: "100%",
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        opacity: props.disabled ? 0.5 : 1,
      }}
      mode={props.mode || "contained"}
      onPress={props.onPress}
      disabled={props.disabled}
    >
      <Text>{props.children}</Text>
    </Button>
  );
};

export default CustomButton;
