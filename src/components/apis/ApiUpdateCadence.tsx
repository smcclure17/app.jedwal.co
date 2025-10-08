import { postTtlUpdate } from '@/data/fetchers'
import { useMutation } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'
import { TimePickerInput } from './TimePickerInternal'
import { Spinner } from '../Spinner'
import { Button } from '@/components/ui/button'
import { Checkmark } from '../Checkmark'

export interface CacheInputProps {
  defaultTtl: number
  accountId: string
  name: string
  isPremiumUser?: boolean
}

export const CacheInput = ({
  defaultTtl,
  accountId,
  name,
}: CacheInputProps) => {
  // Convert seconds to Date object for time picker
  const secondsToDate = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    const date = new Date()
    date.setHours(hours, minutes, secs, 0)
    return date
  }

  const dateToSeconds = (date: Date | undefined) => {
    if (!date) return 0
    return date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds()
  }

  const [timeValue, setTimeValue] = useState<Date | undefined>(() =>
    secondsToDate(defaultTtl),
  )
  const [showSuccess, setShowSuccess] = useState(false)

  const hoursRef = useRef<HTMLInputElement>(null)
  const minutesRef = useRef<HTMLInputElement>(null)
  const secondsRef = useRef<HTMLInputElement>(null)

  const mutation = useMutation({
    mutationFn: (ttl: number) => postTtlUpdate(accountId, name, ttl),
    onSuccess: () => {
      setShowSuccess(true)
    },
    onError: () => {
      alert('Failed to update cache duration')
      setTimeValue(secondsToDate(defaultTtl))
    },
  })

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [showSuccess])

  const handleDateChange = useCallback((newDate: Date | undefined) => {
    setTimeValue(newDate)
  }, [])

  const handleUpdate = () => {
    if (timeValue) {
      const newTtl = dateToSeconds(timeValue)
      mutation.mutate(newTtl)
    }
  }

  const totalSeconds = dateToSeconds(timeValue)
  const hasChanges = totalSeconds !== defaultTtl

  return (
    <div className="flex flex-col space-y-1">
      <span className="text-sm text-gray-700">Refresh data every</span>

      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1">
          <TimePickerInput
            ref={hoursRef}
            picker="hours"
            date={timeValue}
            setDate={handleDateChange}
            onRightFocus={() => minutesRef.current?.focus()}
          />
          <span className="text-gray-500">:</span>

          <TimePickerInput
            ref={minutesRef}
            picker="minutes"
            date={timeValue}
            setDate={handleDateChange}
            onLeftFocus={() => hoursRef.current?.focus()}
            onRightFocus={() => secondsRef.current?.focus()}
          />
          <span className="text-gray-500">:</span>

          <TimePickerInput
            ref={secondsRef}
            picker="seconds"
            date={timeValue}
            setDate={handleDateChange}
            onLeftFocus={() => minutesRef.current?.focus()}
          />
        </div>

        <Button
          variant="ghost"
          onClick={handleUpdate}
          className="border min-w-16"
          disabled={mutation.isPending || !hasChanges}
        >
          {mutation.isPending && <Spinner srText="updating" />}
          {showSuccess && <Checkmark size={4} />}
          {!mutation.isPending && !showSuccess && 'Update'}
        </Button>
      </div>
      <span className="text-sm text-gray-500">(HH:MM:SS)</span>
    </div>
  )
}
