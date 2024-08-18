// Con `output: 'hybrid'` configurado:
// export const prerender = false;

import type { APIRoute } from "astro";
import { supabase } from "../../lib/supabase";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const dni = formData.get("dni")?.toString() ?? '';
  const formatDNI = `DNI${dni}`

  // call RPC

  return new Response(JSON.stringify({ message: formatDNI }), { status: 200 });
};