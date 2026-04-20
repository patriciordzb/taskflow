import { useState, useEffect } from 'react'
import { supabase } from '../supabase.js'
import i18n from '../i18n/index.js'

export function useAuth() {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) fetchProfile(session.user.id)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) fetchProfile(session.user.id)
      else { setProfile(null); setLoading(false) }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId) {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    if (data) {
      setProfile(data)
      i18n.changeLanguage(data.language || 'es')
    }
    setLoading(false)
  }

  const signOut = () => supabase.auth.signOut()

  const trialDaysLeft = () => {
    if (!profile?.trial_ends_at) return 0
    const diff = new Date(profile.trial_ends_at) - new Date()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  return { session, profile, loading, signOut, trialDaysLeft }
}
