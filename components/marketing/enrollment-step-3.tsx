'use client'

import { useEffect } from 'react'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { FullEnrollment } from '@/lib/validations/enrollment'

interface Course {
  id: string
  name: string
  course_type: string
}

interface EnrollmentStep3Props {
  data: FullEnrollment
  onDataChange: (data: FullEnrollment) => void
  courses: Course[]
  loadingCourses: boolean
}

const INTAKES = ['January', 'March', 'May', 'July', 'September', 'November']
const COURSE_TYPES = ['Certificate', 'Diploma', 'Artisan', 'Short Course']

export function EnrollmentStep3({
  data,
  onDataChange,
  courses,
  loadingCourses,
}: EnrollmentStep3Props) {
  const handleChange = (field: string, value: string) => {
    onDataChange({
      ...data,
      [field]: value,
    })
  }

  // Reset course selection when course type changes
  useEffect(() => {
    handleChange('courseId', '')
    handleChange('courseName', '')
  }, [data.courseType])

  const filteredCourses = courses.filter((course) => course.course_type === data.courseType)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Fill Course Details</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Select the intake period and course that matches your goals.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="intake" className="text-sm font-medium">
            Intake <span className="text-red-500">*</span>
          </Label>
          <Select value={data.intake} onValueChange={(value) => handleChange('intake', value)}>
            <SelectTrigger id="intake" className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {INTAKES.map((intake) => (
                <SelectItem key={intake} value={intake}>
                  {intake}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="courseType" className="text-sm font-medium">
            Course Type <span className="text-red-500">*</span>
          </Label>
          <Select
            value={data.courseType}
            onValueChange={(value) => handleChange('courseType', value)}
          >
            <SelectTrigger id="courseType" className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COURSE_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="course" className="text-sm font-medium">
            Course <span className="text-red-500">*</span>
          </Label>
          <Select
            value={data.courseId}
            onValueChange={(value) => {
              const selectedCourse = courses.find((c) => c.id === value)
              handleChange('courseId', value)
              if (selectedCourse) {
                handleChange('courseName', selectedCourse.name)
              }
            }}
            disabled={loadingCourses || filteredCourses.length === 0}
          >
            <SelectTrigger id="course" className="mt-1.5">
              <SelectValue
                placeholder={
                  loadingCourses
                    ? 'Loading courses...'
                    : filteredCourses.length === 0
                      ? 'No courses available'
                      : 'Select course'
                }
              />
            </SelectTrigger>
            <SelectContent>
              {filteredCourses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
