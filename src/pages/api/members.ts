import type { APIRoute } from "astro";
import { supabase } from "@/lib/supabase";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '1');

  const { data, error } = await supabase
    .from('members')
    .select('*, states!inner(status)')
    .order('registration_code', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  const processedData = data?.map(member => {
    return {
      ...member,
      states: member.states.length > 0 ? member.states[0] : null
    };
  });

  if (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(processedData), { status: 200 });
};
