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
import { fetchRooms } from "@/services/rooms";

const HotelDetailsScreen = () => {
  const params = useLocalSearchParams();
  const hotelId = params.id;
  const [hotelData, setHotelData] = React.useState<IHotel | null>(null);
  const [roomsData, setRoomsData] = React.useState<IRoom[]>([]);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const fetchHotelDetails = async () => {
    setLoading(true);
    const response = await fetchHotelById(hotelId as string);
    if (response.success) {
      setHotelData(response.data);
      const roomsResponse: any = await fetchRooms(
        params.id as unknown as number,
      );
      if (roomsResponse.success) {
        setRoomsData(roomsResponse.data);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (hotelId) {
      fetchHotelDetails();
    }
  }, [hotelId]);

  let imageUrl =
    hotelData?.images && hotelData.images.length > 0
      ? hotelData.images[0]
      : null;

  const renderHotelProperty = (
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

        {!loading && !hotelData && (
          <FlexBox justifyContent="center" alignItems="center" flex={1}>
            <CustomText value="Hotel not found" />
          </FlexBox>
        )}

        {!loading && hotelData && (
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
                value={hotelData.name!}
                fontSize={22}
                fontWeight="bold"
                fontColor={PRIMARY_COLOR}
              />
              {renderHotelProperty(
                "",
                "map-marker",
                capitalizeFirstLetter(hotelData.city!),
              )}
            </FlexBox>

            <Divider style={{ marginVertical: 20 }} />

            <FlexBox paddingHorizontal={15} gap={5}>
              {renderHotelProperty(
                "Email: ",
                "email",
                hotelData.email ? hotelData.email : "N/A",
              )}
              {renderHotelProperty(
                "Phone: ",
                "phone",
                hotelData.phone ? hotelData.phone : "N/A",
              )}
              {renderHotelProperty(
                "Location: ",
                "map-marker",
                hotelData.address ? hotelData.address : "N/A",
              )}
            </FlexBox>

            <Divider style={{ marginVertical: 20 }} />

            <FlexBox paddingHorizontal={15} gap={10}>
              <CustomText
                value={hotelData.description!}
                fontSize={14}
                fontColor="#6c6c6c"
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
              {hotelData.amenities?.map((amenity, index) => (
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

            <FlexBox paddingHorizontal={15} paddingVertical={25} gap={10}>
              <CustomText
                value="Select Room"
                fontSize={18}
                fontColor={PRIMARY_COLOR}
                fontWeight="bold"
              />

              {roomsData.length > 0 ? (
                roomsData.map((room: IRoom) => (
                  <TouchableOpacity
                    key={room.id}
                    onPress={() => router.push(`/customer/room/${room.id}`)}
                  >
                    <FlexBox
                      style={{
                        borderRadius: 5,
                        borderWidth: 0.5,
                        borderColor: "#7c7c7c",
                      }}
                      backgroundColor={"#f4f4f4d8"}
                      padding={15}
                      key={room.id}
                      flexDirection="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <FlexBox>
                        <CustomText
                          value={room.name!}
                          fontSize={14}
                          fontWeight="bold"
                        />
                        <CustomText value={capitalizeFirstLetter(room.type!)} />
                      </FlexBox>

                      <FlexBox
                        backgroundColor={PRIMARY_COLOR}
                        padding={5}
                        style={{
                          borderRadius: 5,
                        }}
                        alignItems="center"
                      >
                        <CustomText
                          value={`$${room.rent_per_day}`}
                          fontColor="#fff"
                          fontWeight="bold"
                        />
                      </FlexBox>
                    </FlexBox>
                  </TouchableOpacity>
                ))
              ) : (
                <CustomText
                  value="No rooms available for this hotel."
                  fontSize={14}
                  fontColor="#6c6c6c"
                />
              )}
            </FlexBox>
          </FlexBox>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HotelDetailsScreen;
