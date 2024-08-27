import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData.entries())
  const children_data = JSON.parse(formData.get("children_data")?.toString() || "[]")

  data.children_data = children_data

  // console.log();

  // const { error } = await supabase.auth.signUp({
  //   email,
  //   password,
  // });

  // if (error) {
  //   return new Response(error.message, { status: 500 });
  // }

  return new Response(JSON.stringify(data), { status: 200 });
  // return new Response(JSON.stringify(Object.fromEntries(formData.entries())), { status: 200 });

  return redirect("/signin");
};