import type { APIRoute } from 'astro'
import { supabase } from '@/lib/supabase'

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData()
  const data = Object.fromEntries(formData.entries())
  const children_data = JSON.parse(
    formData.get('children_data')?.toString() || '[]'
  )

  data.children_data = children_data

  const { error } = await supabase.from('temp_data').insert({
    identity_card: data.identity_card,
    names: data.names,
    last_names: data.last_names,
    dob: data.dob,
    phone: data.phone,
    email: data.email,
    address: data.address,
    education_level: data.education_level,
    occupation: data.occupation,
    marital_status: data.marital_status,
    children: children_data,
  })

  if (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
        code: error.code,
        message: 'Error al insertar datos',
      }),
      {
        status: 400,
      }
    )
  }

  return new Response(JSON.stringify({ message: 'Success... 🥳' }), {
    status: 200,
  })
}
