import CustomText from "@/components/custom-text";
import FlexBox from "@/components/flexbox";
import { getLoggedInUser } from "@/services/users";
import { useUsersStore } from "@/store/users-store";
import { RelativePathString, useRouter } from "expo-router";
import { useEffect, useState } from "react";

export default function Index() {
  const router = useRouter();
  const { setUser } = useUsersStore();

  const checkSession = async () => {
    try {
      const response = await getLoggedInUser();
      if (response.success) {
        setUser(response.data);
        const routes = {
          customer: "/(private)/customer/home",
          owner: "/(private)/owner/home",
          admin: "/(private)/admin/home",
        };
        const route = routes[response.data.role as keyof typeof routes];
        if (route) {
          router.push(route as RelativePathString);
        }
      } else {
        router.replace("/(public)/login");
      }
    } catch (error) {
      router.replace("/(public)/login");
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <FlexBox
      gap={20}
      paddingHorizontal={20}
      alignItems="center"
      justifyContent="center"
      flex={1}
    >
      <CustomText value="Loading..." fontWeight="bold" />
    </FlexBox>
  );
}
