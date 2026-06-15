'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { EnrollmentModal } from './enrollment-modal'

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
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setModalOpen(true)}
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
