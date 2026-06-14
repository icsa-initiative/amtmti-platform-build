'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useEnrollmentForm } from '@/hooks/useEnrollmentForm'
import { EnrollmentStep1 } from './enrollment-step-1'
import { EnrollmentStep2 } from './enrollment-step-2'
import { EnrollmentStep3 } from './enrollment-step-3'
import { EnrollmentSuccess } from './enrollment-success'
import { ChevronLeft } from 'lucide-react'
import { toast } from 'sonner'

interface EnrollmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EnrollmentModal({ open, onOpenChange }: EnrollmentModalProps) {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const {
    formData,
    setFormData,
    validateStep,
    courses,
    loadingCourses,
  } = useEnrollmentForm()

  useEffect(() => {
    if (!open) {
      setStep(1)
      setShowSuccess(false)
    }
  }, [open])

  const handleNext = async () => {
    if (!validateStep(step)) {
      toast.error('Please fill in all required fields correctly')
      return
    }
    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      toast.error('Please complete all fields')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/enrollment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Submission failed')
      }

      setShowSuccess(true)
      toast.success('Application submitted successfully!')
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to submit application',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (showSuccess) {
      setStep(1)
      setShowSuccess(false)
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '+254',
        country: 'Kenya',
        region: '',
        dateOfBirth: '',
        gender: undefined,
        intake: 'January',
        courseType: 'Certificate',
        courseId: '',
        courseName: '',
      })
    }
    onOpenChange(false)
  }

  const progressPercentage = showSuccess ? 100 : (step / 3) * 100

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl border-0 p-0">
        <div className="overflow-hidden">
          {/* Progress Bar */}
          <div className="bg-primary p-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-primary-foreground">
                {showSuccess ? 'Complete' : `Step ${step} of 3`}
              </span>
              <span className="text-xs text-primary-foreground/70">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <Progress value={progressPercentage} className="h-1 bg-primary-foreground/20" />
          </div>

          {/* Content */}
          <div className="min-h-[600px] p-8">
            <AnimatePresence mode="wait">
              {showSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <EnrollmentSuccess onClose={handleClose} onStartNew={handleClose} />
                </motion.div>
              ) : (
                <motion.div
                  key={`step-${step}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {step === 1 && (
                    <EnrollmentStep1
                      data={formData}
                      onDataChange={setFormData}
                    />
                  )}
                  {step === 2 && (
                    <EnrollmentStep2
                      data={formData}
                      onDataChange={setFormData}
                    />
                  )}
                  {step === 3 && (
                    <EnrollmentStep3
                      data={formData}
                      onDataChange={setFormData}
                      courses={courses}
                      loadingCourses={loadingCourses}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          {!showSuccess && (
            <div className="flex gap-3 border-t bg-slate-50 p-6">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 1 || isSubmitting}
                className="w-auto"
              >
                <ChevronLeft className="mr-2 size-4" />
                Back
              </Button>
              <div className="flex-1" />
              {step < 3 ? (
                <Button
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="bg-gold text-gold-foreground hover:bg-gold/90"
                >
                  Continue
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-gold text-gold-foreground hover:bg-gold/90"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
