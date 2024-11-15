import type { APIRoute, APIContext } from 'astro'
import { supabase } from '@/lib/supabase'

export const GET: APIRoute = async ({ locals }: APIContext) => {

  const { data, error } = await supabase.from('activities').select('*')

  if (error) return new Response(JSON.stringify({ message: error.message }), { status: 500 })

  return new Response(JSON.stringify(data), { status: 200 })
}

export const DELETE: APIRoute = async ({ request }) => {
  const { activity_id } = await request.json();

  const { error } = await supabase.from('activities').delete().eq('activity_id', activity_id)

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(null, { status: 200 });
}

export const PATCH: APIRoute = async ({ request }) => {
  const { activity_id, ...updatedFields } = await request.json();

  const { data, error } = await supabase
    .from('activities')
    .update(updatedFields)
    .eq('activity_id', activity_id)
    .select()

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  if (data && data.length > 0) {
    return new Response(JSON.stringify(data[0]), { status: 200 });
  } else {
    return new Response(JSON.stringify({ error: 'Activity not found' }), { status: 404 });
  }
}

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData()

  const data = Object.fromEntries(formData.entries())
  // console.log(data);

  const { error } = await supabase.from('activities').insert({
    title: data.title,
    description: data.description,
    location: data.location,
    activity_type: data.activity_type,
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
  return new Response(JSON.stringify({ redirect: '/home', message: 'Success... 🥳' }), {
    status: 200,
  })
}
