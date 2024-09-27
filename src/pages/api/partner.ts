import type { APIRoute, APIContext } from 'astro'
import { supabase } from '@/lib/supabase'

export const GET: APIRoute = async ({ locals }: APIContext) => {
  const { partnerId } = locals.auth

  const { data, error } = await supabase.rpc('get_filtered_partner', {
    p_partner_id: partnerId
  }).single()

  if (error) return new Response(JSON.stringify({ message: error.message }), { status: 500 })

  return new Response(JSON.stringify([data]), { status: 200 })

  // const { data: { user } } = await supabase.auth.getUser()
  // const { data, error } = await supabase.from('user_profiles').select('*').neq('user_id', user?.id)

  // const { data, error } = await supabase.from('temp_data').select('*')
  // if (error) return new Response(JSON.stringify({ message: error.message }), { status: 500 })

  // return new Response(JSON.stringify(data), { status: 200 })
}

