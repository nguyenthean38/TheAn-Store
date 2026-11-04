import { http } from '../http'

const data = (r) => r.data

export const accountService = {
  me: () => http.get('/me').then(data),
  updateMe: (patch) => http.patch('/me', patch).then(data),
  updatePreferences: (patch) => http.patch('/me/preferences', patch).then(data),
  updateSizeProfile: (patch) => http.patch('/me/size-profile', patch).then(data),
  addresses: () => http.get('/me/addresses').then(data),
  createAddress: (addr) => http.post('/me/addresses', addr).then(data),
  updateAddress: (id, patch) => http.patch(`/me/addresses/${id}`, patch).then(data),
  deleteAddress: (id) => http.delete(`/me/addresses/${id}`),
  vouchers: () => http.get('/me/vouchers').then(data),
}
