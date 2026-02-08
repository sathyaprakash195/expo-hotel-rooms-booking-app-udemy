import { supabaseConfig } from "@/config/supabase-config";

export const fetchRooms = async (hotelId: number) => {
  try {
    const { data, error } = await supabaseConfig
      .from("rooms")
      .select("*")
      .eq("hotel_id", hotelId);

    if (error) {
      console.error("Error fetching rooms:", error);
      return { success: false, data: null };
    }
    return { success: true, data };
  } catch (error) {
    console.error("Unexpected error fetching rooms:", error);
    return { success: false, data: null };
  }
};

export const fetchRoomById = async (roomId: number) => {
  try {
    const { data, error } = await supabaseConfig
      .from("rooms")
      .select("*")
      .eq("id", roomId)
      .single();

    if (error) {
      console.error("Error fetching room by ID:", error);
      return { success: false, data: null };
    }
    return { success: true, data };
  } catch (error) {
    console.error("Unexpected error fetching room by ID:", error);
    return { success: false, data: null };
  }
};
