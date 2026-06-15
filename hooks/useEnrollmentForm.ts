'use client'

import { useState, useCallback, useEffect } from 'react'
import {
  enrollmentStep1Schema,
  enrollmentStep2Schema,
  enrollmentStep3Schema,
  enrollmentStep4Schema,
  type FullEnrollment,
} from '@/lib/validations/enrollment'

interface Course {
  id: string
  name: string
  course_type: string
  category?: string
  duration?: string
  mode?: string
  fees_ksh?: number
}

const initialFormData: FullEnrollment = {
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
  highestEducation: undefined,
  currentProfession: undefined,
  employer: '',
  yearsOfExperience: undefined,
  interestReason: '',
  preferredLearningMode: undefined,
}

export function useEnrollmentForm() {
  const [formData, setFormData] = useState<FullEnrollment>(initialFormData)
  const [courses, setCourses] = useState<Course[]>([])
  const [loadingCourses, setLoadingCourses] = useState(false)

  // Load courses when course type changes
  useEffect(() => {
    const loadCourses = async () => {
      setLoadingCourses(true)
      try {
        const response = await fetch(
          `/api/courses?courseType=${encodeURIComponent(formData.courseType)}`,
        )
        if (response.ok) {
          const data = await response.json()
          setCourses(data)
        }
      } catch (error) {
        console.error('Error loading courses:', error)
      } finally {
        setLoadingCourses(false)
      }
    }

    loadCourses()
  }, [formData.courseType])

  const validateStep = useCallback(
    (step: number): boolean => {
      try {
        if (step === 1) {
          enrollmentStep1Schema.parse({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
          })
        } else if (step === 2) {
          enrollmentStep2Schema.parse({
            country: formData.country,
            region: formData.region,
            dateOfBirth: formData.dateOfBirth,
            gender: formData.gender,
          })
        } else if (step === 3) {
          enrollmentStep3Schema.parse({
            intake: formData.intake,
            courseType: formData.courseType,
            courseId: formData.courseId,
            courseName: formData.courseName,
          })
        } else if (step === 4) {
          enrollmentStep4Schema.parse({
            highestEducation: formData.highestEducation,
            currentProfession: formData.currentProfession,
            employer: formData.employer,
            yearsOfExperience: formData.yearsOfExperience,
            interestReason: formData.interestReason,
            preferredLearningMode: formData.preferredLearningMode,
          })
        }
        return true
      } catch {
        return false
      }
    },
    [formData],
  )

  return {
    formData,
    setFormData,
    validateStep,
    courses,
    loadingCourses,
  }
}
