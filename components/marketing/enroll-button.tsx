'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { EnrollmentModal } from './enrollment-modal'
import { createClient } from '@/lib/supabase/client'

import type { Program } from '@/lib/programs-data'

interface EnrollButtonProps {
  className?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  program?: Program
}

export function EnrollButton({
  className,
  variant = 'default',
  size = 'default',
  program,
}: EnrollButtonProps) {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const [user, setUser] = useState<any | null | undefined>(undefined)
  const [autoOpened, setAutoOpened] = useState(false)

  const programRedirect = program
    ? `/programs/${program.slug}?enroll=true`
    : '/programs'
  const loginUrl = `/login?redirect=${encodeURIComponent(programRedirect)}`

  useEffect(() => {
    const loadUser = async () => {
      const supabase = createClient()
      const { data } = await supabase.auth.getUser()
      setUser(data.user ?? null)
    }

    loadUser().catch(() => setUser(null))
  }, [])

  useEffect(() => {
    if (!program || autoOpened) {
      return
    }

    const params = new URLSearchParams(window.location.search)
    if (params.get('enroll') !== 'true') {
      return
    }

    if (user === undefined) {
      return
    }

    if (!user) {
      router.push(loginUrl)
      return
    }

    setModalOpen(true)
    setAutoOpened(true)
  }, [program, user, router, loginUrl, autoOpened])

  const handleEnrollClick = async () => {
    if (user === undefined) {
      const supabase = createClient()
      const { data } = await supabase.auth.getUser()
      const currentUser = data.user
      setUser(currentUser ?? null)

      if (!currentUser) {
        router.push(loginUrl)
        return
      }

      setModalOpen(true)
      return
    }

    if (!user) {
      router.push(loginUrl)
      return
    }

    setModalOpen(true)
  }

  return (
    <>
      <Button
        onClick={handleEnrollClick}
        className={className}
        variant={variant}
        size={size}
      >
        Enroll Now
      </Button>
      <EnrollmentModal open={modalOpen} onOpenChange={setModalOpen} initialProgram={program} />
    </>
  )
}
