import { defineMiddleware } from "astro:middleware";
import { supabase } from "@/lib/supabase";

const Routes = {
  userRoutes: ["/search", "/members", "/settings"],
  routesAdmin: ["/members", "/settings"]
};

export const onRequest = defineMiddleware(async (context, next) => {
  if (context.url.pathname === "/") {
    return Response.redirect(new URL("/signin", context.url), 302);
  }

  const accessToken = context.cookies.get("sb-access-token")?.value
  const refreshToken = context.cookies.get("sb-refresh-token")?.value

  if (accessToken && refreshToken) {
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase.from("profiles").select("role").eq("user_id", user?.id).single()

    context.locals.isloggin = !!data?.role;
    context.locals.role = data?.role;
  }

  if (context.url.pathname === "/signin" && accessToken && refreshToken) {
    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    })

    if (error) {
      return Response.redirect(new URL("/signout", context.url), 302);
    }

    return Response.redirect(new URL("/search", context.url), 302);
  }

  if (Routes.userRoutes.includes(context.url.pathname) && (!accessToken || !refreshToken)) {
    return Response.redirect(new URL("/signin", context.url), 302);
  }
  if (Routes.routesAdmin.includes(context.url.pathname) && context.locals.role !== "admin") {
    return Response.redirect(new URL("/search", context.url), 302);
  }

  return await next();
});
