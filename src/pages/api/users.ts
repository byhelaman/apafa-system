import type { APIRoute } from "astro";
import { supabase, supabaseClient } from "@/lib/supabase";

export const GET: APIRoute = async ({ }) => {
  const { data, error } = await supabase.from('user_profiles').select('*').neq('role', 'asociado')

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
};

export const DELETE: APIRoute = async ({ request }) => {
  const { user_id } = await request.json();

  const { error } = await supabase.from('user_profiles').delete().eq('user_id', user_id)

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  const { error: errorDeleteUser } = await supabaseClient.auth.admin.deleteUser(
    user_id,)

  if (errorDeleteUser) {
    return new Response(JSON.stringify({ error: errorDeleteUser.message }), { status: 500 });
  }

  return new Response(null, { status: 200 });
}