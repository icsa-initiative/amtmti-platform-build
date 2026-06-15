'use client'

import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { FullEnrollment } from '@/lib/validations/enrollment'

interface EnrollmentStep4Props {
  data: FullEnrollment
  onDataChange: (data: FullEnrollment) => void
}

const EDUCATION_LEVELS = [
  'Secondary School',
  'Certificate',
  'Diploma',
  "Bachelor's Degree",
  "Master's Degree",
  'Doctorate',
  'Other',
]

const PROFESSIONS = [
  'Pharmacist',
  'Pharmaceutical Technologist',
  'Pharmaceutical Technician',
  'Nurse',
  'Physician',
  'Clinician',
  'Student',
  'Other',
]

const EXPERIENCE_YEARS = ['Less than 1 Year', '1–3 Years', '4–7 Years', '8–15 Years', '15+ Years']

const LEARNING_MODES = ['Online', 'Hybrid', 'In-Person']

export function EnrollmentStep4({ data, onDataChange }: EnrollmentStep4Props) {
  const handleChange = (field: string, value: string) => {
    onDataChange({
      ...data,
      [field]: value,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Professional Information</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Tell us about your background and professional experience.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="highestEducation" className="text-sm font-medium">
            Highest Level of Education <span className="text-red-500">*</span>
          </Label>
          <Select
            value={data.highestEducation || ''}
            onValueChange={(value) => handleChange('highestEducation', value)}
          >
            <SelectTrigger id="highestEducation" className="mt-1.5">
              <SelectValue placeholder="Select education level" />
            </SelectTrigger>
            <SelectContent>
              {EDUCATION_LEVELS.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="currentProfession" className="text-sm font-medium">
            Current Profession <span className="text-red-500">*</span>
          </Label>
          <Select
            value={data.currentProfession || ''}
            onValueChange={(value) => handleChange('currentProfession', value)}
          >
            <SelectTrigger id="currentProfession" className="mt-1.5">
              <SelectValue placeholder="Select profession" />
            </SelectTrigger>
            <SelectContent>
              {PROFESSIONS.map((profession) => (
                <SelectItem key={profession} value={profession}>
                  {profession}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="employer" className="text-sm font-medium">
            Current Employer / Institution <span className="text-red-500">*</span>
          </Label>
          <Input
            id="employer"
            placeholder="Enter your employer or institution name"
            value={data.employer || ''}
            onChange={(e) => handleChange('employer', e.target.value)}
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="yearsOfExperience" className="text-sm font-medium">
            Years of Experience <span className="text-red-500">*</span>
          </Label>
          <Select
            value={data.yearsOfExperience || ''}
            onValueChange={(value) => handleChange('yearsOfExperience', value)}
          >
            <SelectTrigger id="yearsOfExperience" className="mt-1.5">
              <SelectValue placeholder="Select experience level" />
            </SelectTrigger>
            <SelectContent>
              {EXPERIENCE_YEARS.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="preferredLearningMode" className="text-sm font-medium">
            Preferred Learning Mode <span className="text-red-500">*</span>
          </Label>
          <Select
            value={data.preferredLearningMode || ''}
            onValueChange={(value) => handleChange('preferredLearningMode', value)}
          >
            <SelectTrigger id="preferredLearningMode" className="mt-1.5">
              <SelectValue placeholder="Select learning mode" />
            </SelectTrigger>
            <SelectContent>
              {LEARNING_MODES.map((mode) => (
                <SelectItem key={mode} value={mode}>
                  {mode}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="interestReason" className="text-sm font-medium">
            Why Are You Interested In This Program? <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="interestReason"
            placeholder="Share your motivation for joining this program..."
            value={data.interestReason || ''}
            onChange={(e) => handleChange('interestReason', e.target.value)}
            className="mt-1.5 min-h-32 resize-none"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Minimum 10 characters required
          </p>
        </div>
      </div>
    </div>
  )
}
