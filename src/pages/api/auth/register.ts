import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  // console.log();

  // const { error } = await supabase.auth.signUp({
  //   email,
  //   password,
  // });

  // if (error) {
  //   return new Response(error.message, { status: 500 });
  // }
  return new Response(JSON.stringify(Object.fromEntries(formData.entries())), { status: 200 });

  return redirect("/signin");
};