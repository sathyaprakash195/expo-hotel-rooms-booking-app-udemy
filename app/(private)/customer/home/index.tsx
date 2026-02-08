import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect } from "react";
import { Alert, BackHandler, View } from "react-native";
import { BottomNavigation, Icon } from "react-native-paper";
import Hotels from "./_components/hotels";
import Bookings from "./_components/bookings";
import Report from "./_components/report";
import Profile from "./_components/profile";
import { PRIMARY_COLOR } from "@/constants";
import { Route, useNavigation } from "expo-router";

const CustomerHomePage = () => {
  const [index, setIndex] = React.useState(0);
  const naviagation = useNavigation();
  const tabsData = [
    {
      key: "hotels",
      title: "Hotels",
      focusedIcon: "home-city",
      unfocusedIcon: "home-city-outline",
    },
    {
      key: "bookings",
      title: "Bookings",
      focusedIcon: "format-list-bulleted",
      unfocusedIcon: "format-list-bulleted-type",
    },
    {
      key: "report",
      title: "Report",
      focusedIcon: "chart-box",
      unfocusedIcon: "chart-box-outline",
    },
    {
      key: "profile",
      title: "Profile",
      focusedIcon: "account-circle",
      unfocusedIcon: "account-circle-outline",
    },
  ];

  const renderScene = BottomNavigation.SceneMap({
    hotels: Hotels,
    bookings: Bookings,
    report: Report,
    profile: Profile,
  });

  useEffect(() => {
    // if back is clicked , show the Alert to confim exit the app
    let backHandler: any;

    backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      if (naviagation.isFocused()) {
        Alert.alert("Are you sure you want to exit the app?", "", [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel",
          },
          { text: "YES", onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      }
    });

    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <BottomNavigation
        navigationState={{ index, routes: tabsData }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        barStyle={{
          backgroundColor: "#e9e9e9",
          borderTopColor: "gray",
          borderTopWidth: 0.5,
          zIndex: 100,
        }}
        shifting={true}
        activeColor={PRIMARY_COLOR}
        activeIndicatorStyle={{ backgroundColor: "transparent" }}
      />
    </SafeAreaView>
  );
};

export default CustomerHomePage;
