import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();

  const dni = formData.get("dni")?.toString();
  const input = formData.get("input")?.toString();

  const formatDNI = `DNI${dni}`
  const formatInput = `CR${input}`

  if (!dni) {
    return new Response(JSON.stringify({ message: formatInput }), { status: 200 });
  }

  return new Response(JSON.stringify({ message: formatDNI }), { status: 200 });
}