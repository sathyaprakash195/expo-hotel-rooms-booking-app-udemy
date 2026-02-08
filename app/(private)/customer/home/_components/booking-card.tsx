import { TouchableOpacity } from "react-native";
import React from "react";
import { IBooking } from "@/interfaces";
import FlexBox from "@/components/flexbox";
import CustomText from "@/components/custom-text";
import { PRIMARY_COLOR } from "@/constants";
import { Icon } from "react-native-paper";
import dayjs from "dayjs";
import { useRouter } from "expo-router";

const BookingCard = ({ booking }: { booking: IBooking }) => {
  const router = useRouter();
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "confirmed":
        return "#4CAF50";
      case "pending":
        return "#FF9800";
      case "cancelled":
        return "#F44336";
      default:
        return PRIMARY_COLOR;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return dayjs(dateString).format("MMM DD, YYYY");
  };

  const hotelName = booking.hotel?.name || "Hotel";
  const roomName = booking.room?.name || "Room";
  const checkInDate = formatDate(booking.check_in_date);
  const checkOutDate = formatDate(booking.check_out_date);
  const totalAmount = booking.total_amount || 0;
  const status = booking.status || "pending";
  const statusColor = getStatusColor(status);

  return (
    <TouchableOpacity
      onPress={() => router.push(`/customer/booking/${booking.id}`)}
    >
      <FlexBox
        style={{
          borderRadius: 5,
          borderWidth: 1,
          borderColor: "#a0a0a0",
          marginBottom: 20,
          overflow: "hidden",
        }}
      >
        {/* Header with Hotel Name and Status */}
        <FlexBox
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          padding={15}
          backgroundColor="#f9f9f9"
        >
          <CustomText
            value={hotelName}
            fontSize={18}
            fontWeight="bold"
            fontColor={PRIMARY_COLOR}
          />
          <FlexBox
            flexDirection="row"
            alignItems="center"
            gap={5}
            style={{
              backgroundColor: statusColor,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 5,
            }}
          >
            <Icon source="check-circle" size={14} color="white" />
            <CustomText
              value={status.charAt(0).toUpperCase() + status.slice(1)}
              fontSize={12}
              fontWeight="bold"
              fontColor="white"
            />
          </FlexBox>
        </FlexBox>

        {/* Room Info */}
        <FlexBox
          flexDirection="row"
          alignItems="center"
          paddingHorizontal={15}
          paddingVertical={12}
          gap={8}
        >
          <Icon source="door" size={20} color={PRIMARY_COLOR} />
          <CustomText
            value={roomName}
            fontSize={14}
            fontWeight="600"
            fontColor="#454444"
          />
        </FlexBox>

        {/* Check-in and Check-out Dates */}
        <FlexBox paddingHorizontal={15} paddingVertical={12} gap={10}>
          <FlexBox flexDirection="row" alignItems="center" gap={8}>
            <Icon source="calendar-check" size={18} color={PRIMARY_COLOR} />
            <CustomText
              value={`Check-in: ${checkInDate}`}
              fontSize={13}
              fontColor="#454444"
            />
          </FlexBox>

          <FlexBox flexDirection="row" alignItems="center" gap={8}>
            <Icon source="calendar-remove" size={18} color={PRIMARY_COLOR} />
            <CustomText
              value={`Check-out: ${checkOutDate}`}
              fontSize={13}
              fontColor="#454444"
            />
          </FlexBox>
        </FlexBox>

        {/* Total Amount */}
        <FlexBox
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          paddingHorizontal={15}
          paddingVertical={12}
          backgroundColor="#fafafa"
        >
          <CustomText
            value="Total Amount"
            fontSize={14}
            fontWeight="600"
            fontColor="#454444"
          />
          <CustomText
            value={`$${totalAmount.toFixed(2)}`}
            fontSize={16}
            fontWeight="bold"
            fontColor={PRIMARY_COLOR}
          />
        </FlexBox>
      </FlexBox>
    </TouchableOpacity>
  );
};

export default BookingCard;
