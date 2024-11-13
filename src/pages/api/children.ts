import type { APIRoute, APIContext } from 'astro'
import { supabase } from '@/lib/supabase'

export const GET: APIRoute = async ({ locals }: APIContext) => {

  const { data, error } = await supabase.from('students').select('*')

  if (error) return new Response(JSON.stringify({ message: error.message }), { status: 500 })

  return new Response(JSON.stringify(data), { status: 200 })
}