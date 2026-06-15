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

export const enrollmentStep4Schema = z.object({
  highestEducation: z.enum(['Secondary School', 'Certificate', 'Diploma', 'Bachelor\'s Degree', 'Master\'s Degree', 'Doctorate', 'Other']),
  currentProfession: z.enum(['Pharmacist', 'Pharmaceutical Technologist', 'Pharmaceutical Technician', 'Nurse', 'Physician', 'Clinician', 'Student', 'Other']),
  employer: z.string().min(1, 'Employer / Institution is required'),
  yearsOfExperience: z.enum(['Less than 1 Year', '1–3 Years', '4–7 Years', '8–15 Years', '15+ Years']),
  interestReason: z.string().min(10, 'Please provide at least 10 characters'),
  preferredLearningMode: z.enum(['Online', 'Hybrid', 'In-Person']),
})

export const fullEnrollmentSchema = enrollmentStep1Schema
  .merge(enrollmentStep2Schema)
  .merge(enrollmentStep3Schema)
  .merge(enrollmentStep4Schema)

export type EnrollmentStep1 = z.infer<typeof enrollmentStep1Schema>
export type EnrollmentStep2 = z.infer<typeof enrollmentStep2Schema>
export type EnrollmentStep3 = z.infer<typeof enrollmentStep3Schema>
export type EnrollmentStep4 = z.infer<typeof enrollmentStep4Schema>
export type FullEnrollment = z.infer<typeof fullEnrollmentSchema>
