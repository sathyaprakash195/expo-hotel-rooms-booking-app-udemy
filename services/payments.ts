import { supabaseConfig } from "@/config/supabase-config";

export const callStripeBackend = async (amount: number) => {
  try {
    const response = await supabaseConfig.functions.invoke("stripe-backend", {
      body: JSON.stringify({ amount }),
    });
    if (response.error) {
      console.error("Error calling Stripe backend:", response.error);
      throw new Error(response.error.message);
    }

    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};
