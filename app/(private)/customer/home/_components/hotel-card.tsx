import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { IHotel } from "@/interfaces";
import FlexBox from "@/components/flexbox";
import CustomText from "@/components/custom-text";
import { capitalizeFirstLetter, PRIMARY_COLOR } from "@/constants";
import { useRouter } from "expo-router";

const HotelCard = ({ hotel }: { hotel: IHotel }) => {
  const router = useRouter();
  let imageUrl =
    hotel.images && hotel.images.length > 0 ? hotel.images[0] : null;

  const first3Amenities = hotel.amenities ? hotel.amenities.slice(0, 3) : [];
  return (
    <TouchableOpacity
      onPress={() => router.push(`/customer/hotel/${hotel.id}`)}
    >
      <FlexBox
        style={{
          borderRadius: 5,
          borderTopRightRadius: 50,
          borderWidth: 1,
          borderColor: "#a0a0a0",
          marginBottom: 30,
        }}
      >
        <Image
          source={{ uri: imageUrl! }}
          style={{
            width: "100%",
            height: 200,
            borderRadius: 5,
            borderTopRightRadius: 50,
          }}
          resizeMode="cover"
        />

        <FlexBox
          flexDirection="row"
          justifyContent="space-between"
          padding={15}
        >
          <CustomText
            value={hotel.name!}
            fontSize={18}
            fontWeight="bold"
            fontColor={PRIMARY_COLOR}
          />
          <CustomText
            value={`$${hotel.starting_rent}/night`}
            fontSize={18}
            fontWeight="bold"
            fontColor={PRIMARY_COLOR}
          />
        </FlexBox>

        <FlexBox paddingHorizontal={15}>
          <CustomText
            value={hotel.address!}
            fontSize={16}
            fontColor="#454444"
            fontWeight="600"
          />

          <FlexBox
            flexWrap="wrap"
            flexDirection="row"
            gap={20}
            marginVertical={20}
          >
            {first3Amenities?.map((amenity, index) => (
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
        </FlexBox>
      </FlexBox>
    </TouchableOpacity>
  );
};

export default HotelCard;
