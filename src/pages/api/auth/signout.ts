import type { APIRoute } from 'astro'
import { supabase } from '@/lib/supabase'

export const GET: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete('sb-access-token', { path: '/' })
  cookies.delete('sb-refresh-token', { path: '/' })

  const { error } = await supabase.auth.signOut()
  if (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: error.status,
    })
  }

  return redirect('/')
}
