import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData()

  const dni = formData.get('dni')?.toString()
  const code = formData.get('code')?.toString()

  const formatDNI = `DNI${dni}`
  const formatCode = `CR${code}`

  if (!dni) {
    return new Response(JSON.stringify({ message: formatCode }), {
      status: 200,
    })
  }

  return new Response(JSON.stringify({ message: formatDNI }), { status: 200 })
}
