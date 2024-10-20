import { defineMiddleware } from 'astro:middleware'
import { supabase } from '@/lib/supabase'
import { jwtDecode, type JwtPayload } from 'jwt-decode'

const ROUTES = {
  USER: ['/home', '/members', '/settings'],
  ADMIN: ['/partners', '/members', '/settings', '/api/profiles', '/api/members'],
}

interface DecodedJwtPayload extends JwtPayload {
  user_name: string
  user_role: string
  partner_id: string
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url

  const accessToken = context.cookies.get('sb-access-token')?.value || ''
  const refreshToken = context.cookies.get('sb-refresh-token')?.value

  if (refreshToken) {
    const { error } = await supabase.auth.refreshSession({ refresh_token: refreshToken })
    const jwt: DecodedJwtPayload = jwtDecode<DecodedJwtPayload>(accessToken);

    if (jwt.user_role) {
      context.locals.auth = {
        userName: jwt.user_name,
        partnerId: jwt.partner_id,
        role: jwt.user_role,
      }
    }

    if (error) {
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
