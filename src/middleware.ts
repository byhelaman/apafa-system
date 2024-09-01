import { defineMiddleware } from 'astro:middleware'
import { supabase } from '@/lib/supabase'

const ROUTES = {
  USER: ['/search', '/members', '/settings'],
  ADMIN: ['/members', '/settings', '/api/profiles', '/api/members'],
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url

  const accessToken = context.cookies.get('sb-access-token')?.value
  const refreshToken = context.cookies.get('sb-refresh-token')?.value

  if (pathname === '/') {
    return Response.redirect(new URL('/signin', context.url), 302)
  }

  if (refreshToken) {
    const {
      data: { user },
      error,
    } = await supabase.auth.refreshSession({ refresh_token: refreshToken })

    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user?.id)
        .single()

      context.locals.isLoggedIn = !!data?.role
      context.locals.role = data?.role
    }
  }

  if (pathname === '/signin' && accessToken) {
    return Response.redirect(new URL('/search', context.url), 302)
  }

  const isUserRoute = ROUTES.USER.includes(pathname)
  const isAdminRoute = ROUTES.ADMIN.includes(pathname)

  if (isUserRoute && !accessToken) {
    return Response.redirect(new URL('/signin', context.url), 302)
  }

  if (isAdminRoute) {
    if (!accessToken) {
      return Response.redirect(new URL('/signin', context.url), 302)
    }

    if (context.locals.role !== 'admin') {
      return Response.redirect(new URL('/search', context.url), 302)
    }
  }

  return await next()
})
