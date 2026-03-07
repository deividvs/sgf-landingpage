import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface HotmartWebhookPayload {
  id: string;
  event: string;
  version: string;
  date_created: number;
  data: {
    product: {
      id: number;
      name: string;
    };
    buyer: {
      email: string;
      name: string;
    };
    purchase: {
      transaction: string;
      status: string;
      approved_date?: number;
      order_date: number;
      price: {
        value: number;
        currency_code: string;
      };
    };
    subscription?: {
      subscriber_code: string;
      status: string;
    };
  };
  hottok: string;
}

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
    const expectedHottok = Deno.env.get("HOTMART_HOTTOK");

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const payload: HotmartWebhookPayload = await req.json();

    console.log("Hotmart webhook received:", {
      event: payload.event,
      transaction: payload.data.purchase.transaction,
      status: payload.data.purchase.status,
    });

    if (expectedHottok && payload.hottok !== expectedHottok) {
      console.error("Invalid Hottok received");
      return new Response(
        JSON.stringify({ error: "Invalid authentication token" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const transactionId = payload.data.purchase.transaction;
    const buyerEmail = payload.data.buyer.email.toLowerCase().trim();
    const buyerName = payload.data.buyer.name;
    const productId = payload.data.product.id.toString();
    const status = payload.data.purchase.status.toLowerCase();
    const amount = payload.data.purchase.price.value;
    const currency = payload.data.purchase.price.currency_code;
    const purchaseDate = new Date(payload.data.purchase.order_date);
    const subscriptionId = payload.data.subscription?.subscriber_code;

    const { error: purchaseError } = await supabase
      .from("hotmart_purchases")
      .upsert(
        {
          transaction_id: transactionId,
          buyer_email: buyerEmail,
          buyer_name: buyerName,
          product_id: productId,
          status,
          purchase_date: purchaseDate.toISOString(),
          amount,
          currency,
          subscription_id: subscriptionId,
          webhook_payload: payload,
        },
        { onConflict: "transaction_id" }
      );

    if (purchaseError) {
      console.error("Error saving purchase:", purchaseError);
      throw purchaseError;
    }

    console.log("Purchase saved successfully");

    if (status === "approved" || status === "completed") {
      const { data: userData, error: userError } = await supabase.auth.admin.listUsers();

      if (userError) {
        console.error("Error listing users:", userError);
        throw userError;
      }

      let userId: string | null = null;
      const existingUser = userData.users.find(
        (u) => u.email?.toLowerCase() === buyerEmail
      );

      if (existingUser) {
        userId = existingUser.id;
        console.log("User found:", userId);
      } else {
        const tempPassword = crypto.randomUUID();
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          email: buyerEmail,
          password: tempPassword,
          email_confirm: true,
          user_metadata: {
            name: buyerName,
            created_by_hotmart: true,
          },
        });

        if (createError) {
          console.error("Error creating user:", createError);
          throw createError;
        }

        userId = newUser.user.id;
        console.log("New user created:", userId);
      }

      if (userId) {
        const { error: subscriptionError } = await supabase
          .from("user_subscriptions")
          .upsert(
            {
              user_id: userId,
              hotmart_transaction_id: transactionId,
              subscription_status: "active",
              started_at: new Date().toISOString(),
              expires_at: null,
            },
            { onConflict: "user_id" }
          );

        if (subscriptionError) {
          console.error("Error saving subscription:", subscriptionError);
          throw subscriptionError;
        }

        console.log("Subscription activated for user:", userId);
      }
    } else if (
      status === "canceled" ||
      status === "refunded" ||
      status === "chargeback"
    ) {
      const { data: userData } = await supabase.auth.admin.listUsers();
      const user = userData?.users.find((u) => u.email?.toLowerCase() === buyerEmail);

      if (user) {
        const { error: cancelError } = await supabase
          .from("user_subscriptions")
          .update({
            subscription_status: "cancelled",
            cancelled_at: new Date().toISOString(),
          })
          .eq("user_id", user.id);

        if (cancelError) {
          console.error("Error cancelling subscription:", cancelError);
        } else {
          console.log("Subscription cancelled for user:", user.id);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Webhook processed successfully",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
