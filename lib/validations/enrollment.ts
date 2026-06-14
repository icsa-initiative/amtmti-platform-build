import { z } from 'zod'

export const enrollmentStep1Schema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number'),
})

export const enrollmentStep2Schema = z.object({
  country: z.string().min(1, 'Country is required'),
  region: z.string().min(1, 'Region is required'),
  dateOfBirth: z.string().refine((date) => {
    const d = new Date(date)
    const now = new Date()
    const age = now.getFullYear() - d.getFullYear()
    return age >= 18
  }, 'You must be at least 18 years old'),
  gender: z.enum(['Male', 'Female', 'Prefer Not To Say']).optional(),
})

export const enrollmentStep3Schema = z.object({
  intake: z.enum(['January', 'March', 'May', 'July', 'September', 'November']),
  courseType: z.enum(['Certificate', 'Diploma', 'Artisan', 'Short Course']),
  courseId: z.string().min(1, 'Please select a course'),
  courseName: z.string(),
})

export const fullEnrollmentSchema = enrollmentStep1Schema
  .merge(enrollmentStep2Schema)
  .merge(enrollmentStep3Schema)

export type EnrollmentStep1 = z.infer<typeof enrollmentStep1Schema>
export type EnrollmentStep2 = z.infer<typeof enrollmentStep2Schema>
export type EnrollmentStep3 = z.infer<typeof enrollmentStep3Schema>
export type FullEnrollment = z.infer<typeof fullEnrollmentSchema>
