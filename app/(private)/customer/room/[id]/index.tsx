import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FlexBox from "@/components/flexbox";
import CustomText from "@/components/custom-text";
import { useLocalSearchParams, useRouter } from "expo-router";
import { fetchHotelById } from "@/services/hotels";
import { IHotel, IRoom } from "@/interfaces";
import { capitalizeFirstLetter, PRIMARY_COLOR } from "@/constants";
import { Divider, Icon } from "react-native-paper";
import { fetchRoomById, fetchRooms } from "@/services/rooms";
import AvailabilityCheck from "../_components/availability-check";
import { StripeProvider } from "@stripe/stripe-react-native";

const RoomDetailsScreen = () => {
  const params = useLocalSearchParams();
  const roomId = params.id;
  const [roomData, setRoomData] = React.useState<IRoom | null>(null);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const fetchRoomDetails = async () => {
    setLoading(true);
    // Fetch room details by ID (you need to implement this API call)
    const response: any = await fetchRoomById(params.id as unknown as number);
    if (response.success) {
      setRoomData(response.data);
    }
    setLoading(false);
  };

  const renderRoomProperty = (
    label: string,
    icon: string, // react-native-paper icon name
    value: string,
  ) => {
    return (
      <FlexBox gap={10} flexDirection="row" alignItems="center">
        <Icon source={icon} size={20} color={"#787878"} />
        {/* {label && (
          <CustomText value={`${label}`} fontSize={16} fontColor="#6f6f6f" />
        )} */}
        <CustomText
          value={value}
          fontSize={14}
          fontColor="#787878"
          fontWeight="bold"
        />
      </FlexBox>
    );
  };

  useEffect(() => {
    if (roomId) {
      fetchRoomDetails();
    }
  }, [roomId]);

  let imageUrl =
    roomData?.images && roomData.images.length > 0 ? roomData.images[0] : null;
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >
        {loading && (
          <FlexBox justifyContent="center" alignItems="center" flex={1}>
            <CustomText value="Loading..." />
          </FlexBox>
        )}

        {!loading && !roomData && (
          <FlexBox justifyContent="center" alignItems="center" flex={1}>
            <CustomText value="Room not found" />
          </FlexBox>
        )}

        {!loading && roomData && (
          <FlexBox
            flex={1}
            style={{
              backgroundColor: "#fff",
              paddingBottom: 70,
            }}
          >
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 10,
                left: 10,
                zIndex: 10,
                backgroundColor: "#a9a9a9",
                padding: 5,
                borderRadius: 20,
              }}
              onPress={() => router.back()}
            >
              <View>
                <Icon source="arrow-left" size={24} color={"white"} />
              </View>
            </TouchableOpacity>
            <Image
              source={{ uri: imageUrl! }}
              style={{
                width: "100%",
                height: 230,
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
              }}
              resizeMode="cover"
            />

            <FlexBox
              style={{
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                marginTop: -30,
                backgroundColor: "#fff",
              }}
              padding={20}
              backgroundColor={"#fff"}
              gap={4}
            >
              <CustomText
                value={roomData.name!}
                fontSize={22}
                fontWeight="bold"
                fontColor={PRIMARY_COLOR}
              />
              {renderRoomProperty(
                "",
                "map-marker",
                capitalizeFirstLetter(roomData.type!),
              )}
            </FlexBox>

            <Divider style={{ marginVertical: 20 }} />

            <FlexBox paddingHorizontal={15} gap={10}>
              <CustomText
                value={roomData.description!}
                fontSize={14}
                fontColor="#6c6c6c"
                fontWeight="bold"
              />
            </FlexBox>

            <Divider style={{ marginVertical: 20 }} />

            <FlexBox
              paddingVertical={10}
              backgroundColor={"#cccccc87"}
              paddingHorizontal={15}
              style={{
                borderRadius: 5,
              }}
              marginHorizontal={15}
            >
              <CustomText value="Rent per day" />
              <CustomText
                value={`$ ${roomData.rent_per_day}`}
                fontSize={25}
                fontColor={PRIMARY_COLOR}
                fontWeight="bold"
              />
            </FlexBox>

            <Divider style={{ marginVertical: 20 }} />

            <FlexBox paddingHorizontal={15} paddingVertical={15} gap={10}>
              <CustomText
                value="Amenities"
                fontSize={18}
                fontColor={PRIMARY_COLOR}
                fontWeight="bold"
              />
            </FlexBox>
            <FlexBox
              flexWrap="wrap"
              flexDirection="row"
              paddingHorizontal={15}
              gap={10}
            >
              {roomData.amenities?.map((amenity, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#e8e7e7",
                    borderWidth: 0.5,
                    borderColor: PRIMARY_COLOR,
                    borderRadius: 5,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                  }}
                >
                  <CustomText
                    key={index}
                    value={`• ${capitalizeFirstLetter(amenity)}`}
                    fontSize={12}
                    fontColor={PRIMARY_COLOR}
                  />
                </View>
              ))}
            </FlexBox>

            <FlexBox
              marginVertical={20}
              paddingHorizontal={15}
              paddingVertical={15}
              gap={10}
            >
              <CustomText
                value="Select Dates"
                fontSize={20}
                fontColor={PRIMARY_COLOR}
                fontWeight="bold"
              />
              <StripeProvider
                publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
              >
                <AvailabilityCheck room={roomData} />
              </StripeProvider>
            </FlexBox>
          </FlexBox>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default RoomDetailsScreen;
