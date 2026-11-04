import { create } from 'zustand'

let toastSeq = 0

/**
 * State giao diện toàn cục (không phải dữ liệu server):
 * modal đăng nhập, panel adiClub, modal "added to bag", toast.
 */
export const useUI = create((set, get) => ({
  /* Auth modal: step = 'email' | 'login' | 'register' | 'forgot' | 'forgot-sent' */
  auth: { open: false, step: 'email', email: '', onSuccess: null },
  openAuth: (opts = {}) => set({ auth: { open: true, step: 'email', email: '', onSuccess: null, ...opts } }),
  setAuth: (patch) => set((s) => ({ auth: { ...s.auth, ...patch } })),
  closeAuth: () => set((s) => ({ auth: { ...s.auth, open: false, onSuccess: null } })),

  /* adiClub drawer */
  clubOpen: false,
  openClub: () => set({ clubOpen: true }),
  closeClub: () => set({ clubOpen: false }),

  /* Added to bag modal: { item, cart } */
  addedToBag: null,
  showAddedToBag: (payload) => set({ addedToBag: payload }),
  hideAddedToBag: () => set({ addedToBag: null }),

  /* Toasts */
  toasts: [],
  toast: (message, tone = 'info') => {
    const id = ++toastSeq
    set((s) => ({ toasts: [...s.toasts, { id, message, tone }] }))
    setTimeout(() => get().dismissToast(id), 3500)
  },
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))
