import { useEffect, useRef } from 'react'
import type { MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import * as S from './styles'

interface ConfirmModalProps {
  open: boolean
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  confirmDisabled?: boolean
  cancelDisabled?: boolean
  errorMessage?: string | null
}

const ConfirmModal = ({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  confirmDisabled = false,
  cancelDisabled = false,
  errorMessage,
}: ConfirmModalProps) => {
  const confirmButtonRef = useRef<HTMLButtonElement | null>(null)
  const isBusy = confirmDisabled || cancelDisabled

  useEffect(() => {
    if (!open) {
      return undefined
    }

    const previouslyFocusedElement = document.activeElement as HTMLElement | null
    const originalOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'
    confirmButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isBusy) {
        event.preventDefault()
        onCancel()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = originalOverflow
      previouslyFocusedElement?.focus()
    }
  }, [open, onCancel, isBusy])

  if (typeof document === 'undefined' || !open) {
    return null
  }

  const handleBackdropClick = () => {
    if (!isBusy) {
      onCancel()
    }
  }

  const stopPropagation = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
  }

  return createPortal(
    <S.Backdrop role="presentation" onClick={handleBackdropClick}>
      <S.Dialog
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby={description ? 'confirm-modal-description' : undefined}
        onClick={stopPropagation}
      >
        <S.Title id="confirm-modal-title">{title}</S.Title>
        {description && (
          <S.Description id="confirm-modal-description">{description}</S.Description>
        )}
        {errorMessage && <S.ErrorMessage>{errorMessage}</S.ErrorMessage>}

        <S.Actions>
          <S.Button
            type="button"
            className="cancel"
            onClick={onCancel}
            disabled={cancelDisabled}
          >
            {cancelLabel}
          </S.Button>
          <S.Button
            type="button"
            className="confirm"
            onClick={onConfirm}
            ref={confirmButtonRef}
            disabled={confirmDisabled}
          >
            {confirmLabel}
          </S.Button>
        </S.Actions>
      </S.Dialog>
    </S.Backdrop>,
    document.body
  )
}

export default ConfirmModal
