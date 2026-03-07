import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface CheckEmailRequest {
  email: string;
}

interface CheckEmailResponse {
  eligible: boolean;
  message: string;
  purchaseData?: {
    buyer_name: string;
    product_id: string;
    purchase_date: string;
  };
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
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { email }: CheckEmailRequest = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({
          eligible: false,
          message: "Email é obrigatório",
        } as CheckEmailResponse),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const { data: purchases, error } = await supabase
      .from("hotmart_purchases")
      .select("buyer_name, product_id, purchase_date, status")
      .eq("buyer_email", normalizedEmail)
      .in("status", ["approved", "completed"])
      .order("purchase_date", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Error checking email:", error);
      throw error;
    }

    if (!purchases || purchases.length === 0) {
      return new Response(
        JSON.stringify({
          eligible: false,
          message: "Email não encontrado em nossas compras aprovadas. Use o mesmo email da compra na Hotmart ou adquira o acesso.",
        } as CheckEmailResponse),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const purchase = purchases[0];

    return new Response(
      JSON.stringify({
        eligible: true,
        message: "Email autorizado para cadastro",
        purchaseData: {
          buyer_name: purchase.buyer_name,
          product_id: purchase.product_id,
          purchase_date: purchase.purchase_date,
        },
      } as CheckEmailResponse),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({
        eligible: false,
        message: "Erro ao verificar email. Tente novamente.",
      } as CheckEmailResponse),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
