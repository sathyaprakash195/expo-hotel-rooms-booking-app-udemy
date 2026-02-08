import { View, Text } from "react-native";
import React from "react";
import { IRoom } from "@/interfaces";
import { DatePickerModal } from "react-native-paper-dates";
import FlexBox from "@/components/flexbox";
import CustomButton from "@/components/custom-button";
import dayjs from "dayjs";
import { checkRoomAvailability, saveBooking } from "@/services/bookings";
import CustomText from "@/components/custom-text";
import { callStripeBackend } from "@/services/payments";
import Toast from "react-native-toast-message";
import { useStripe } from "@stripe/stripe-react-native";
import { IUsersState, useUsersStore } from "@/store/users-store";
import { useRouter } from "expo-router";

const AvailabilityCheck = ({ room }: { room: IRoom }) => {
  const [openCheckInDate, setOpenCheckInDate] = React.useState(false);
  const [openCheckOutDate, setOpenCheckOutDate] = React.useState(false);
  const [checkInDate, setCheckInDate] = React.useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = React.useState<Date | null>(null);
  const [availabilityResponse, setAvailabilityResponse] = React.useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [makingPayment, setMakingPayment] = React.useState(false);

  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { user } = useUsersStore() as IUsersState;
  const router = useRouter();

  const onCheckAvailability = async () => {
    setLoading(true);
    const datesRequired: string[] = [];
    for (
      let date = dayjs(checkInDate).startOf("day");
      date.isBefore(dayjs(checkOutDate).startOf("day"));
      date = date.add(1, "day")
    ) {
      datesRequired.push(dayjs(date).format("YYYY-MM-DD"));
    }

    const roomId = room.id.toString();

    const { success, message, error } = await checkRoomAvailability(
      datesRequired,
      roomId,
    );

    if (error) {
      setAvailabilityResponse({ success: false, message: error });
    } else {
      setAvailabilityResponse({ success, message: "Slot available" });
    }

    setLoading(false);
  };

  const totalAmount = React.useMemo(() => {
    if (checkInDate && checkOutDate) {
      const days =
        dayjs(checkOutDate)
          .startOf("day")
          .diff(dayjs(checkInDate).startOf("day"), "day") || 1;
      return (room.rent_per_day || 0) * days;
    }
    return 0;
  }, [checkInDate, checkOutDate, room.rent_per_day]);

  const onMakePayment = async () => {
    try {
      setMakingPayment(true);
      const response: any = await callStripeBackend(totalAmount);
      if (!response.success) {
        Toast.show({
          type: "error",
          text1: "Payment Failed",
          text2: response.error,
        });
        return;
      }
      const data = response.data;
      const initResponse = await initPaymentSheet({
        paymentIntentClientSecret: data.clientSecret,
        merchantDisplayName: "Hotel Booking",
        customerId: data.customer,
        customerEphemeralKeySecret: data.ephemeralKey,
      });

      if (initResponse.error) {
        Toast.show({
          type: "error",
          text1: "Payment Failed",
          text2: initResponse.error.message,
        });
        return;
      }

      const presentResponse = await presentPaymentSheet();

      if (presentResponse.error) {
        Toast.show({
          type: "error",
          text1: "Payment Failed",
          text2: presentResponse.error.message,
        });
        return;
      }

      Toast.show({
        type: "success",
        text1: "Payment Successful",
        text2: "Your room has been booked successfully!",
      });

      // handle the save booking

      const bookingDates = [];
      for (
        let date = dayjs(checkInDate).startOf("day");
        date.isBefore(dayjs(checkOutDate).startOf("day"));
        date = date.add(1, "day")
      ) {
        bookingDates.push(dayjs(date).format("YYYY-MM-DD"));
      }
      const bookingData: any = {
        room_id: room.id,
        hotel_id: room.hotel_id,
        booked_dates: bookingDates,
        check_in_date: dayjs(checkInDate).format("YYYY-MM-DD"),
        check_out_date: dayjs(checkOutDate).format("YYYY-MM-DD"),
        total_amount: totalAmount,
        payment_id: data.paymentIntent,
        status: "confirmed",
        customer_id: user?.id,
        owner_id: room.owner_id,
      };
      const saveResponse = await saveBooking(bookingData);
      if (!saveResponse.success) {
        Toast.show({
          type: "error",
          text1: "Booking Failed",
          text2: saveResponse.error,
        });
        return;
      }
      Toast.show({
        type: "success",
        text1: "Booking Confirmed",
        text2: "Your booking has been confirmed successfully!",
      });
      router.push("/customer/home");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Payment Failed",
        text2:
          "An error occurred while processing your payment. Please try again.",
      });
    } finally {
      setMakingPayment(false);
    }
  };

  return (
    <FlexBox gap={20}>
      <View style={{ flex: 1 }}>
        <CustomButton
          onPress={() => setOpenCheckInDate(true)}
          uppercase={false}
          mode="outlined"
        >
          Check In Date -{" "}
          {checkInDate ? dayjs(checkInDate).format("DD MMM YYYY") : "Select"}
        </CustomButton>
        <DatePickerModal
          locale="en"
          mode="single"
          visible={openCheckInDate}
          onDismiss={() => {
            setOpenCheckInDate(false);
          }}
          date={checkInDate!}
          onConfirm={({ date }: any) => {
            setOpenCheckInDate(false);
            setCheckInDate(date);
          }}
        />
      </View>
      <View style={{ flex: 1 }}>
        <CustomButton
          onPress={() => setOpenCheckOutDate(true)}
          uppercase={false}
          mode="outlined"
        >
          Check Out Date -{" "}
          {checkOutDate ? dayjs(checkOutDate).format("DD MMM YYYY") : "Select"}
        </CustomButton>
        <DatePickerModal
          locale="en"
          mode="single"
          visible={openCheckOutDate}
          onDismiss={() => {
            setOpenCheckOutDate(false);
          }}
          date={checkOutDate!}
          onConfirm={({ date }: any) => {
            setOpenCheckOutDate(false);
            setCheckOutDate(date);
          }}
        />
      </View>

      {availabilityResponse && (
        <FlexBox>
          {availabilityResponse.success ? (
            <FlexBox
              style={{
                backgroundColor: "#d4edda",
                padding: 10,
                borderRadius: 5,
              }}
            >
              <CustomText
                value="Room is available for the selected dates!"
                fontColor="green"
              />
              <CustomText value={`Total Amount: $${totalAmount}`} />
            </FlexBox>
          ) : (
            <Text style={{ color: "red" }}>{availabilityResponse.message}</Text>
          )}
        </FlexBox>
      )}

      {!availabilityResponse && (
        <CustomButton
          disabled={!checkInDate || !checkOutDate || loading}
          onPress={onCheckAvailability}
        >
          Check Availability
        </CustomButton>
      )}

      {availabilityResponse && availabilityResponse.success && (
        <FlexBox gap={25}>
          <CustomButton disabled={makingPayment} onPress={onMakePayment}>
            Make Payment & Book
          </CustomButton>
          <CustomButton
            onPress={() => {
              setCheckInDate(null);
              setCheckOutDate(null);
              setAvailabilityResponse(null);
            }}
            mode="outlined"
          >
            Reset Dates
          </CustomButton>
        </FlexBox>
      )}
    </FlexBox>
  );
};

export default AvailabilityCheck;
