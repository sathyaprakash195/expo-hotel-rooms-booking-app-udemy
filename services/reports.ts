import { supabaseConfig } from "@/config/supabase-config";

export const getUserBookingsReport = async (userId: string) => {
  try {
    const response = {
      totalBookings: 0,
      upcomingBookings: 0,
      pastBookings: 0,
      totalAmountSpent: 0,
    };

    const { data, error } = await supabaseConfig
      .from("bookings")
      .select("*")
      .eq("customer_id", userId);

    if (error) {
      throw new Error(error.message);
    }

    if (data) {
      const currentDate = new Date();
      response.totalBookings = data.length;

      data.forEach((booking) => {
        const checkInDate = new Date(booking.check_in_date);
        const checkOutDate = new Date(booking.check_out_date);

        if (checkInDate > currentDate) {
          response.upcomingBookings += 1;
        } else if (checkOutDate < currentDate) {
          response.pastBookings += 1;
        }

        response.totalAmountSpent += booking.total_amount || 0;
      });
    }

    return { success: true, report: response };
  } catch (error) {}
};
