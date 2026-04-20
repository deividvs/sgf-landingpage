import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { user_id, buyer_email } = await req.json();

    if (!user_id || !buyer_email) {
      return new Response(
        JSON.stringify({ error: "user_id and buyer_email are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { data: purchase, error: purchaseError } = await supabase
      .from("hotmart_purchases")
      .select("*")
      .eq("buyer_email", buyer_email.toLowerCase())
      .eq("status", "approved")
      .maybeSingle();

    if (purchaseError) {
      console.error("Error fetching purchase:", purchaseError);
    }

    const { data: existingSubscription } = await supabase
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", user_id)
      .maybeSingle();

    if (existingSubscription) {
      return new Response(
        JSON.stringify({
          success: true,
          subscription: existingSubscription,
          message: "Subscription already exists"
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const subscriptionData: any = {
      user_id,
      subscription_status: purchase ? "active" : "active",
      started_at: new Date().toISOString(),
      expires_at: null,
    };

    if (purchase) {
      subscriptionData.hotmart_transaction_id = purchase.transaction_id;
    }

    const { data: subscription, error: subscriptionError } = await supabase
      .from("user_subscriptions")
      .insert(subscriptionData)
      .select()
      .single();

    if (subscriptionError) {
      console.error("Error creating subscription:", subscriptionError);
      return new Response(
        JSON.stringify({ error: "Failed to create subscription" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, subscription }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error occurred"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
