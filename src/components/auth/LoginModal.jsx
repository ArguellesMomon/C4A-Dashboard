import React, { useState } from 'react'
import Modal from '../common/Modal.jsx'
import Button from '../common/Button.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

export default function LoginModal({ onClose, onSuccess }) {
  const { login } = useAuth()
  const [studentNumber, setStudentNumber] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    let result
    try { result = await login(studentNumber.trim(), password) }
    catch { result = { success: false, message: 'Could not connect. Please try again.' } }
    setSubmitting(false)
    if (!result.success) {
      setError(result.message)
      return
    }
    onSuccess()
  }

  return (
    <Modal title="Officer login" onClose={onClose} maxWidth="max-w-sm">
      <form onSubmit={handleSubmit} className="officer-login-form flex flex-col gap-4">
        <p className="login-help">
          For C4A officers only. Log in to add, edit, or remove events.
        </p>

        {error && (
          <p role="alert" className="login-error">{error}</p>
        )}

        <label className="flex flex-col gap-1 text-sm">
          <span className="login-label">Student number</span>
          <input
            autoFocus
            required
            autoComplete="username"
            value={studentNumber}
            onChange={(e) => setStudentNumber(e.target.value)}
            className="input login-input"
            placeholder="e.g. 12345678"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="login-label">Password</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input login-input"
          />
        </label>

        <Button type="submit" variant="primary" className="w-full justify-center" disabled={submitting}>
          {submitting ? 'Logging in...' : 'Log in'}
        </Button>
      </form>
    </Modal>
  )
}
