import { useState, useEffect } from 'react'
import { supabase } from '../supabase.js'

export function useWorkspace(session) {
  const [workspace, setWorkspace] = useState(null)
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session) return
    fetchWorkspace()
  }, [session])

  async function fetchWorkspace() {
    setLoading(true)
    const { data, error } = await supabase
      .from('workspace_members')
      .select('workspace_id, role, workspaces(*)')
      .eq('user_id', session.user.id)
      .single()

    if (data?.workspaces) {
      setWorkspace({ ...data.workspaces, role: data.role })
      fetchMembers(data.workspace_id)
    }
    setLoading(false)
  }

  async function fetchMembers(workspaceId) {
    const { data } = await supabase
      .from('workspace_members')
      .select('user_id, role, profiles(full_name)')
      .eq('workspace_id', workspaceId)
    if (data) setMembers(data)
  }

  async function createWorkspace(name) {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now().toString().slice(-4)
    const { data, error } = await supabase
      .from('workspaces')
      .insert({ name, slug, owner_id: session.user.id })
      .select()
      .single()
    if (error) return { error }

    await supabase.from('workspace_members').insert({
      workspace_id: data.id,
      user_id: session.user.id,
      role: 'admin'
    })

    setWorkspace({ ...data, role: 'admin' })
    setMembers([{ user_id: session.user.id, role: 'admin' }])
    return { data }
  }

  async function inviteMember(email) {
    if (!workspace) return { error: 'No workspace' }
    const { data: invitedUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', (await supabase.auth.admin?.getUserByEmail?.(email))?.data?.user?.id)
      .single()

    // For now, use Supabase magic link invite
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        data: { invited_to_workspace: workspace.id }
      }
    })
    return { error }
  }

  return { workspace, members, loading, createWorkspace, inviteMember, refetch: fetchWorkspace }
}
