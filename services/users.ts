import { supabaseConfig } from "@/config/supabase-config";
import { IUser } from "@/interfaces";

export const registerUser = async (payload: Partial<IUser>) => {
  try {
    // step 1 : create authentication record
    const authResponse = await supabaseConfig.auth.signUp({
      email: payload.email || "",
      password: payload.password || "",
    });
    if (authResponse.error) {
      throw authResponse.error;
    }
    // step 2 : insert user profile in database
    const dbResponse = await supabaseConfig.from("user_profiles").insert([
      {
        name: payload.name,
        email: payload.email,
        role: payload.role || "customer",
        is_active: payload.role === "customer" ? true : false,
        profile_picture: "",
      },
    ]);
    if (dbResponse.error) {
      throw dbResponse.error;
    }
    // step 3 : return success response
    return {
      success: true,
      message: "User registered successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || "Registration failed",
    };
  }
};

export const loginUser = async (payload: Partial<IUser>) => {
  try {
    // step 1 : authenticate user
    const authResponse = await supabaseConfig.auth.signInWithPassword({
      email: payload.email || "",
      password: payload.password || "",
    });
    if (authResponse.error) {
      throw authResponse.error;
    }

    const user = authResponse.data.user;
    const email = user?.email;

    // step 2 : fetch full user profile from database
    const dbResponse = await supabaseConfig
      .from("user_profiles")
      .select("*")
      .eq("email", email)
      .single();
    if (dbResponse.error) {
      throw dbResponse.error;
    }

    // step 3 : return success response
    return {
      success: true,
      message: "Login successful",
      data: dbResponse.data,
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || "Login failed",
    };
  }
};

export const getLoggedInUser = async () => {
  try {
    const sessionResponse = await supabaseConfig.auth.getSession();
    if (sessionResponse.error) {
      throw sessionResponse.error;
    }
    const user = sessionResponse.data.session?.user;
    const email = user?.email;

    const dbResponse = await supabaseConfig
      .from("user_profiles")
      .select("*")
      .eq("email", email)
      .single();

    if (dbResponse.error) {
      throw dbResponse.error;
    }

    return {
      success: true,
      message: "Logged in user fetched successfully",
      data: dbResponse.data,
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || "Failed to fetch logged in user",
    };
  }
};

export const updateUserProfilePicture = async (
  userId: string,
  image: string,
) => {
  try {
    // step 1 : convert the image to file / blob object (VVIP step in React Native)
    const response = await fetch(image);
    const blob = await response.blob();
    const arrayBuffer = await new Response(blob).arrayBuffer();

    const uniqueFileName = `profile_pictures/${userId}_${Date.now()}.jpg`;
    const { data, error: uploadError } = await supabaseConfig.storage
      .from("main")
      .upload(uniqueFileName, arrayBuffer);

    if (uploadError) {
      throw uploadError;
    }

    const { data: publicURLData } = supabaseConfig.storage
      .from("main")
      .getPublicUrl(uniqueFileName);
    const publicURL = publicURLData.publicUrl;

    const { error: updateError } = await supabaseConfig
      .from("user_profiles")
      .update({ profile_picture: publicURL })
      .eq("id", userId);

    if (updateError) {
      throw updateError;
    }

    return {
      success: true,
      message: "Profile picture updated successfully",
      data: publicURL,
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || "Failed to update profile picture",
    };
  }
};
