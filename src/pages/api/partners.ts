import type { APIRoute, APIContext } from 'astro'
import { supabase } from '@/lib/supabase'

export const GET: APIRoute = async ({ locals }: APIContext) => {
  // const { partnerId } = locals.auth

  // const { data, error } = await supabase.rpc('get_filtered_partner', {
  //   p_partner_id: partnerId
  // }).single()

  // if (error) return new Response(JSON.stringify({ message: error.message }), { status: 500 })

  // return new Response(JSON.stringify([data]), { status: 200 })


  const { data, error } = await supabase.rpc('get_all_partners')

  if (error) return new Response(JSON.stringify({ message: error.message }), { status: 500 })

  return new Response(JSON.stringify(data), { status: 200 })
}

export const DELETE: APIRoute = async ({ request }) => {
  const { partner_id } = await request.json();

  const { error } = await supabase.from('partners').delete().eq('partner_id', partner_id)

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(null, { status: 200 });
}