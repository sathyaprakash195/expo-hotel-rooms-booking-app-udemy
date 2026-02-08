import { ScrollView, ActivityIndicator } from "react-native";
import React, { useEffect } from "react";
import { useUsersStore } from "@/store/users-store";
import { getUserBookingsReport } from "@/services/reports";
import FlexBox from "@/components/flexbox";
import TabTitle from "@/components/tab-title";
import CustomText from "@/components/custom-text";
import { PRIMARY_COLOR } from "@/constants";
import { Icon } from "react-native-paper";

interface ReportData {
  totalBookings: number;
  upcomingBookings: number;
  pastBookings: number;
  totalAmountSpent: number;
}

const Report = () => {
  const { user } = useUsersStore();
  const [loading, setLoading] = React.useState(false);
  const [report, setReport] = React.useState<ReportData | null>(null);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await getUserBookingsReport(user!.id);
      if (response?.success && response?.report) {
        setReport(response.report);
      }
    } catch (error) {
      console.error("Error fetching report:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchReport();
    }
  }, [user]);

  const ReportCard = ({
    icon,
    label,
    value,
    color,
    caption,
  }: {
    icon: string;
    label: string;
    value: string | number;
    color: string;
    caption?: string;
  }) => (
    <FlexBox
      style={{
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#a0a0a0",
        padding: 25,
        marginBottom: 15,
        backgroundColor: "#f9f9f9",
        minHeight: 140,
      }}
    >
      <FlexBox flexDirection="row" gap={20}>
        <FlexBox flex={1}>
          <CustomText
            value={label}
            fontSize={14}
            fontColor="#333"
            fontWeight="bold"
          />
          {caption && (
            <CustomText
              value={caption}
              fontSize={12}
              fontColor="#555"
              fontWeight="500"
            />
          )}
          <CustomText
            value={String(value)}
            fontSize={28}
            fontWeight="bold"
            fontColor={color}
          />
        </FlexBox>
        <FlexBox
          style={{
            width: 60,
            height: 60,
            borderRadius: 10,
            backgroundColor: color,
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon source={icon} size={28} color="white" />
        </FlexBox>
      </FlexBox>
    </FlexBox>
  );

  return (
    <ScrollView contentContainerStyle={{ padding: 16, flexGrow: 1 }}>
      <FlexBox>
        <TabTitle
          title="My Reports"
          caption="View your booking statistics and spending overview"
        />

        {loading ? (
          <FlexBox
            alignItems="center"
            justifyContent="center"
            flex={1}
            paddingVertical={100}
          >
            <ActivityIndicator size="large" color={PRIMARY_COLOR} />
          </FlexBox>
        ) : report ? (
          <FlexBox marginVertical={25}>
            <ReportCard
              icon="book-multiple"
              label="Total Bookings"
              value={report.totalBookings}
              color={PRIMARY_COLOR}
              caption="All bookings made so far"
            />
            <ReportCard
              icon="calendar-clock"
              label="Upcoming Bookings"
              value={report.upcomingBookings}
              color="#FF9800"
              caption="Bookings yet to come"
            />
            <ReportCard
              icon="history"
              label="Past Bookings"
              value={report.pastBookings}
              color="#4CAF50"
              caption="Completed bookings"
            />
            <ReportCard
              icon="credit-card"
              label="Total Amount Spent"
              value={`$${report.totalAmountSpent.toFixed(2)}`}
              color="#2196F3"
              caption="Total expenditure on bookings"
            />
          </FlexBox>
        ) : (
          <FlexBox
            alignItems="center"
            justifyContent="center"
            flex={1}
            paddingVertical={100}
          >
            <CustomText
              value="No report data available."
              fontSize={16}
              fontColor="#666"
            />
          </FlexBox>
        )}
      </FlexBox>
    </ScrollView>
  );
};

export default Report;
