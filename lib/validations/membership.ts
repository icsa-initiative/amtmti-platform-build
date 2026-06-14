import { z } from 'zod'

export const membershipApplicationSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  country: z.string().min(1, 'Country is required'),
  profession: z.string().min(1, 'Profession is required'),
  membershipTier: z.enum(['Student', 'Affiliate', 'Corporate']),
  reasonForJoining: z.string().min(10, 'Please provide at least 10 characters'),
})

export type MembershipApplication = z.infer<typeof membershipApplicationSchema>
