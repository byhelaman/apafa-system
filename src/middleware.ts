import { defineMiddleware } from "astro:middleware";
import { supabase } from "@/lib/supabase";

export const onRequest = defineMiddleware(async (context, next) => {

  if (context.url.pathname === "/") {
    return Response.redirect(new URL("/signin", context.url), 302);
  }

  const accessToken = context.cookies.get("sb-access-token")?.value
  const refreshToken = context.cookies.get("sb-refresh-token")?.value

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

  const protectedPaths = ["/search", "/members", "/settings"];
  if (protectedPaths.includes(context.url.pathname) && (!accessToken || !refreshToken)) {
    return Response.redirect(new URL("/signin", context.url), 302);
  }

  return await next();
});
