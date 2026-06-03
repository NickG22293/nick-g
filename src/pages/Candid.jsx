import { useEffect } from 'react'

export default function Candid() {
  useEffect(() => {
    window.location.href = 'https://candid.nick-gordon.com'
  }, [])
  return null
}
