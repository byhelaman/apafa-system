import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const dni = formData.get("dni")?.toString() ?? '';
  const formatDNI = `DNI${dni}`

  // call RPC

  return new Response(JSON.stringify({ message: formatDNI }), { status: 200 });
};