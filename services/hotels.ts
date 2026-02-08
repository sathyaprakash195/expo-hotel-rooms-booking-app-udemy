import { supabaseConfig } from "@/config/supabase-config";
import { IHotel } from "@/interfaces";

export const fetchActiveHotels = async () => {
  try {
    const { data, error } = await supabaseConfig
      .from("hotels")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false });
    if (error) {
      throw error;
    }
    return {
      success: true,
      data: data as IHotel[],
    };
  } catch (error) {
    return {
      success: false,
      data: [],
    };
  }
};

export const fetchHotelById = async (id: string) => {
  try {
    const { data, error } = await supabaseConfig
      .from("hotels")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      throw error;
    }
    return {
      success: true,
      data: data as IHotel,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
    };
  }
};
