import type { APIRoute } from 'astro'
import { supabase } from '@/lib/supabase'

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData()
  const inputEmail = formData.get('email')?.toString() || ''
  const inputPassword = formData.get('password')?.toString() || ''
  const inputCode = formData.get('code')?.toString() || ''
  const inputDNI = formData.get('dni')?.toString() || ''

  const email = inputEmail || `${inputCode}@${inputDNI}.com`
  const password = inputPassword || inputDNI

  const { data, error: errorSignIn } = await supabase.auth.signInWithPassword({ email, password })

  if (errorSignIn) {
    return new Response(
      JSON.stringify({
        message: 'There was an issue with your request.',
        redirect: '/'
      }),
      { status: 400 }
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
        message: 'There was an issue with your request.',
        redirect: '/'
      }),
      { status: 400 }
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
    JSON.stringify({
      redirect: '/home'
    }),
    { status: 200 }
  )
}