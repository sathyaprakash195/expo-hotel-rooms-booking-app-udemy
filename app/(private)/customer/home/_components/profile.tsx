import { View, Text, Image, Alert } from "react-native";
import React, { useState } from "react";
import CustomButton from "@/components/custom-button";
import CustomText from "@/components/custom-text";
import FlexBox from "@/components/flexbox";
import { supabaseConfig } from "@/config/supabase-config";
import { useUsersStore } from "@/store/users-store";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import TabTitle from "@/components/tab-title";
import * as ImagePicker from "expo-image-picker";
import { Button } from "react-native-paper";
import { updateUserProfilePicture } from "@/services/users";
const Profile = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { user, setUser } = useUsersStore();
  const router = useRouter();

  const onLogout = async () => {
    try {
      await supabaseConfig.auth.signOut();
      Toast.show({
        type: "success",
        text1: "Logged out successfully",
      });
      router.replace("/(public)/login");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error logging out",
        text2: (error as Error).message,
      });
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library.
    // Manually request permissions for videos on iOS when `allowsEditing` is set to `false`
    // and `videoExportPreset` is `'Passthrough'` (the default), ideally before launching the picker
    // so the app users aren't surprised by a system dialog after picking a video.
    // See "Invoke permissions for videos" sub section for more details.
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Permission to access the media library is required.",
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const onUploadProfilePicture = async () => {
    try {
      setLoading(true);
      const response: any = await updateUserProfilePicture(user!.id, image!);
      if (response.success) {
        Toast.show({
          type: "success",
          text1: "Profile picture updated successfully",
        });
        setUser({ ...user, profile_picture: response.data! } as any);
        setImage(null);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error uploading profile picture",
        text2: (error as Error).message,
      });
    }
  };

  const renderUserPropertyValue = (label: string, value: string) => {
    return (
      <FlexBox>
        <CustomText value={label} fontSize={14} fontWeight="bold" />
        <CustomText value={value} fontSize={16} />
      </FlexBox>
    );
  };

  return (
    <FlexBox padding={20} gap={35} flex={1}>
      <TabTitle title="Profile" caption="Manage your account profile" />

      <FlexBox
        padding={20}
        style={{
          borderWidth: 1,
          borderColor: "#a8a8a8",
          borderRadius: 5,
        }}
      >
        <FlexBox alignItems="center" gap={15}>
          <Image
            source={{ uri: image || user?.profile_picture || undefined }}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
          {!image && (
            <CustomButton mode="outlined" onPress={pickImage}>
              Change Profile Picture
            </CustomButton>
          )}

          {image && (
            <FlexBox flexDirection="row" gap={10}>
              <Button
                onPress={onUploadProfilePicture}
                mode="contained"
                style={{ borderRadius: 5 }}
              >
                Upload
              </Button>
              <Button
                style={{ borderRadius: 5 }}
                mode="outlined"
                onPress={() => setImage(null)}
              >
                Cancel
              </Button>
            </FlexBox>
          )}
        </FlexBox>

        <FlexBox gap={15} paddingVertical={20}>
          {renderUserPropertyValue("Name", user?.name || "")}
          {renderUserPropertyValue("Email", user?.email || "")}
          {renderUserPropertyValue("Role", user?.role || "")}
          {renderUserPropertyValue(
            "Account Created At",
            new Date(user?.created_at || "").toLocaleDateString(),
          )}
        </FlexBox>
      </FlexBox>
      <CustomButton onPress={onLogout}>Logout</CustomButton>
    </FlexBox>
  );
};

export default Profile;
