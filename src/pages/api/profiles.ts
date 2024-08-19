import type { APIRoute } from "astro";
import { supabase } from "@/lib/supabase";

export const GET: APIRoute = async () => {
  const { data, error } = await supabase.from('profiles').select('*').order('role', { ascending: true });

  if (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
};