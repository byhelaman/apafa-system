import type { APIRoute, APIContext } from 'astro'
import { supabase } from '@/lib/supabase'

export const GET: APIRoute = async ({ locals }: APIContext) => {
  const { role, partnerId } = locals.auth

  if (role !== 'admin') {

    const { data, error } = await supabase.rpc('get_filtered_partner', {
      p_partner_id: partnerId
    }).single()

    if (error) return new Response(JSON.stringify({ message: error.message }), { status: 500 })

    return new Response(JSON.stringify(data), { status: 200 })

  }

  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase.from('user_profiles').select('*').neq('user_id', user?.id)

  if (error) return new Response(JSON.stringify({ message: error.message }), { status: 500 })

  return new Response(JSON.stringify(data), { status: 200 })
}

