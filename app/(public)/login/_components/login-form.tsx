import CustomButton from "@/components/custom-button";
import CustomText from "@/components/custom-text";
import FlexBox from "@/components/flexbox";
import { USER_ROLES } from "@/constants";
import { loginUser } from "@/services/users";
import { useUsersStore } from "@/store/users-store";
import { Link, RelativePathString, useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { TextInput } from "react-native-paper";
import { Dropdown } from "react-native-paper-dropdown";
import Toast from "react-native-toast-message";

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const { setUser } = useUsersStore();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      role: "customer",
      password: "",
    },
  });
  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const response = await loginUser(data);

      if (response.success) {
        Toast.show({
          type: "success",
          text1: "Login successful",
        });
        setUser(response.data);
        const routes = {
          customer: "/(private)/customer/home",
          owner: "/(private)/owner/home",
          admin: "/(private)/admin/home",
        };
        const route = routes[data.role as keyof typeof routes];
        if (route) {
          router.push(route as RelativePathString);
        }
      } else {
        Toast.show({
          type: "error",
          text1: "Login failed",
          text2: response.message,
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "An error occurred",
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
        Login
      </CustomButton>

      <FlexBox
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        gap={5}
      >
        <CustomText fontWeight="bold" value="Don't have an account?" />
        <Link href="/register">
          <CustomText fontWeight="bold" value=" Register" fontColor="blue" />
        </Link>
      </FlexBox>
    </FlexBox>
  );
}
