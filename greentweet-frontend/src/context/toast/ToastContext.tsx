import { createContext, useContext, useState } from 'react'
import * as S from './styles'

type Toast = { id: number; message: string }
type ToastValue = {
  toasts: Toast[]
  showToast: (message: string) => void
  removeToast: (id: number) => void
}

const ToastContext = createContext<ToastValue | null>(null)

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = (message: string) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message }])
    setTimeout(() => removeToast(id), 2500)
  }

  const removeToast = (id: number) =>
    setToasts((prev) => prev.filter((t) => t.id !== id))

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <S.ToastContainer>
        {toasts.map((t) => (
          <S.ToastMessage key={t.id}>{t.message}</S.ToastMessage>
        ))}
      </S.ToastContainer>
    </ToastContext.Provider>
  )
}


// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}