import { http, tokenStore } from '../http'

const keepSession = (res) => {
  tokenStore.set(res.data.accessToken)
  return res.data.user
}

export const authService = {
  checkEmail: (email) => http.post('/auth/check-email', { email }).then((r) => r.data.exists),
  login: (payload) => http.post('/auth/login', payload).then(keepSession),
  register: (payload) => http.post('/auth/register', payload).then(keepSession),
  logout: async () => {
    try {
      await http.post('/auth/logout')
    } finally {
      tokenStore.clear()
    }
  },
  forgotPassword: (email) => http.post('/auth/forgot-password', { email }),
  resetPassword: (payload) => http.post('/auth/reset-password', payload).then(keepSession),
  isLoggedIn: () => Boolean(tokenStore.get()),
}
