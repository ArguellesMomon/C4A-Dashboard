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
    const result = await login(studentNumber, password)
    setSubmitting(false)
    if (!result.success) {
      setError(result.message)
      return
    }
    onSuccess()
  }

  return (
    <Modal title="Officer login" onClose={onClose} maxWidth="max-w-sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <p className="text-sm text-forest-700/70">
          For C4A officers only. Log in to add, edit, or remove events.
        </p>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-forest-800">Student number</span>
          <input
            autoFocus
            value={studentNumber}
            onChange={(e) => setStudentNumber(e.target.value)}
            className="input"
            placeholder="e.g. 12345678"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-forest-800">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
        </label>

        <Button type="submit" variant="primary" className="w-full justify-center" disabled={submitting}>
          {submitting ? 'Logging in...' : 'Log in'}
        </Button>
      </form>
    </Modal>
  )
}
