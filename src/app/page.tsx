import { redirect } from 'next/navigation'

/**
 * Ana sayfa — /login'e server-side yonlendirme yapar.
 */
export default function HomePage() {
  redirect('/login')
}
