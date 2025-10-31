export const APP_NAME = "Credit Jambo"
export const APP_DESCRIPTION = "Secure savings management system for Credit Jambo Ltd customers"
export const COMPANY_NAME = "Credit Jambo Ltd"
export const COMPANY_ADDRESS = "NM 233 St, Nyamagumba, Musanze - Rwanda"
export const COMPANY_PHONE = "+250 788 268 451"
export const COMPANY_EMAIL = "hello@creditjambo.com"

export const CURRENCY = "RWF"
export const CURRENCY_SYMBOL = "RWF"

export const MIN_PASSWORD_LENGTH = 8
export const MAX_PASSWORD_LENGTH = 128

export const SESSION_DURATION = 24 * 60 * 60 // 24 hours in seconds

export const TRANSACTION_TYPES = {
  DEPOSIT: "deposit",
  WITHDRAW: "withdraw",
} as const

export const DEVICE_STATUS = {
  PENDING: "pending",
  VERIFIED: "verified",
  REJECTED: "rejected",
} as const