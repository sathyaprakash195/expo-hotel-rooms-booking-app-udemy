import CustomButton from "@/components/custom-button";
import CustomText from "@/components/custom-text";
import FlexBox from "@/components/flexbox";
import { USER_ROLES } from "@/constants";
import { registerUser } from "@/services/users";
import { Link } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { TextInput } from "react-native-paper";
import { Dropdown } from "react-native-paper-dropdown";
import Toast from "react-native-toast-message";

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      role: "user",
      password: "",
    },
  });
  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const response = await registerUser(data);
      if (response.success) {
        Toast.show({
          type: "success",
          text1: "Registration successful",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Registration failed",
          text2: response.message,
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Registration failed",
        text2: (error as Error).message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FlexBox backgroundColor={"white"} gap={20} flex={1}>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <FlexBox gap={5}>
            <CustomText value="Name" fontSize={16} fontWeight="600" />
            <TextInput
              placeholder="Name"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              mode="outlined"
            />
            {errors.name && (
              <CustomText value="This is required." fontColor="red" />
            )}
          </FlexBox>
        )}
        name="name"
      />

      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <FlexBox gap={5}>
            <CustomText value="Email" fontSize={16} fontWeight="600" />
            <TextInput
              placeholder="Email"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              mode="outlined"
            />
            {errors.name && (
              <CustomText value="This is required." fontColor="red" />
            )}
          </FlexBox>
        )}
        name="email"
      />

      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <FlexBox gap={5}>
            <CustomText value="Role" fontSize={16} fontWeight="600" />
            <View style={{ zIndex: 1000, backgroundColor: "white" }}>
              <Dropdown
                label=""
                placeholder=""
                value={value}
                onSelect={(val: any) => onChange(val)}
                options={USER_ROLES}
                mode="outlined"
              />
            </View>
            {errors.role && (
              <CustomText value="This is required." fontColor="red" />
            )}
          </FlexBox>
        )}
        name="role"
      />

      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <FlexBox gap={5}>
            <CustomText value="Password" fontSize={16} fontWeight="600" />
            <TextInput
              placeholder="Password"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              mode="outlined"
              secureTextEntry
            />
            {errors.name && (
              <CustomText value="This is required." fontColor="red" />
            )}
          </FlexBox>
        )}
        name="password"
      />

      <CustomButton
        disabled={loading}
        onPress={handleSubmit(onSubmit)}
        mode="contained"
      >
        Register
      </CustomButton>

      <FlexBox
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        gap={5}
      >
        <CustomText fontWeight="bold" value="Already have an account?" />
        <Link href="/login">
          <CustomText fontWeight="bold" value=" Login" fontColor="blue" />
        </Link>
      </FlexBox>
    </FlexBox>
  );
}
