import { View, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FlexBox from "@/components/flexbox";
import CustomText from "@/components/custom-text";
import { useLocalSearchParams, useRouter } from "expo-router";
import { IBooking } from "@/interfaces";
import { PRIMARY_COLOR } from "@/constants";
import { Divider, Icon } from "react-native-paper";
import dayjs from "dayjs";
import { getBookingById } from "@/services/bookings";

const BookingDetailsScreen = () => {
  const params = useLocalSearchParams();
  const bookingId = params.id;
  const [bookingData, setBookingData] = React.useState<IBooking | null>(null);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const fetchBookingDetails = async () => {
    setLoading(true);
    try {
      const response = await getBookingById(bookingId as string);
      if (response.success) {
        setBookingData(response.data);
      }
    } catch (error) {
      console.error("Error fetching booking:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return dayjs(dateString).format("MMM DD, YYYY");
  };

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

  const calculateNights = () => {
    if (bookingData?.check_in_date && bookingData?.check_out_date) {
      const checkIn = dayjs(bookingData.check_in_date);
      const checkOut = dayjs(bookingData.check_out_date);
      return checkOut.diff(checkIn, "day");
    }
    return 0;
  };

  const renderPropertyRow = (label: string, icon: string, value: string) => {
    return (
      <FlexBox gap={10} flexDirection="row" alignItems="center">
        <Icon source={icon} size={20} color={PRIMARY_COLOR} />
        <FlexBox flex={1}>
          <CustomText
            value={label}
            fontSize={12}
            fontColor="#9a9a9a"
            fontWeight="600"
          />
          <CustomText
            value={value}
            fontSize={14}
            fontColor="#454444"
            fontWeight="bold"
          />
        </FlexBox>
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

        {!loading && !bookingData && (
          <FlexBox justifyContent="center" alignItems="center" flex={1}>
            <CustomText value="Booking not found" />
          </FlexBox>
        )}

        {!loading && bookingData && (
          <FlexBox
            flex={1}
            style={{
              backgroundColor: "#fff",
              paddingBottom: 70,
            }}
          >
            {/* Back Button */}
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

            {/* Header Section with Status */}
            <FlexBox
              style={{
                backgroundColor: PRIMARY_COLOR,
                paddingVertical: 50,
              }}
              padding={20}
              gap={15}
            >
              <FlexBox
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <CustomText
                  value="Booking Details"
                  fontSize={22}
                  fontWeight="bold"
                  fontColor="white"
                />
                <FlexBox
                  flexDirection="row"
                  alignItems="center"
                  gap={5}
                  style={{
                    backgroundColor: getStatusColor(bookingData.status),
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 5,
                  }}
                >
                  <Icon
                    source={
                      bookingData.status === "confirmed"
                        ? "check-circle"
                        : "clock-outline"
                    }
                    size={14}
                    color="white"
                  />
                  <CustomText
                    value={
                      bookingData.status
                        ? bookingData.status.charAt(0).toUpperCase() +
                          bookingData.status.slice(1)
                        : "Pending"
                    }
                    fontSize={12}
                    fontWeight="bold"
                    fontColor="white"
                  />
                </FlexBox>
              </FlexBox>
            </FlexBox>

            {/* Hotel & Room Info */}
            <FlexBox
              style={{
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                marginTop: -20,
                backgroundColor: "#fff",
              }}
              padding={20}
              gap={15}
            >
              <CustomText
                value={bookingData.hotel?.name || "Hotel"}
                fontSize={20}
                fontWeight="bold"
                fontColor={PRIMARY_COLOR}
              />

              {renderPropertyRow(
                "Room",
                "door",
                bookingData.room?.name || "N/A",
              )}

              {renderPropertyRow(
                "Room Type",
                "home-outline",
                bookingData.room?.type || "N/A",
              )}
            </FlexBox>

            <Divider style={{ marginVertical: 20 }} />

            {/* Dates Section */}
            <FlexBox paddingHorizontal={20} gap={15}>
              <CustomText
                value="Booking Dates"
                fontSize={16}
                fontWeight="bold"
                fontColor={PRIMARY_COLOR}
              />

              {renderPropertyRow(
                "Check-in",
                "calendar-check",
                formatDate(bookingData.check_in_date),
              )}

              {renderPropertyRow(
                "Check-out",
                "calendar-remove",
                formatDate(bookingData.check_out_date),
              )}

              {renderPropertyRow(
                "Number of Nights",
                "moon-waning-crescent",
                `${calculateNights()} night${calculateNights() !== 1 ? "s" : ""}`,
              )}
            </FlexBox>

            <Divider style={{ marginVertical: 20 }} />

            {/* Pricing Section */}
            <FlexBox paddingHorizontal={20} gap={12}>
              <CustomText
                value="Pricing Details"
                fontSize={16}
                fontWeight="bold"
                fontColor={PRIMARY_COLOR}
              />

              <FlexBox
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                paddingVertical={8}
              >
                <CustomText
                  value={`Per Night Rate`}
                  fontSize={14}
                  fontColor="#6c6c6c"
                />
                <CustomText
                  value={`$${bookingData.room?.rent_per_day || 0}`}
                  fontSize={14}
                  fontWeight="bold"
                  fontColor="#454444"
                />
              </FlexBox>

              <FlexBox
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                paddingVertical={8}
              >
                <CustomText
                  value={`Number of Nights`}
                  fontSize={14}
                  fontColor="#6c6c6c"
                />
                <CustomText
                  value={`${calculateNights()}`}
                  fontSize={14}
                  fontWeight="bold"
                  fontColor="#454444"
                />
              </FlexBox>

              <FlexBox
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                paddingVertical={12}
                style={{
                  borderTopWidth: 1,
                  borderTopColor: "#e8e7e7",
                  borderBottomWidth: 1,
                  borderBottomColor: "#e8e7e7",
                }}
              >
                <CustomText
                  value="Total Amount"
                  fontSize={16}
                  fontWeight="bold"
                  fontColor="#454444"
                />
                <CustomText
                  value={`$${bookingData.total_amount?.toFixed(2) || "0.00"}`}
                  fontSize={18}
                  fontWeight="bold"
                  fontColor={PRIMARY_COLOR}
                />
              </FlexBox>
            </FlexBox>

            <Divider style={{ marginVertical: 20 }} />

            {/* Additional Info */}
            <FlexBox paddingHorizontal={20} gap={12}>
              <CustomText
                value="Additional Information"
                fontSize={16}
                fontWeight="bold"
                fontColor={PRIMARY_COLOR}
              />

              {renderPropertyRow(
                "Booking ID",
                "identifier",
                `#${bookingData.id}`,
              )}

              {renderPropertyRow(
                "Hotel Location",
                "map-marker",
                bookingData.hotel?.address || "N/A",
              )}

              {bookingData.payment_id &&
                renderPropertyRow(
                  "Payment ID",
                  "credit-card",
                  bookingData.payment_id,
                )}
            </FlexBox>
          </FlexBox>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookingDetailsScreen;
