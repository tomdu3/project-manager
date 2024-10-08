import { defineMiddleware } from 'astro/middleware'
import { isLoggedIn } from '@lib/auth'

export const onRequest = defineMiddleware(
  async (context, next) => {
    if (!(await isLoggedIn(context.request))) {
      if (context.url.pathname.startsWith('/app/api')) {
        return new Response('Unauthorized', {
          status: 401,
        })
      }

      if (context.url.pathname.startsWith('/app')) {
        return context.redirect('/login')
      }
    }

    return next()
  }
)