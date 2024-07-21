// middleware/auth.ts
import { defineNuxtMiddleware } from '#app'

export default defineNuxtMiddleware((context) => {
  const auth = context.$auth

  if (!auth.isAuthenticated()) {
    return context.redirect('/login')
  }
})