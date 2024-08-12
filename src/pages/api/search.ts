import type { APIRoute } from "astro";
import { supabase } from "../../lib/supabase";

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const search = formData.get("search")?.toString();

  if (!search) {
    return new Response(JSON.stringify({ message: "Campo de búsqueda vacío" }), { status: 400 });
  }

  const { data, error } = await supabase
    .rpc('get_filtered_member', {
      p_member_dni: search,
    })

  if (!data.length) {
    return new Response(JSON.stringify({ message: "No se encontraron resultados" }), { status: 404 });
  }

  if (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }

  const [member] = data

  return new Response(JSON.stringify(member), { status: 200 });
}