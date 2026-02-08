import { View, Text, ScrollView } from "react-native";
import React, { useEffect } from "react";
import { useUsersStore } from "@/store/users-store";
import { getUserBookings } from "@/services/bookings";
import { IBooking } from "@/interfaces";
import FlexBox from "@/components/flexbox";
import TabTitle from "@/components/tab-title";
import BookingCard from "./booking-card";
import CustomText from "@/components/custom-text";

const Bookings = () => {
  const { user } = useUsersStore();
  const [loading, setLoading] = React.useState(false);
  const [bookings, setBookings] = React.useState<IBooking[]>([]);
  const fetchBookings = async () => {
    setLoading(true);
    const response = await getUserBookings(user!.id);
    if (response.success && response.data) {
      setBookings(response.data);
    } else {
      setBookings([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);
  return (
    <ScrollView contentContainerStyle={{ padding: 16, flexGrow: 1 }}>
      <FlexBox>
        <TabTitle
          title="My Bookings"
          caption="View and manage your hotel room bookings"
        />

        {loading && (
          <FlexBox alignItems="center" justifyContent="center" flex={1}>
            <Text>Loading...</Text>
          </FlexBox>
        )}

        {!loading && bookings.length === 0 && (
          <FlexBox
            alignItems="center"
            justifyContent="center"
            flex={1}
            paddingVertical={100}
          >
            <CustomText
              value="No bookings found."
              fontSize={16}
              fontColor="#666"
            />
          </FlexBox>
        )}

        {!loading && bookings.length > 0 && (
          <FlexBox marginVertical={25}>
            {bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </FlexBox>
        )}
      </FlexBox>
    </ScrollView>
  );
};

export default Bookings;
