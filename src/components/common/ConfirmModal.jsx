import React from 'react'
import Modal from './Modal.jsx'
import Button from './Button.jsx'

export default function ConfirmModal({
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  busy = false,
  error = '',
  onConfirm,
  onCancel,
}) {
  return (
    <Modal title={title} onClose={onCancel} maxWidth="max-w-sm">
      <p className="confirmation-message">{message}</p>
      {error && <p role="alert" className="login-error mt-3">{error}</p>}
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" disabled={busy} onClick={onCancel}>{cancelLabel}</Button>
        <Button variant={danger ? 'danger' : 'primary'} disabled={busy} onClick={onConfirm}>{busy ? 'Deleting…' : confirmLabel}</Button>
      </div>
    </Modal>
  )
}
