import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const formatTime = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'compliant':
      return 'text-success bg-success/10 border-success/20'
    case 'violations':
      return 'text-warning bg-warning/10 border-warning/20'
    case 'critical':
      return 'text-error bg-error/10 border-error/20'
    default:
      return 'text-neutral bg-neutral/10 border-neutral/20'
  }
}

export const getStatusText = (status: string): string => {
  switch (status) {
    case 'compliant':
      return 'Compliant'
    case 'violations':
      return 'Violations Detected'
    case 'critical':
      return 'Critical Issues'
    default:
      return 'Unknown'
  }
}

export const calculateCompliancePercentage = (compliant: number, total: number): number => {
  if (total === 0) return 0
  return Math.round((compliant / total) * 100)
}

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}