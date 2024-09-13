import type { APIRoute } from 'astro'
import { supabase } from '../../../lib/supabase'

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData()
  const email = formData.get('email')?.toString() ?? ''
  const password = formData.get('password')?.toString() ?? ''

  // const code = formData.get("code")?.toString() ?? ''
  // const dni = formData.get("dni")?.toString() ?? ''

  const { data, error: errorSigIn } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (errorSigIn) {
    return new Response(
      JSON.stringify({
        message: 'Ha habido un problema con su solicitud.',
        redirect: '/signout',
      }),
      { status: errorSigIn.status }
    )
  }

  const { access_token, refresh_token } = data.session

  const { error: errorSession } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  })

  if (errorSession) {
    return new Response(
      JSON.stringify({
        message: 'Ha habido un problema con su solicitud.',
        redirect: '/signout',
      }),
      { status: errorSession.status }
    )
  }

  cookies.set('sb-access-token', access_token, {
    path: '/',
    secure: true,
    httpOnly: true,
  })
  cookies.set('sb-refresh-token', refresh_token, {
    path: '/',
    secure: true,
    httpOnly: true,
  })

  return new Response(
    JSON.stringify({ message: 'Ingresando...', redirect: '/home' }),
    { status: 200 }
  )
}
