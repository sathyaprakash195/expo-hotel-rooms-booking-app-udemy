import { supabaseConfig } from "@/config/supabase-config";
import { IBooking } from "@/interfaces";

export const checkRoomAvailability = async (
  datesRequired: string[],
  roomId: string,
) => {
  try {
    const { data: bookings, error } = await supabaseConfig
      .from("bookings")
      .select("*")
      .overlaps("booked_dates", datesRequired)
      .neq("status", "cancelled")
      .eq("room_id", roomId);

    if (error) {
      throw new Error(error.message);
    }

    if (bookings && bookings.length > 0) {
      return {
        success: false,
        message: "Room is not available for the selected dates.",
      };
    }

    return {
      success: true,
      message: "Room is available for the selected dates.",
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const saveBooking = async (bookingData: Partial<IBooking>) => {
  try {
    const { data, error } = await supabaseConfig
      .from("bookings")
      .insert([bookingData])
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return { success: true, data };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};

export const getUserBookings = async (userId: string) => {
  try {
    const { data, error } = await supabaseConfig
      .from("bookings")
      .select("* , room:rooms ( * ) , hotel:hotels ( * )")
      .eq("customer_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }
    return { success: true, data };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};

export const getBookingById = async (bookingId: string) => {
  try {
    const { data, error } = await supabaseConfig
      .from("bookings")
      .select("* , room:rooms ( * ) , hotel:hotels ( * )")
      .eq("id", bookingId)
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return { success: true, data };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};
