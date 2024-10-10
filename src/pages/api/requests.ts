import type { APIRoute } from "astro";
import { supabase } from "@/lib/supabase";

export const GET: APIRoute = async ({ request }) => {
  const { data, error } = await supabase.from('temp_data').select('*')
  return new Response(JSON.stringify(data), { status: 200 });
};

export const POST: APIRoute = async ({ request }) => {
  const { partner_id } = await request.json();

  const { data: { names, last_names, identity_card, partner_id: partnerId }, error: partnerError } = await supabase
    .from('temp_data').select('*')
    .eq('partner_id', partner_id)
    .single()

  const formatName = `${names.split(' ')[0]} ${last_names.split(' ')[0]}`
  const { data: regCode } = await supabase.rpc('generate_code')

  if (partnerError) {
    return new Response(JSON.stringify({ error: partnerError.message }), { status: 500 });
  }

  const { error: errorSignUp } = await supabase.auth.signUp(
    {
      email: `${regCode}@${identity_card}.com`,
      password: `${identity_card}`,
      options: {
        data: {
          name: formatName,
          reg_code: regCode,
          partner_id: partnerId
        }
      }
    }
  )

  if (errorSignUp) {
    return new Response(JSON.stringify({ error: errorSignUp.message }), { status: 500 });
  }

  const { error: processError } = await supabase.rpc('process_temp_data', { p_partner_id: partner_id })

  if (processError) {
    return new Response(JSON.stringify({ error: processError.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ message: `${formatName}: ${regCode}` }), { status: 200 });
}
