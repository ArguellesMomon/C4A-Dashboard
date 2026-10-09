export function eventErrorMessage(error) {
  const code = error?.code || ''
  const message = String(error?.message || '')
  if (code === 'PGRST205' || code === '42P01') return 'The section noticeboard has not been set up yet. Please contact a section officer.'
  if (error?.status === 401 || error?.status === 403 || code === '42501' || /invalid api key|invalid jwt|jwt expired/i.test(message)) return 'The section event service could not authorize this request. Please contact a section officer.'
  if (error?.name === 'AbortError' || /abort|timeout/i.test(message)) return 'The section event service is taking too long to respond. Please try again.'
  return 'The section event service could not be reached. Please try again shortly. If this continues, contact a section officer.'
}
