// src/components/RequireAuth.tsx
import type { ReactElement } from "react"
import { Navigate } from "react-router-dom"
import { useAppSelector } from "../../store/hooks"

export const RequireAuth = ({ children }: { children: ReactElement }) => {
  const user = useAppSelector((s) => s.auth.user)
  return user ? children : <Navigate to="/" replace />
}