import { defineMiddleware } from 'astro:middleware'
import { supabase } from '@/lib/supabase'

const ROUTES = {
  USER: ['/home', '/members', '/settings'],
  ADMIN: ['/members', '/settings', '/api/profiles', '/api/members'],
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url

  const accessToken = context.cookies.get('sb-access-token')?.value
  const refreshToken = context.cookies.get('sb-refresh-token')?.value

  if (accessToken && refreshToken) {
    const { data: { user }, error: errorRefreshSession } = await supabase.auth.refreshSession({ refresh_token: refreshToken })

    if (user) {
      context.locals.auth = {
        name: user?.user_metadata?.name,
        role: user?.user_metadata?.app_role,
      }
    }

    if (errorRefreshSession) {
      return new Response(
        JSON.stringify({
          message: 'There was an issue with your request.',
          redirect: '/signout'
        }),
        { status: 400 }
      )
    }
  }

  if (pathname === '/' && accessToken) {
    return Response.redirect(new URL('/home', context.url), 302)
  }

  const isUserRoute = ROUTES.USER.includes(pathname)
  const isAdminRoute = ROUTES.ADMIN.includes(pathname)

  if (isUserRoute) {
    if (!accessToken) {
      return Response.redirect(new URL('/', context.url), 302)
    }
  }

  if (isAdminRoute) {
    if (!accessToken) {
      return Response.redirect(new URL('/', context.url), 302)
    }

    if (context.locals.auth.role !== 'admin') {
      return Response.redirect(new URL('/home', context.url), 302)
    }
  }

  return await next()
})
