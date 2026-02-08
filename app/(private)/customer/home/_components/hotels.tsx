import { View, Text, FlatList } from "react-native";
import React, { useEffect } from "react";
import FlexBox from "@/components/flexbox";
import TabTitle from "@/components/tab-title";
import { IHotel } from "@/interfaces";
import { fetchActiveHotels } from "@/services/hotels";
import CustomText from "@/components/custom-text";
import HotelCard from "./hotel-card";
import { useRouter } from "expo-router";

const Hotels = () => {
  const [hotels, setHotels] = React.useState<IHotel[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  const fetchHotels = async () => {
    setLoading(true);
    const response = await fetchActiveHotels();
    setLoading(false);
    if (response.success) {
      setHotels(response.data);
    } else {
      setHotels([]);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);
  return (
    <FlexBox padding={20}>
      <TabTitle
        title="Hotels"
        caption="Browse and book from a variety of hotels"
      />

      {loading && (
        <FlexBox paddingHorizontal={20}>
          <Text>Loading hotels...</Text>
        </FlexBox>
      )}

      {!loading && hotels.length === 0 && (
        <FlexBox paddingHorizontal={20}>
          <CustomText value="No hotels available at the moment." />
        </FlexBox>
      )}

      {!loading && hotels.length > 0 && (
        <FlatList
          data={hotels}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <HotelCard hotel={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100, marginTop: 20 }}
        />
      )}
    </FlexBox>
  );
};

export default Hotels;
